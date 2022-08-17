import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "../../lib/S3Client";

import { Buffer } from 'buffer';

export default async function handler(req, res) {


  console.log("ENTERING UPLOAD2...");
  // console.log("req.body= ",req.body);



  // create a buffer containing data from the request object.
  // this buffer is required because the "put object" command in
  // the send command below requires a length of what
  //  is to be sent.  A buffer will provide this.
  // See comment posted on Jan 29, 2019 at https://github.com/aws/aws-sdk-net/issues/1073
  const buf = Buffer.from(req.body, 'utf8');

  console.log('buf: ', buf);
  console.log('********************')


  
  //from: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html

  const metadata = {
    x_amz_meta_author: 'Gary Marshall',
    x_amz_meta_userid: 'cu123456',
    x_amz_meta_role: 'CU USER',
    x_amz_meta_milstripAuth: 'true'
  }
  const params = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key: req.query.filename,
    Metadata: metadata,
    Body: buf
  };

  //Other possible options 
  // "xls"       => "application/vnd.ms-excel",
  // "xlsx"      => "vnd.ms-excel",

  try {

    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
        "Successfully created " + params.Key + " and uploaded it to " +
        params.Bucket + "/" + params.Key
    );

    res.status(200).json({ results })
    // return results; // For unit tests.

  } catch (err) {

    console.log("ERROR OCURRED UPLOADING FILE: ", err);
    res.status(500).json();

  }

}

