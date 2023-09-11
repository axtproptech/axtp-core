import { RouteHandlerFunction } from "@/bff/route";
import aws from "aws-sdk";
import { getEnvVar } from "@/bff/getEnvVar";
import { nanoid } from "nanoid";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import { CreateUploadUrlRequest } from "@/types/createUploadUrlRequest";

const TargetBucketName = getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET");
const AccountId = getEnvVar("NEXT_SERVER_CF_R2_ACCOUNT_ID");
const AccessKeyId = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_KEY_ID"
);
const AccessKeySecret = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_SECRET"
);

console.log(TargetBucketName, AccessKeyId, AccessKeySecret);

// CF is AWS compatible
const r2 = new aws.S3({
  endpoint: `https://${AccountId}.r2.cloudflarestorage.com`,
  accessKeyId: `${AccessKeyId}`,
  secretAccessKey: `${AccessKeySecret}`,
  signatureVersion: "v4",
});

export const createUploadURL: RouteHandlerFunction = async (req, res) => {
  const { contentType } = req.body as CreateUploadUrlRequest;

  try {
    const signedUrl = await r2.getSignedUrlPromise("putObject", {
      Bucket: TargetBucketName,
      Key: nanoid(),
      Expires: 5 * 60,
      ContentType: contentType,
      ContentDisposition: "inline",
    });
    res.status(201).json({
      signedUrl,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// const handleUpload = (ev) => {
//     let file = uploadInput.current.files[0];
//     // Split the filename to get the name and type
//     let fileParts = uploadInput.current.files[0].name.split(".");
//     let fileName = fileParts[0];
//     let fileType = fileParts[1];
//     axios
//         .post("/api/awsimageupload", {
//             fileName: fileName,
//             fileType: fileType,
//         })
//         .then((res) => {
//             const signedRequest = res.data.signedRequest;
//             const url = res.data.url;
//             setUploadState({
//                 ...uploadState,
//                 url,
//             });
//
//             var options = {
//                 headers: {
//                     "Content-Type": fileType,
//                 },
//             };
//             axios
//                 .put(signedRequest, file, options)
//                 .then((_) => {
//                     setUploadState({ ...uploadState, success: true });
//                     mutate();
//                 })
//                 .catch((_) => {
//                     toast("error", "We could not upload your image");
//                 });
//         })
//         .catch((error) => {
//             toast("error", "We could not upload your image");
//         });
// };
