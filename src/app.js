const express = require('express');
const bodyParser = require('body-parser');
//const axios = require('axios').default;

const app = express();

app.use(bodyParser.json());

  
  app.post('/createNFT', async (req, res) => {
    const cid = req.body.name;
    const wallet = req.body.wallet;
    const nftMetaData = req.body.nftMetaData;
  
  });
  

app.listen(3000);