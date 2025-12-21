// src/app/api/webhooks/mercadopago/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/firebase"; // Seu firebase configurado
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");

    if (topic === "payment" && id) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      // Só nos interessa pagamento APROVADO
      if (paymentData.status === "approved") {
        const userId = paymentData.external_reference; // Lembra do Pulo do Gato?

        if (userId) {
          console.log(`💰 Pagamento aprovado para user: ${userId}`);

          // Atualiza o Firestore
          const userRef = doc(db, "users", userId);
          
          await updateDoc(userRef, {
            isSupporter: true,
            // Guardamos histórico para o futuro ranking (gamificação)
            donations: arrayUnion({
              id: paymentData.id,
              amount: paymentData.transaction_amount,
              date: Timestamp.now(),
            }),
            lastDonationAt: Timestamp.now()
          });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}