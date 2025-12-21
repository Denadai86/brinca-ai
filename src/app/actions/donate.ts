// src/app/actions/donate.ts
"use server";

import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function createPixDonation(userId: string, email: string, amount: number) {
  const payment = new Payment(client);

  try {
    const response = await payment.create({
      body: {
        transaction_amount: amount,
        description: "Doação Brinca-AI (Apoio ao Professor)",
        payment_method_id: "pix",
        payer: {
          email: email,
        },
        // O PULO DO GATO 🐈: Enviamos o ID do usuário para o Mercado Pago
        // Quando o pagamento voltar, saberemos quem pagou por esse campo.
        external_reference: userId, 
      },
    });

    // 🔍 CORREÇÃO AQUI:
    // O QR Code fica dentro de 'point_of_interaction.transaction_data'
    const interaction = response.point_of_interaction;

    return {
      success: true,
      qr_code: interaction?.transaction_data?.qr_code,
      qr_code_base64: interaction?.transaction_data?.qr_code_base64,
      ticket_url: interaction?.transaction_data?.ticket_url,
      id: response.id,
    };

  } catch (error) {
    console.error("Erro ao gerar Pix:", error);
    return { success: false, error: "Falha ao gerar Pix" };
  }
}