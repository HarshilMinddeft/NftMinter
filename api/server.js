const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(express.json());

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
});

const starton = axios.create({
  baseURL: "https://api.starton.com/v3",
  headers: {
    "x-api-key": "sk_live_b7198108-fd62-4e53-b6e0-20ea82db4b59",
  },
});

app.post("/upload", cors(), upload.single("file"), async (req, res) => {
  let data = new FormData();
  const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
  data.append("file", blob, { filename: req.file.originalname });
  data.append("isSync", "true");

  async function uploadImageOnIpfs() {
    const ipfsImg = await starton.post("/ipfs/file", data, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    });
    return ipfsImg.data;
  }

  async function uploadMetadataOnIpfs(imgCid) {
    const metadataJson = {
      name: `New Nft`,
      description: `this is modern nft`,
      image: `ipfs://ipfs/${imgCid}`,
    };
    const ipfsMetadata = await starton.post("/ipfs/json", {
      name: "My nft metadata Json",
      content: metadataJson,
      isSync: true,
    });
    return ipfsMetadata.data;
  }

  const SMART_CONTRACT_NETWORK = "polygon-mumbai";
  const SMART_CONTRACT_ADDRESS = "0x69af96fd22091306c9243eEE3eED240EbFb6baBA";
  const WALLET_IMPORTED_ON_STARTON =
    "0xe9fa388a8F4C51b7884872753cc5B631326c5AfF";
  async function mintNFT(receiverAddress, metadataCid) {
    const nft = await starton.post(
      `/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`,
      {
        functionName: "mint",
        signerWallet: WALLET_IMPORTED_ON_STARTON,
        speed: "fast",
        params: [receiverAddress, metadataCid],
      }
    );
    return nft.data;
  }

  const RECEIVER_ADDRESS = "0xe917e81c69Bf15238c63abd45d1c335C2fc80bDD";
  const ipfsImgData = await uploadImageOnIpfs();
  const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
  const nft = await mintNFT(RECEIVER_ADDRESS, ipfsMetadata.cid);
  console.log(nft);
  res.status(201).json({
    transactionHash: nft.transactionHash,
    cid: ipfsImgData.cid,
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

//sk_live_b7198108-fd62-4e53-b6e0-20ea82db4b59
