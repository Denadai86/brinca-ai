// src/app/api/webhooks/mercadopago/route.ts


import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/firebase-admin"; // ✅ Admin SDK
import { FieldValue } from "firebase-admin/firestore"; // Importante para arrayUnion

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

      if (paymentData.status === "approved") {
        const userId = paymentData.external_reference;

        if (userId) {
          console.log(`💰 Pagamento aprovado para user: ${userId}`);

          // Sintaxe Admin SDK
          await db.collection("users").doc(userId).update({
            isSupporter: true,
            donations: FieldValue.arrayUnion({
              id: paymentData.id,
              amount: paymentData.transaction_amount,
              date: new Date(),
            }),
            lastDonationAt: new Date()
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