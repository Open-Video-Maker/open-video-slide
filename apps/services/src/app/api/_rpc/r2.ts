import {
  GetObjectCommand,
  type GetObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { S3 } from "@/provider/s3";

export interface GetObjectParams extends Omit<GetObjectCommandInput, "Bucket"> {
  Bucket?: GetObjectCommandInput["Bucket"];
}
export async function getObject({ Bucket, Key, ...rests }: GetObjectParams) {
  const result = await S3.send(
    new GetObjectCommand({ Bucket: Bucket ?? "ovm", Key, ...rests }),
  );

  return result.Body?.transformToWebStream();
}

export interface PutObjectParams extends Omit<PutObjectCommandInput, "Bucket"> {
  Bucket?: PutObjectCommandInput["Bucket"];
}
export async function putObject({
  Bucket,
  Key,
  Body,
  ...rests
}: PutObjectParams) {
  const result = await S3.send(
    new PutObjectCommand({ Bucket: Bucket ?? "ovm", Key, Body, ...rests }),
  );
  return result;
}
