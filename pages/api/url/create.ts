import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { urlsDB } from "utils/deta";
import { withAuth } from "utils/firebase-admin";
import { supabase } from "utils/supabase";

interface DataError {
  success: false;
  message?: string;
}
interface DataSuccess {
  success: true;
  slug: string;
  url: string;
}

interface UrlsResponse {
  id: number | string;
  created_at: string;
  slug: string;
  url: string;
}

interface CreateUrlBody {
  slug?: string;
  url: string;
  user_id: string;
}

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<DataSuccess | DataError>
) => {
  const { slug, url, user_id }: CreateUrlBody = JSON.parse(req.body);
  console.log(JSON.parse(req.body));
  try {
    const newUrl = {
      slug,
      url,
    };
    await schema.validate(newUrl);
    if (!slug) {
      newUrl.slug = nanoid(6).toLowerCase();
    } else {
      newUrl.slug = slug.toLowerCase();
    }
    const existing = await supabase
      .from<UrlsResponse>("urls")
      .select()
      .eq("slug", newUrl.slug);
    console.log(existing);
    if (existing.error) console.log(existing.error);
    if (slug && existing.data && existing?.data?.length !== 0) {
      throw new Error("Slug already in use");
    } else if (typeof slug === "undefined") {
      newUrl.slug = nanoid(6);
    }
    const { data, error } = await supabase
      .from<UrlsResponse>("urls")
      .insert([newUrl]);

    if (data) {
      const pivotTable = await supabase
        .from<{ users_id: string; urls_id: number }>("urls_users")
        .insert([{ urls_id: data[0].id as number, users_id: user_id }]);
      console.log(pivotTable);
      if (pivotTable.error)
        throw new Error("Some error occured! Try again later.");
    }

    if (error) {
      console.log(error);
      throw new Error("Some error occured. Please try again later");
    }
    if (data && data[0])
      return res.status(200).json({
        success: true,
        slug: data?.[0].slug ?? slug,
        url: data?.[0].url ?? url,
      });
    throw new Error();
  } catch (error: any) {
    return res.status(error?.status ?? 500).json({
      success: false,
      message: error?.message ?? "Internal server error",
    });
  }
};

export default withAuth(handler);
