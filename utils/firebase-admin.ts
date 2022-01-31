import * as firebaseAdmin from "firebase-admin";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

if (!firebaseAdmin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
  });
}

export { firebaseAdmin };

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).end("Not authenticated. No Auth header");
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      if (decodedToken.email !== process.env.EMAIL)
        return res.status(403).end("Unauthorized");
    } catch (error: any) {
      console.log(error.errorInfo);
      const errorCode = error.errorInfo.code;
      error.status = 401;
      if (errorCode === "auth/internal-error") {
        error.status = 500;
      }
      return res.status(error.status).json({ error: errorCode });
    }

    return handler(req, res);
  };
}
