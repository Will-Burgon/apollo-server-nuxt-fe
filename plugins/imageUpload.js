import Vue from "vue";
import AWS from "aws-sdk";
Vue.prototype.$imageUpload = () => {
  AWS.config.update({ region: "eu-west-2" });
  const bucket = "photography-collection-bucket-123";
  const s3 = new AWS.S3({
    accessKeyId: process.env.access_key_id,
    secretAccessKey: process.env.secret_access_key
  });
  return { bucket, s3 };
};
