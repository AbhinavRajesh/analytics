import { NextApiRequest, NextApiResponse } from "next";
import { urlsDB } from "utils/deta";
import { firebaseAdmin, withAuth } from "utils/firebase-admin";

interface detaUrls {
  key: string;
  slug: string;
  url: string;
  uid: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization?.slice(7);
    if (typeof token !== "string")
      return res.status(401).json({ success: false, message: "Auth required" });
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const data = (await urlsDB
      .fetch({ uid: uid })
      .then((value) => value)) as unknown as detaUrls[];
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Some error occured. Please try again later",
    });
  }
};

export default withAuth(handler);
