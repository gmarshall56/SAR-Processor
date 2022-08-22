import React ,{useState} from 'react';
import { useRouter } from "next/router";
import { Button, Form, Col, Row } from "react-bootstrap";
import { s3Client } from "../lib/S3Client"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ActivityIndicator } from "react-native-web";
import { Alert } from "reactstrap";
import S3 from 'react-aws-s3';

import Head from 'next/head'

import ResultsTable from '../views/results/ResultsTable';

import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';

import classes from '../styles/Home.module.css';


const Home = () => {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
  const [resultsTableData, setResultsTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errmsg, setErrMsg] = useState(false);


  const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
  }


  const callLambda = (file) => {

    setLoading(true);


    const config = {
      headers:{
        'Content-Type': file.type
      },
      api: {
        bodyParser: false,
      },
    };

    const theDomain = window.location.href;
    console.log("theDomain = "+ theDomain);
    console.log("Upload Home/callLambda:: about to call processUploadFile with this URL: " + theDomain +
                "api/processUploadFile/?filename=" + file);


    axios.post(theDomain + "/api/processUploadFile/?filename=" + file, config)
        .then(response => {

          console.log('Upload Home/callLambda:: processUploadFile returned...');


          // check response:
          if (response.data.code != "200"){
            console.log('Upload Home/callLambda:: Error occurred in processUploadFile =>' + response.data.message);
            setErrMsg(response.data.message);
          }
          else{
            setResultsTableData(response.data.sarValidationMessages);
          }

          
          setLoading(false);


        })
        .catch(err => {

            console.log('Upload Home/callLambda:: processUploadFile call failed:', err);

        })

    console.log('Upload Home/callLambda:: end of this function...');
  }


  const uploadFile3 = (file) => {

    // Uses ReactS3Client.  See: https://github.com/Developer-Amit/react-aws-s3

    setLoading(true);

    const config = {
      headers:{
        'Content-Type': selectedFile.type
      },
      api: {
        bodyParser: false,
      },
    };


      const params = {
        bucketName: process.env.NEXT_PUBLIC_SAR_IMPORT_BUCKET,
        region: process.env.NEXT_PUBLIC_REGION,
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
        s3Url: process.env.NEXT_PUBLIC_BUCKET_s3URL  // don't like to have to do this to make it work
      };


      const run = async () => {

        // Create an object and upload it to the Amazon S3 bucket.
        try {

          const ReactS3Client = new S3(params);


          console.log('Upload Home/uploadFile3:: about to upload file to S3 using ReactS3Client....');


          ReactS3Client
            .uploadFile(file, file.name)
            .then(data => 
                  
                    console.log("Upload Home/uploadFile3:: returned data: ", data.location),
              
                    console.log('Upload Home/uploadFile3:: File uploaded to the S3 bucket; about to call SarProcessor lambda...'),

                    // successful upload of file, run the lambda function to process it and get
                    // the results of that process:


                    axios.post("/api/processUploadFile/?filename=" + file.name, config)
                    .then(response => {
          
                      console.log('Upload Home/uploadFile3:: calling processUploadFile returned...');

                      // check response:
                      if (response.data.code != "200"){
                        console.log('Upload Home/callLambda:: Error occurred in processUploadFile =>' + response.data.message);
                        setErrMsg(response.data.message);
                      }
                      else{
                        setResultsTableData(response.data.sarValidationMessages);
                      }

                      setLoading(false);

                    })
                    .catch(err => {
          
                        console.log('Upload Home:: processUploadFile call failed:', err);
          
                    }),
  

                  )
            .catch(err => console.error("Upload Home:: ReactS3Client returned error: ", err)) 


        } catch (err) {

          console.log("Upload Home:: Error in try/catch: ", err);
        }
      };

      run();

  }


  const uploadFile2 = (file) => {

    const config = {
      headers:{
        'Content-Type': selectedFile.type
      },
      api: {
        bodyParser: false,
      },
    };

      const params = {
        Bucket: process.env.NEXT_PUBLIC_SAR_IMPORT_BUCKET,
        Key: file.name,
        Body: file
      };

      const run = async () => {

        // Create an object and upload it to the Amazon S3 bucket.
        try {

          console.log('Upload Home / uploadFile2:: about to upload file to S3');

          //results = await axios.post("/api/upload2/?filename=" + file.name, selectedFile, config)

          const results = await s3Client.send(new PutObjectCommand(params));
          console.log(
              "Successfully created " + params.Key + " and uploaded it to " 
              + params.Bucket + "/" + params.Key);


          // console.log('Upload Home:: about to call SarProcessor lambda...');

          // // successful upload of file, run the lambda function to process it and get
          // // the results of that process:

          // axios.post("/api/processUploadFile/?filename=" + file.name, config)
          // .then(response => {

          //   console.log('Upload Home:: processUploadFile returned data:', response.data);

          // })
          // .catch(err => {

          //     console.log('Upload Home:: processUploadFile call failed:', err);

          // })


          return results; // For unit tests.

        } catch (err) {

          console.log("Error", err);
        }
      };

      run();

  }
  
  
    const uploadFile = (file) => {
      
      const sendPostRequest = async () => {

        const config = {
          headers:{
            'Content-Type': selectedFile.type
          },
          api: {
            bodyParser: false,
          },
        };

        const formData = new FormData();
        formData.append("selectedFile", selectedFile);
        const res = '';
        try {
          console.log("selectedFile=", selectedFile);

          res = await axios.post("/api/upload2/?filename=" + file.name, selectedFile, config)

          // res = await axios.post("/api/upload4", {
          //   name: file.name,
          //   type: file.type,
          //   body: selectedFile
          // });

        console.log(res.data);

        } catch (err) {
            // Handle Error Here
            console.log('Upload Home:: failed to retrieve data from api/validate:', err);
            alert("Error occurred uploading file: " + err)
        }

        if (res !== undefined) {
          if (res.data) {
            let returncode = res.data.results.$metadata.httpStatusCode;
            console.log("Upload Home:: RETURN FROM /api call; results: " + returncode);
            if (returncode == 200){
              alert("File uploaded successfully ")
            }
          }
    
        }

  };

    sendPostRequest();

  }


  return <div>

    <div className={classes.container}>
        <Head>
            <title>SAR Upload</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={classes.selectafileMain}>
            <h1 className={classes.title}>SAR Upload </h1>
            <br></br>
            <br></br>
            {loading > 0 &&
                    <div>
                    <ActivityIndicator size="large"/>
                </div>
            }
            <br></br>
            <br></br>
            <br></br>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label className={classes.selectFileMsg}>Select a file:</Form.Label>
              <Form.Control type="file" size="lg" onChange={handleFileInput}/>
              <br/>
              <div className={classes.messages}>
                <Button onClick={() => uploadFile3(selectedFile)} bsStyle="primary">Upload to S3</Button>
                <br/>
                <br/>
                <Button onClick={() => callLambda('SAR_Report_10_Rows.xlsx')} bsStyle="primary">Test Lambda Function</Button>
              </div>
            </Form.Group>

        </div>

        {errmsg &&
          // <Alert color="danger">
          //     <span className="alert-icon"><i class="ni ni-like-2"></i></span>
          //     <span className="alert-text"><strong>Error!</strong>{errmsg}</span>
          // </Alert>
          <>
            <Alert color="danger">
              <h4 className="My-Alert-heading">ERROR!</h4>
              <p className={classes.messages}>{errmsg}</p>
            </Alert>
          </>
        }
        
        {resultsTableData.length > 0 &&
          <h2 className={classes.messages}>You have {resultsTableData.length} validation messages</h2>
        }
      
        <br/>

        {resultsTableData.length > 0 &&
          <Row style={{ marginLeft: '0px', marginRight: '0px' }}>
              <Col>
                  <ResultsTable inputTableData={resultsTableData}
                  />
              </Col>
          </Row>
        }
        

        <footer className={classes.footer}>Developed by Marshall IT... 06.28.2022</footer>
    </div>

  </div>

}

export default Home;