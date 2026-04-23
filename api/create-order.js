import Razorpay from "razorpay";

export default async function handler(req, res) {
  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Use POST" });
  }

  try {
    // 🔍 Debug env (check in Vercel logs)
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID ? "OK" : "MISSING");
    console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET ? "OK" : "MISSING");

    // 🚨 Validate env variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        error: "Razorpay keys missing in environment variables"
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: 9900, // ₹99
      currency: "INR",
      receipt: "receipt_1"
    });

    return res.status(200).json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      error: error.message || "Order creation failed"
    });
  }
}