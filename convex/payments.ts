import { httpAction } from "./_generated/server";

export const chapaInitialize = httpAction(async (ctx, request) => {
  const body = await request.json();
  const { amount, email, firstName, lastName, txRef, orderId } = body as {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    txRef: string;
    orderId: string;
  };

  try {
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: txRef,
        callback_url: `${process.env.CONVEX_SITE_URL}/chapa-webhook`,
        return_url: `okaz://payment/success?order=${orderId}`,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Payment initialization failed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});

export const chapaWebhook = httpAction(async (ctx, request) => {
  const body = await request.json();
  const { tx_ref, status } = body as { tx_ref: string; status: string };

  if (status === "success") {
    // Find order by chapaTxRef and update payment status
    // This will be called by Chapa's webhook
    // We'd query orders and update, but need internal mutation for that
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// OPTIONS preflight for chapa endpoints
export const chapaOptions = httpAction(async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
});
