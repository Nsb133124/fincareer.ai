export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Use POST" });
  }

  try {
    // ✅ Dynamic import (fixes Vercel issues)
    const Razorpay = (await import("razorpay")).default;

    // ✅ Check env variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        error: "Missing Razorpay environment variables"
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: 9900,
      currency: "INR",
      receipt: "receipt_1"
    });

    return res.status(200).json(order);

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server crashed"
    });
  }
}