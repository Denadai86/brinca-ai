// src/lib/instagram-slides.ts
//
// Monta o carrossel do Instagram (1080×1350, formato 4:5) desenhando direto em <canvas>.
// Roda 100% no navegador: sem servidor, sem custo, sem endpoint público para abusarem.
// Não toca em `document`/`window`: o canvas vem de `createCanvas`, o que também permite testar.
//
// Slides: capa → materiais → passo a passo (quantos forem precisos) → objetivo + convite.

import type { ParsedActivity } from "@/lib/activity-format";

export const SLIDE_WIDTH = 1080;
export const SLIDE_HEIGHT = 1350;

export interface CarouselInput {
  activity: ParsedActivity;
  tema: string;
  target: string;
}

export interface CarouselOptions {
  createCanvas: (width: number, height: number) => HTMLCanvasElement;
  /** família de fonte em formato CSS (ex.: a font-family computada do body) */
  fontFamily: string;
  /** endereço que aparece em todos os slides, ex.: "brinca-ai.acaoleve.com" */
  siteLabel: string;
}

type Ctx = CanvasRenderingContext2D;

// ------------------------------------------------------------------ layout
const W = SLIDE_WIDTH;
const H = SLIDE_HEIGHT;
const CARD = { x: 48, y: 48, w: W - 96, h: H - 96, r: 56 };
const HEADER_H = 150;
const FOOTER_H = 120;
const PAD_X = 72;
const C = {
  x0: CARD.x + PAD_X, //                              início do texto
  w: CARD.w - PAD_X * 2, //                           largura útil
  y0: CARD.y + HEADER_H + 8, //                       topo do conteúdo
  y1: CARD.y + CARD.h - FOOTER_H - 36, //             base do conteúdo
};
const LIST_HEADING_H = 120;

const COLOR = {
  ink: "#0f172a",
  body: "#334155",
  purple: "#7c3aed",
  purpleDark: "#4c1d95",
  pink: "#ec4899",
  lilac: "#ede9fe",
  lilacText: "#5b21b6",
  yellowBg: "#fefce8",
  yellow: "#facc15",
  yellowInk: "#713f12",
  blueBg: "#eff6ff",
  blue: "#3b82f6",
  blueInk: "#1e3a8a",
};

const font = (weight: number, size: number, family: string, italic = false) =>
  `${italic ? "italic " : ""}${weight} ${size}px ${family}`;

// ------------------------------------------------------------------ texto
function wrapText(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
      continue;
    }
    if (line) {
      lines.push(line);
      line = "";
    }
    if (ctx.measureText(word).width > maxWidth) {
      // palavra maior que a linha: quebra por caractere
      let chunk = "";
      for (const ch of Array.from(word)) {
        if (chunk && ctx.measureText(chunk + ch).width > maxWidth) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk += ch;
        }
      }
      line = chunk;
    } else {
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function ellipsize(ctx: Ctx, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function capLines(ctx: Ctx, lines: string[], maxLines: number, maxWidth: number): string[] {
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = ellipsize(ctx, `${kept[maxLines - 1]}…`, maxWidth);
  return kept;
}

function drawLines(ctx: Ctx, lines: string[], x: number, y: number, lineHeight: number): number {
  ctx.textBaseline = "top";
  for (const l of lines) {
    ctx.fillText(l, x, y);
    y += lineHeight;
  }
  return y;
}

// ------------------------------------------------------------------ formas
function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function brandGradient(ctx: Ctx, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#7c3aed");
  g.addColorStop(0.55, "#ec4899");
  g.addColorStop(1, "#fb923c");
  return g;
}

// ------------------------------------------------------------------ moldura
/** Seta → desenhada como forma: não depende de a fonte do aparelho ter esse caractere. */
function drawArrow(ctx: Ctx, x: number, cy: number, len: number) {
  ctx.save();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x + len, cy);
  ctx.moveTo(x + len - 14, cy - 14);
  ctx.lineTo(x + len, cy);
  ctx.lineTo(x + len - 14, cy + 14);
  ctx.stroke();
  ctx.restore();
}

type FooterHint = "swipe" | "save";

function drawFrame(
  ctx: Ctx,
  o: CarouselOptions,
  pageLabel: string,
  hint: FooterHint,
  decorate?: () => void
) {
  const fam = o.fontFamily;

  // fundo em degradê da marca
  ctx.fillStyle = brandGradient(ctx, 0, 0, W, H);
  ctx.fillRect(0, 0, W, H);

  // cartão branco
  roundRect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // decoração opcional: fica por baixo do cabeçalho e do rodapé
  if (decorate) {
    ctx.save();
    roundRect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
    ctx.clip();
    decorate();
    ctx.restore();
  }

  // faixa escura do rodapé (recortada pelo cartão)
  ctx.save();
  roundRect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
  ctx.clip();
  ctx.fillStyle = COLOR.ink;
  ctx.fillRect(CARD.x, CARD.y + CARD.h - FOOTER_H, CARD.w, FOOTER_H);
  ctx.restore();

  // cabeçalho: logo + contador
  const headerMid = CARD.y + HEADER_H / 2;
  roundRect(ctx, C.x0, headerMid - 32, 64, 64, 20);
  ctx.fillStyle = brandGradient(ctx, C.x0, headerMid - 32, C.x0 + 64, headerMid + 32);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = font(900, 40, fam);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("B", C.x0 + 32, headerMid + 2);

  ctx.textAlign = "left";
  ctx.fillStyle = COLOR.purpleDark;
  ctx.font = font(900, 44, fam);
  ctx.fillText("Brinca-AI", C.x0 + 82, headerMid + 2);

  ctx.font = font(800, 28, fam);
  const pillW = ctx.measureText(pageLabel).width + 48;
  const pillX = C.x0 + C.w - pillW;
  roundRect(ctx, pillX, headerMid - 26, pillW, 52, 26);
  ctx.fillStyle = COLOR.lilac;
  ctx.fill();
  ctx.fillStyle = COLOR.lilacText;
  ctx.textAlign = "center";
  ctx.fillText(pageLabel, pillX + pillW / 2, headerMid + 2);

  // rodapé: endereço (todo slide leva a marca) + dica
  const footMid = CARD.y + CARD.h - FOOTER_H / 2;
  ctx.textAlign = "left";
  ctx.font = font(800, 30, fam);
  ctx.fillStyle = "#f472b6";
  ctx.fillText(o.siteLabel, C.x0, footMid + 2);

  ctx.font = font(700, 28, fam);
  ctx.fillStyle = "#e2e8f0";
  ctx.textAlign = "right";
  if (hint === "swipe") {
    const right = C.x0 + C.w;
    ctx.fillText("Deslize", right - 52, footMid + 2);
    drawArrow(ctx, right - 40, footMid, 40);
  } else {
    ctx.fillText("Salve e compartilhe", C.x0 + C.w, footMid + 2);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
}

// ------------------------------------------------------------------ capa
function drawCover(ctx: Ctx, o: CarouselOptions, input: CarouselInput, pageLabel: string) {
  const fam = o.fontFamily;
  drawFrame(ctx, o, pageLabel, "swipe", () => {
    // bolhas decorativas bem suaves
    ctx.fillStyle = "#f5f3ff";
    ctx.beginPath();
    ctx.arc(CARD.x + CARD.w - 40, CARD.y + HEADER_H + 120, 230, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fdf2f8";
    ctx.beginPath();
    ctx.arc(CARD.x + 60, CARD.y + CARD.h - FOOTER_H - 40, 190, 0, Math.PI * 2);
    ctx.fill();
  });

  let y = C.y0 + 4;

  // tema
  ctx.font = font(800, 30, fam);
  ctx.fillStyle = "#a855f7";
  const temaLines = capLines(ctx, wrapText(ctx, input.tema.toUpperCase(), C.w), 2, C.w);
  y = drawLines(ctx, temaLines, C.x0, y, 40) + 14;

  // faixa etária
  if (input.target) {
    ctx.font = font(700, 30, fam);
    const label = ellipsize(ctx, input.target, 640);
    const w = ctx.measureText(label).width + 56;
    roundRect(ctx, C.x0, y, w, 60, 30);
    ctx.fillStyle = COLOR.lilac;
    ctx.fill();
    ctx.fillStyle = COLOR.lilacText;
    ctx.textBaseline = "middle";
    ctx.fillText(label, C.x0 + 28, y + 31);
    ctx.textBaseline = "top";
    y += 60 + 28;
  }

  // frase motivacional (ancorada embaixo)
  let boxTop = C.y1;
  const quote = input.activity.motivacional;
  if (quote) {
    ctx.font = font(600, 34, fam, true);
    const textW = C.w - 36 * 2 - 14;
    const qLines = capLines(ctx, wrapText(ctx, quote, textW), 4, textW);
    const lh = 46;
    const boxH = qLines.length * lh + 60;
    boxTop = C.y1 - boxH;

    roundRect(ctx, C.x0, boxTop, C.w, boxH, 28);
    ctx.fillStyle = COLOR.yellowBg;
    ctx.fill();
    ctx.save();
    roundRect(ctx, C.x0, boxTop, C.w, boxH, 28);
    ctx.clip();
    ctx.fillStyle = COLOR.yellow;
    ctx.fillRect(C.x0, boxTop, 14, boxH);
    ctx.restore();

    ctx.fillStyle = COLOR.yellowInk;
    ctx.font = font(600, 34, fam, true);
    drawLines(ctx, qLines, C.x0 + 14 + 36, boxTop + 30, lh);
  }

  // título: o maior tamanho que couber, centralizado no espaço que sobrou
  const top = y;
  const bottom = quote ? boxTop - 36 : C.y1;
  const availH = Math.max(120, bottom - top);
  let size = 104;
  let lines: string[] = [];
  for (; size >= 56; size -= 4) {
    ctx.font = font(900, size, fam);
    lines = wrapText(ctx, input.activity.titulo, C.w);
    if (lines.length <= 5 && lines.length * size * 1.12 <= availH) break;
  }
  size = Math.max(size, 56);
  ctx.font = font(900, size, fam);
  const lh = size * 1.12;
  lines = capLines(ctx, lines, Math.max(1, Math.floor(availH / lh)), C.w);
  const blockH = lines.length * lh;
  ctx.fillStyle = COLOR.ink;
  drawLines(ctx, lines, C.x0, top + (availH - blockH) / 2, lh);
}

// ------------------------------------------------------------------ listas
type ListItem = { lines: string[]; n: number; height: number };
type ListKind = "materiais" | "passos";
type ListSpec = { size: number; lh: number; textW: number; maxLines: number; weight: number; indent: number };

const ITEM_GAP = 30;
const LIST_SIZES: Record<ListKind, number[]> = {
  materiais: [42, 40, 38, 36],
  passos: [40, 38, 36, 34],
};

function listSpec(kind: ListKind, size: number): ListSpec {
  const indent = kind === "materiais" ? 56 : 92;
  return {
    size,
    lh: Math.round(size * 1.37),
    textW: C.w - indent,
    maxLines: kind === "materiais" ? 5 : 9,
    weight: 600,
    indent,
  };
}

function paginateWith(ctx: Ctx, o: CarouselOptions, spec: ListSpec, texts: string[]): ListItem[][] {
  ctx.font = font(spec.weight, spec.size, o.fontFamily);

  const items: ListItem[] = texts.map((t, i) => {
    const lines = capLines(ctx, wrapText(ctx, t, spec.textW), spec.maxLines, spec.textW);
    return { lines, n: i + 1, height: Math.max(lines.length * spec.lh, 58) };
  });

  const available = C.y1 - C.y0 - LIST_HEADING_H;
  const pages: ListItem[][] = [];
  let page: ListItem[] = [];
  let used = 0;

  for (const item of items) {
    const need = item.height + (page.length ? ITEM_GAP : 0);
    if (page.length && used + need > available) {
      pages.push(page);
      page = [];
      used = 0;
    }
    used += item.height + (page.length ? ITEM_GAP : 0);
    page.push(item);
  }
  if (page.length) pages.push(page);
  return pages;
}

/**
 * Escolhe o MAIOR tamanho de letra que ainda usa o menor número de slides possível:
 * assim os slides ficam cheios e legíveis, sem páginas meio vazias.
 */
function paginateList(
  ctx: Ctx,
  o: CarouselOptions,
  kind: ListKind,
  texts: string[]
): { pages: ListItem[][]; spec: ListSpec } {
  const sizes = LIST_SIZES[kind];
  const attempts = sizes.map((size) => {
    const spec = listSpec(kind, size);
    return { spec, pages: paginateWith(ctx, o, spec, texts) };
  });
  const minPages = Math.min(...attempts.map((a) => a.pages.length));
  return attempts.find((a) => a.pages.length === minPages)!; // sizes vem do maior para o menor
}

function drawListPage(
  ctx: Ctx,
  o: CarouselOptions,
  kind: ListKind,
  spec: ListSpec,
  items: ListItem[],
  part: number,
  parts: number,
  pageLabel: string
) {
  const fam = o.fontFamily;
  drawFrame(ctx, o, pageLabel, "swipe");

  // título da seção
  const base = kind === "materiais" ? "🧺 Você vai precisar de" : "👣 Passo a passo";
  const heading = parts > 1 ? `${base} (${part}/${parts})` : base;
  ctx.font = font(900, 54, fam);
  ctx.fillStyle = COLOR.purpleDark;
  ctx.textBaseline = "top";
  ctx.fillText(ellipsize(ctx, heading, C.w), C.x0, C.y0);

  roundRect(ctx, C.x0, C.y0 + 76, 140, 10, 5);
  ctx.fillStyle = brandGradient(ctx, C.x0, 0, C.x0 + 140, 0);
  ctx.fill();

  let y = C.y0 + LIST_HEADING_H;
  for (const item of items) {
    const firstLineMid = y + spec.lh / 2;

    if (kind === "materiais") {
      ctx.beginPath();
      ctx.arc(C.x0 + 16, firstLineMid, 12, 0, Math.PI * 2);
      ctx.fillStyle = COLOR.yellow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(C.x0 + 16, firstLineMid, 12, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#eab308";
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(C.x0 + 30, firstLineMid, 29, 0, Math.PI * 2);
      ctx.fillStyle = brandGradient(ctx, C.x0, firstLineMid - 29, C.x0 + 60, firstLineMid + 29);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = font(900, 32, fam);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(item.n), C.x0 + 30, firstLineMid + 1);
      ctx.textAlign = "left";
    }

    ctx.font = font(spec.weight, spec.size, fam);
    ctx.fillStyle = COLOR.body;
    ctx.textBaseline = "top";
    drawLines(ctx, item.lines, C.x0 + spec.indent, y, spec.lh);

    y += item.height + ITEM_GAP;
  }
}

// ------------------------------------------------------------------ fechamento
function drawClosing(ctx: Ctx, o: CarouselOptions, input: CarouselInput, pageLabel: string) {
  const fam = o.fontFamily;
  drawFrame(ctx, o, pageLabel, "save");

  let y = C.y0;

  // objetivo pedagógico
  if (input.activity.pedagogico) {
    ctx.font = font(900, 50, fam);
    ctx.fillStyle = COLOR.purpleDark;
    const head = capLines(ctx, wrapText(ctx, "🎯 Por que isso importa", C.w), 1, C.w);
    y = drawLines(ctx, head, C.x0, y, 62) + 22;

    ctx.font = font(600, 36, fam);
    const textW = C.w - 36 * 2 - 14;
    const lines = capLines(ctx, wrapText(ctx, input.activity.pedagogico, textW), 7, textW);
    const lh = 50;
    const boxH = lines.length * lh + 60;

    roundRect(ctx, C.x0, y, C.w, boxH, 28);
    ctx.fillStyle = COLOR.blueBg;
    ctx.fill();
    ctx.save();
    roundRect(ctx, C.x0, y, C.w, boxH, 28);
    ctx.clip();
    ctx.fillStyle = COLOR.blue;
    ctx.fillRect(C.x0, y, 14, boxH);
    ctx.restore();

    ctx.fillStyle = COLOR.blueInk;
    ctx.font = font(600, 36, fam);
    drawLines(ctx, lines, C.x0 + 14 + 36, y + 30, lh);
    y += boxH;
  }

  // convite (ancorado embaixo)
  ctx.font = font(900, 54, fam);
  const ctaLines = capLines(ctx, wrapText(ctx, "Quer atividades assim para a sua turma?", C.w), 3, C.w);
  const ctaLh = 66;
  const pillH = 92;
  const ctaH = ctaLines.length * ctaLh + 20 + 40 + pillH;
  const ctaTop = Math.max(y + 40, C.y1 - ctaH);

  ctx.fillStyle = COLOR.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  let cy = ctaTop;
  for (const l of ctaLines) {
    ctx.fillText(l, C.x0 + C.w / 2, cy);
    cy += ctaLh;
  }

  ctx.font = font(600, 32, fam);
  ctx.fillStyle = "#64748b";
  ctx.fillText("Crie as suas, do jeitinho da sua turma:", C.x0 + C.w / 2, cy + 8);
  cy += 60;

  ctx.font = font(900, 42, fam);
  const urlW = Math.min(C.w, ctx.measureText(o.siteLabel).width + 96);
  const pillX = C.x0 + (C.w - urlW) / 2;
  roundRect(ctx, pillX, cy, urlW, pillH, pillH / 2);
  ctx.fillStyle = brandGradient(ctx, pillX, cy, pillX + urlW, cy + pillH);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(ellipsize(ctx, o.siteLabel, urlW - 40), C.x0 + C.w / 2, cy + pillH / 2 + 2);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
}

// ------------------------------------------------------------------ API
type Plan =
  | { kind: "cover" }
  | { kind: ListKind; spec: ListSpec; items: ListItem[]; part: number; parts: number }
  | { kind: "closing" };

// O Instagram aceita no máximo 20 imagens por carrossel.
const MAX_SLIDES = 20;

/** Gera os slides do carrossel (um canvas por slide, na ordem de postagem). */
export function renderCarousel(input: CarouselInput, o: CarouselOptions): HTMLCanvasElement[] {
  // 1) medir e paginar com um canvas "de rascunho"
  const scratch = o.createCanvas(W, H);
  const mctx = scratch.getContext("2d") as Ctx;

  const plan: Plan[] = [{ kind: "cover" }];

  const mats = paginateList(mctx, o, "materiais", input.activity.materiais);
  mats.pages.forEach((items, i) =>
    plan.push({ kind: "materiais", spec: mats.spec, items, part: i + 1, parts: mats.pages.length })
  );

  const steps = paginateList(mctx, o, "passos", input.activity.passos);
  steps.pages.forEach((items, i) =>
    plan.push({ kind: "passos", spec: steps.spec, items, part: i + 1, parts: steps.pages.length })
  );

  // Raríssimo, mas garante o limite: corta os últimos slides de passos e mantém o fechamento.
  while (plan.length + 1 > MAX_SLIDES) {
    const lastSteps = plan.map((s) => s.kind).lastIndexOf("passos");
    if (lastSteps <= 0) break;
    plan.splice(lastSteps, 1);
  }

  plan.push({ kind: "closing" });

  // 2) desenhar cada slide
  return plan.map((slide, i) => {
    const canvas = o.createCanvas(W, H);
    const ctx = canvas.getContext("2d") as Ctx;
    const label = `${i + 1}/${plan.length}`;

    if (slide.kind === "cover") drawCover(ctx, o, input, label);
    else if (slide.kind === "closing") drawClosing(ctx, o, input, label);
    else drawListPage(ctx, o, slide.kind, slide.spec, slide.items, slide.part, slide.parts, label);

    return canvas;
  });
}
