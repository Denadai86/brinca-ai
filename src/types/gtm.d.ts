// src/types/gtm.d.ts

/**
 * Declara a estrutura global do dataLayer injetado pelo Google Tag Manager (GTM).
 * Isso resolve o erro do TypeScript ('dataLayer' não existe no tipo 'Window').
 */

// Anexa o dataLayer à interface Window.
interface Window {
    dataLayer: Record<string, any>[];
}

/**
 * Define o tipo de objeto que estamos enviando ao dataLayer (o evento de page_view).
 * Este é o tipo usado no GtmScript.tsx.
 */
interface GtmPushData {
    event: string;
    page: string;
    [key: string]: any; 
}