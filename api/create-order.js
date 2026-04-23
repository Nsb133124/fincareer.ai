import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Use POST" });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: 9900, // ₹99
      currency: "INR",
      receipt: "order_rcptid_11"
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    return res.status(500).json({
      error: "Order creation failed"
    });
  }
}