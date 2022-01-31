import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "utils/firebase-admin";

interface Data {
  success: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    let token = req.headers.authorization;
    if (typeof token === "string" && token.startsWith("Bearer")) {
      token = token.slice(7);
      const decodedToken = await firebaseAdmin
        .auth()
        .verifyIdToken(token as string);
      if (decodedToken?.email === process.env.EMAIL) {
        return res.status(200).json({
          success: true,
        });
      }
    }
    return res.status(403).json({
      success: false,
      message: "Unauthorized account!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}
