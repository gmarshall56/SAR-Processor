
export default function handler(req, res) {

  
  console.log("ENTERED /api/testGet... req = " + req.url);

  res.status(200).json({"message": "THIS IS A TEST"})


}