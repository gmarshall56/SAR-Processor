import React ,{useState} from 'react';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import Head from 'next/head'
import styles from '../../styles/Home.module.css'


const s3Client = new S3Client({ 
     region: "us-east-1",
     credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
      }
    });



const UploadAfile = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
  }

  const uploadFile = (file) => {

    console.log("process.env.BUCKET_NAME: " + 
    process.env.NEXT_PUBLIC_BUCKET_NAME);

      const params = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
        Key: file.name,
        Body: file
      };

      const run = async () => {

        // Create an object and upload it to the Amazon S3 bucket.
        try {
          const results = await s3Client.send(new PutObjectCommand(params));
          console.log(
              "Successfully created " +
              params.Key +
              " and uploaded it to " +
              params.Bucket +
              "/" +
              params.Key
          );
          return results; // For unit tests.
        } catch (err) {
          console.log("Error", err);
        }
      };

      run();

  }


  return <div>

    <div className={styles.container}>
        <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>File Uploader </h1>
            <br></br>
            <input type="file" onChange={handleFileInput}/>
            <br></br>
            <br></br>
            <br></br>
            <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
        </main>

        <footer className={styles.footer}>Developed by Marshall IT... 06.28.2022</footer>
    </div>

  </div>

}

export default UploadAfile;