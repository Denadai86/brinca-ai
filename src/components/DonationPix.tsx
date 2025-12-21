"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Heart, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// --- UTILITÁRIO DE GERAÇÃO DO PAYLOAD PIX (EMV) ---
// Isso transforma sua chave no padrão "000201..." que o banco lê.
function generatePixPayload(key: string, name: string, city: string, txid: string = "***", value?: number) {
  const formatField = (id: string, value: string) => {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
  };

  const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const merchantName = removeAccents(name).substring(0, 25).toUpperCase();
  const merchantCity = removeAccents(city).substring(0, 15).toUpperCase();
  const amount = value ? value.toFixed(2) : "0.00";

  let payload = 
    formatField("00", "01") +                           // Payload Format Indicator
    formatField("26",                                   // Merchant Account Information
      formatField("00", "br.gov.bcb.pix") + 
      formatField("01", key)
    ) +
    formatField("52", "0000") +                         // Merchant Category Code
    formatField("53", "986");                           // Transaction Currency (BRL)

  if (value) {
    payload += formatField("54", amount);               // Transaction Amount
  }

  payload += 
    formatField("58", "BR") +                           // Country Code
    formatField("59", merchantName) +                   // Merchant Name
    formatField("60", merchantCity) +                   // Merchant City
    formatField("62",                                   // Additional Data Field Template
      formatField("05", txid)                           // Reference Label (TxID)
    ) +
    "6304";                                             // CRC16 ID

  // Cálculo do CRC16 (Cyclic Redundancy Check)
  const polynomial = 0x1021;
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }
  
  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
  return payload + crcHex;
}

// --- COMPONENTE VISUAL ---
interface DonationPixProps {
  pixKey: string;
  beneficiario?: string; // Nome de quem recebe
  cidade?: string;       // Cidade de quem recebe
}

export function DonationPix({ 
  pixKey, 
  beneficiario = "ACAO LEVE", // Defina um nome padrão se quiser
  cidade = "SAO PAULO" 
}: DonationPixProps) {
  const [copied, setCopied] = useState(false);

  // Gera o código "Copia e Cola" real
  const pixPayload = useMemo(() => {
    return generatePixPayload(pixKey, beneficiario, cidade);
  }, [pixKey, beneficiario, cidade]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-xl border border-slate-100 text-center">
      
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 animate-pulse">
          <Heart size={24} className="fill-pink-600" />
        </div>
        <div>
          <h4 className="text-lg font-black text-slate-800">Gostou da Mágica?</h4>
          <p className="text-xs text-slate-500 font-medium max-w-[200px] mx-auto">
            Ajude a manter o Brinca-AI no ar com qualquer valor! ☕
          </p>
        </div>
      </div>

      {/* Área do QR Code */}
      <div className="relative mx-auto mb-6 w-fit rounded-xl border-4 border-slate-900 p-2 shadow-lg bg-white group hover:scale-105 transition-transform">
        <QRCodeCanvas 
          value={pixPayload} 
          size={180}
          level={"M"}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"} // Slate-900
          marginSize={2}
        />
        {/* Ícone central sobreposto (Opcional, estilo NuBank) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-1.5 rounded-full shadow-sm">
             <QrCode size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Botão Copia e Cola */}
      <div className="space-y-3">
        <div className="relative flex items-center gap-2 rounded-xl bg-slate-50 p-2 pr-3 border border-slate-200">
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3 text-[10px] font-mono text-slate-400">
            {pixPayload}
          </div>
          
          <button
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
              copied
                ? "bg-green-500 text-white shadow-green-200 shadow-md scale-105"
                : "bg-slate-900 text-white shadow-md hover:bg-purple-600 active:scale-95"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={14} />
                Pix Copia e Cola
              </>
            )}
          </button>
        </div>
        
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Chave Aleatória Segura
        </p>
      </div>
    </div>
  );
}