import assert from "node:assert";

import { S3Client } from "@aws-sdk/client-s3";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
assert(ACCOUNT_ID, "ACCOUNT_ID is not set");
assert(ACCESS_KEY_ID, "ACCESS_KEY_ID is not set");
assert(SECRET_ACCESS_KEY, "SECRET_ACCESS_KEY is not set");

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
