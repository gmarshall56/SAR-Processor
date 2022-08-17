import fs from "fs";
// import AWS, { S3 } from "aws-sdk";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";


console.log("START");

// const s3Client = new AWS.S3({
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//   }
// })

// const s3Client = new S3Client({
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//   }
// })

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {

  console.log("START2");

  const form = formidable();

  
  
  console.log("START3");
  form.parse(req, async(err, fields, files) => {

    console.log("START5");
    if(!files.fileselected) {
      console.log("NO FILE SELECTED");
      res.status(400).send("NO FILE SELECTED");
      return;
    }

    console.log("START6");

    // console.log("fileselected.filepath " + files.fileselected.filepath);



    // // //console.log("FILESELETED: " + files.fileselected);
    // console.log("ORIGNAL FILE NAME " + files.fileselected.originalFilename);
    // const usethisfile = files.fileselected.originalFilename;


    // console.log("ABOUT TO CALL ReadStream... ");
    const readStream = fs.createReadStream(files.fileselected.filepath);
    // console.log("filepath... " + fs.createReadStream(files.fileselected.filepath));

    // console.log("GOT A READSTREAM? " + readStream);

    // const fileContent= fs.readFileSync(files.fileselected.filepath);

    // console.log("FILECONTENT: " + fileContent);

    // console.log("BUCKET NAME: " + process.env.BUCKET_NAME);


    // try {

    //   console.log("ABOUT TO PUTOBJECT:: BUCKETNAME: " + process.env.BUCKET_NAME +
    //   " KEY: " + usethisfile + " BODY: " + fileContent);

      // const params = {
      //   Bucket: process.env.BUCKET_NAME, 
      //   Key: usethisfile,
      //   Body: fileContent, 
      //   ACL: "bucket-owner-full-control"
      // }

      // try {
      //   const results = await S3Client.send(new PutObjectCommand(params));
      //   console.log(
      //       "File Successfully Uploaded: " + params.Key + " and uploaded it to " +
      //       params.Bucket + "/" + params.Key
      //   );

      // } catch (err) {

      //   console.log("ERROR OCURRED UPLOADING FILE: ", err);
      // }

      //  console.log("RETURN FROM PUTOBJECT; results: " + results);


      // s3Client.putObject(params, function(err, data) {
      //    if (err) console.log(err, err.stack); // an error occurred
      //    else     
      //    console.log("File Successfully Uploaded; data: " + data); // successful response
      //  });



    //   return s3Client.putObject({ 
    //     Bucket: process.env.BUCKET_NAME,
    //     key: usethisfile,
    //     Body: fileContent,
    //     ACL: "bucket-owner-full-control",
    //     ContentType: "text/plain",
    //   }, async() => res.status(201).send("File Successfully Uploaded"));

    // } catch(e) {
    //   console.log(e);
    //   res.status(500).send("ERROR OCURRED UPLOADING FILE..");
    // }

  })
}

