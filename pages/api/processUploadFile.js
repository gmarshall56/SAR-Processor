/* eslint-disable */
import axios from 'axios';

export default function handler(req, res) {
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    };


    const filename = req.query.filename;

    const bucketname = process.env.NEXT_PUBLIC_SAR_IMPORT_BUCKET;

    const usethisurl =  process.env.NEXT_PUBLIC_PROCESS_URL+'bucketname='+process.env.NEXT_PUBLIC_SAR_IMPORT_BUCKET+"&filename="+filename;
    
    console.log("processUploadFile:: about to call this url: " + usethisurl);


    return new Promise((resolve, reject) => {

      axios({
        method: 'get',
        url: usethisurl,
        params: params
  
      })
      .then(response => {
        console.log('processUPloadfile.js:: call to lambda function complete. ');
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'max-age=180000');
        res.end(response.data);
        resolve();
      })
      .catch(error => {
        console.log('processUPloadfile.js:: call to lambda function complete.  message: ', error.message);
        res.json(error);
        res.status(204).end();
        resolve();
      });

    });


  }