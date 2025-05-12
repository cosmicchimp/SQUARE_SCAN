import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
    region:"us-east-2",
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    },
})
module.exports = s3