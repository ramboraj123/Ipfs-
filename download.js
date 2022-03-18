const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function downlaodImage() {
  const nftUrl =
    "https://ipfs.io/ipfs/QmYkDnWPBtrriLy3KYRepmjmQ4fdGhTT9Xbi3KSYjKWrrs";
  console.log("NFT URL", nftUrl);
  const imagepath = path.resolve(__dirname, "images", "output.png");
  const writer = fs.createWriteStream(imagepath);
  const response = await axios({
    url: nftUrl,
    method: "GET",
    responseType: "stream",
  });
  const result = response.data.pipe(writer);

  console.log("RESULT", result);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
downlaodImage();
