import fs from "fs";
import axios from "axios";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../../lib/S3Client";
import { PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl} from "@aws-sdk/s3-request-presigner";



export default async function handler(req, res) {


  console.log("ENTERING UPLOAD4...");


  // const fileStream = fs.createReadStream(req.body);

  // try {
  //   const parallelUploads3 = new Upload({
  //     // client: new S3({}) || new S3Client({}),
  //     client: new S3Client({}),


  //     params: {
  //       Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
  //       Key: req.query.filename,
  //       Body: fileStream,
  //       ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //     },
    

  //   });
  
  //   parallelUploads3.on("httpUploadProgress", (progress) => {
  //     console.log(progress);
  //   });
  
  //   await parallelUploads3.done();

  // } catch (e) {

  //   console.log(e);
  // }


  // For the following see: https://betterprogramming.pub/how-to-upload-files-to-amazon-s3-from-nextjs-app-b7ef1909976b
  try {

    console.log("GETTING NAME, TYPE, FILE...");
    let { name, type, body } = req.body;
    console.log("name = ", name);
    console.log("type = ", type);
    console.log("body = ", body);

    console.log("SETTING PARAMS...");
    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: name,
      Body: req.query.Body,
      ContentType: type
    };

    console.log("SETTING PUTOBJECTCOMMAND...");
    const command = new PutObjectCommand(params);
    // const url = await S3Client.getSignedUrlPromise("putObject", params);
    console.log("SETTING URL...REQ.KEY = ",req.filename);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    console.log("GOT URL; DOING AXIOS PUT....");

    await axios.put(url, body, {
      headers: {
        "Content-type": type,
        "Access-Control-Allow-Origin": "*"
      }
    })


  } catch (e) {

    console.log(e);
  }


}

