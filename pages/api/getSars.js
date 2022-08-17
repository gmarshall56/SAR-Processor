import conn from '../../lib/db'


export default async function handler(req, res) {

  
  console.log("ENTERED /api/getSars... req = " + req.url);


  try {

      console.log("api/getSars:: req body: ", req.body)

      const query = 'SELECT * FROM sar_schema.SAR_DLA_CRM;'

      const response =  await conn.query(query);

      console.log("api/getSars: good response from call to db!!");

      return res.json(response);


  } catch ( error ) {
      return res.status(400).json({ message: error.message });
  }


}