import { NextApiRequest, NextApiResponse } from "next";
import { urlsDB } from "utils/deta";
import { withAuth } from "utils/firebase-admin";

interface detaUrls {
  key: string;
  slug: string;
  url: string;
  uid: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { slug } = req.query;
    const url = (await urlsDB
      .fetch({ slug: (slug as string).toLowerCase() })
      .then((value) => value)) as unknown as detaUrls[];
    if (url.length > 0) {
      return res.status(200).json(url[0]);
    } else {
      throw new Error("Invalid slug");
    }
  } catch (err: any) {
    if (err.message.includes("Invalid slug"))
      return res.status(404).json({
        success: false,
        error: err.message,
      });
    else
      return res.status(500).json({
        success: false,
        error: "Some error occured. Please try again later",
      });
  }
};

export default withAuth(handler);
