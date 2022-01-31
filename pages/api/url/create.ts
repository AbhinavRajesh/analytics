import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { urlsDB } from "utils/deta";
import { withAuth } from "utils/firebase-admin";

interface Data {}

interface detaUrls {
  key: string;
  slug: string;
  url: string;
  uid: string;
}

interface CreateUrlBody {
  slug: string;
  url: string;
  uid: string;
}

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
  uid: yup.string().trim().required(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug, url, uid }: CreateUrlBody = JSON.parse(req.body);
  try {
    const newUrl = {
      slug,
      url,
      uid,
    };
    await schema.validate(newUrl);
    if (!slug) {
      newUrl.slug = nanoid(6);
    }
    newUrl.slug = slug.toLowerCase();
    const existing = (await urlsDB
      ?.fetch({ slug })
      .then((res) => res)) as unknown as detaUrls[];
    if (existing.length > 0) {
      throw new Error("Slug already in use");
    } else {
      await urlsDB.put(newUrl);
      return res.status(200).json({
        success: true,
        slug,
        url,
      });
    }
  } catch (error: any) {
    return res.status(error?.status ?? 500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export default withAuth(handler);
