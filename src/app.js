const express = require("express");
const bodyParser = require("body-parser");
const { create } = require("ipfs-http-client");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
//const axios = require('axios').default;
// async function ipfsClient() {
//   let ipfs = await create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
//   });
//   return ipfs;
// }

const app = express();

app.use(bodyParser.json());

app.post("/createNFT", async (req, res) => {
  const cid = req.body.cid;
  // const wallet = req.body.wallet;
  // const nftMetaData = req.body.nftMetaData;

  // let ipfs = await ipfsClient();
  // // let result = await ipfs.add("hello");
  // // console.log(result);
  // let asyncitr = ipfs.get(cid);
  // for await (const itr of asyncitr) {
  //   let data = Buffer.from(itr).toString();
  //   console.log(data);
  // }
  //res.status(200).json({ result: result });
});

app.listen(3000);
