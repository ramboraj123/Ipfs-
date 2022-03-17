const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const Arweave = require("arweave/node");
const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
});
const { create } = require("ipfs-http-client");
const { url } = require("inspector");
const { json } = require("express/lib/response");
const axios = require("axios").default;
// async function ipfsClient() {
//   let ipfs = await create({
//     host: "ipfs.infura.io",
//     port: 5001,
//     protocol: "https",
//   });
//   return ipfs;
// }

async function getDataBlob(imageUrl) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();
  var obj = {};
  obj.contentType = blob.type;

  var buffer = await blob.arrayBuffer();
  obj.data = buffer;

  return obj;
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

app.post("/createNFT", async (req, res) => {
  const cid = req.body.cid;
  const walletAddress = req.body.walletAddress;
  const walletData = JSON.stringify(req.body.walletData);
  const title = req.body.title;
  const name = req.body.name;
  const description = req.body.description;

  console.log("Walletdata", walletData);

  fs.writeFile(
    __dirname + "/tempfile/" + walletAddress,
    walletData,
    function (err) {
      if (err) throw err;
      console.log("File created succesfully");
    }
  );

  const url = "https://ipfs.io/ipfs/" + cid;
  console.log("IMAGEURL", url);
  let imageOBJ = await getDataBlob(
    url // paste your image url here
  );
  const initialState = {
    title: title,
    name: name,
    description: description,
    ticker: "KOINFT",
    balances: {
      walletAddress: 1,
    },
    owners: {
      1: JSON.stringify(walletAddress),
    },
    maxSupply: 5,
    locked: [],
    contentType: "image/png",
    createdAt: Date.now,
    tags: [""],
  };
  let tx;
  let wallet = JSON.parse(
    fs.readFileSync(__dirname + "/tempfile/" + walletAddress, "utf-8")
  );
  try {
    tx = await arweave.createTransaction(
      {
        data: imageOBJ.data,
      },
      wallet
    );
  } catch (err) {
    console.log("create transaction error");
    console.log("err-transaction", err);
    return false;
  }

  tx.addTag("Content-Type", imageOBJ.contentType);
  tx.addTag("Network", "Raj");
  tx.addTag("Action", "marketplace/Create");
  tx.addTag("App-Name", "SmartWeaveContract");
  tx.addTag("App-Version", "0.3.0");
  tx.addTag("Contract-Src", "r_ibeOTHJW8McJvivPJjHxjMwkYfAKRjs-LjAeaBcLc");
  tx.addTag("Init-State", JSON.stringify(initialState));
  try {
    await arweave.transactions.sign(tx, wallet);
  } catch (err) {
    console.log("transaction sign error");
    console.log("err-sign", err);
    return false;
  }
  try {
    // console.log(" wallet : ", wallet);
    console.log("TX", tx.id);
    let uploader = await arweave.transactions.getUploader(tx);
    console.log("uploder", uploader);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(
        uploader.pctComplete + "% complete",
        uploader.uploadedChunks + "/" + uploader.totalChunks
      );
    }
    res.status(200).json({ Id: tx.id });
  } catch (err) {
    console.log("err-last", err);
    return false;
  }
});

app.listen(3000);
