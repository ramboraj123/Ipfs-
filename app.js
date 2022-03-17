const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { create } = require("ipfs-http-client");
const { url } = require("inspector");
const axios = require("axios").default;
async function ipfsClient() {
  let ipfs = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });
  return ipfs;
}

const app = express();

app.use(bodyParser.json());

app.post("/downloadNFT", async (req, res) => {
  // const wallet = req.body.wallet;
  // const nftMetaData = req.body.nftMetaData;

  const nftUrl = "https://ipfs.io/ipfs/" + req.params.ID;
  console.log("NFT URL", nftUrl);
  const imagepath = path.resolve(__dirname, "images", "output.png");
  const writer = fs.createWriteStream(imagepath);
  const response = await axios({
    url: nftUrl,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);

    // res.status(200).json({ result: "true" });
  });

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
