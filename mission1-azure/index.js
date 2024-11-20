//environment variablles
require("dotenv").config();

const express = require("express"); // provides routing and middleware support
const multer = require("multer"); //middleware that handles the form data sent form front end/temp storage of uploads (uploads/ folder)
const axios = require("axios"); //used for making http requests ti external APIs or services.
const fs = require("fs/promises"); //allows reading,writing & manipulation of files on server without blocking code
const cors = require("cors");// allows server to accept requests from diff origins

const app = express();
const port = 4000;
app.use(cors());

//multler setup - handles file uploads from front end
const upload = multer({ dest: "uploads/" }); // this will temp save files in "uploads" folder

// env variables
const AZURE_PREDICTION_KEY = process.env.AZURE_PREDICTION_KEY;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const PROJECT_ID = process.env.PROJECT_ID;
const ITERATION_NAME = process.env.ITERATION_NAME;

// url for azure vision api
const CLASSIFY_URL = `${AZURE_ENDPOINT}/customvision/v3.0/Prediction/${PROJECT_ID}/classify/iterations/${ITERATION_NAME}/image`;

////////     IMAGE PREDICTION & CLASSIFICATION      ////////
// end point to handle file upload & prediction request

app.post("/upload", upload.single("uploadFile"), async (req, res) => {
  try {
    //get file path of uploaded img from incoming reqest (req)
    const imagePath = req.file.path;

    //read img file as binary data form servers disk
    const image = await fs.readFile(imagePath);

    // once read, axios send img data to azure api for car type classification
    const response = await axios.post(CLASSIFY_URL, image, {
      headers: {
        "Content-Type": "application/octet-stream", //binary data
        "Prediction-Key": AZURE_PREDICTION_KEY, //azure authenticaiton key
      },
    });

    //extract top prediction
    const prediction =
      response.data.predictions[0]?.tagName || "Unknown Car Type"; // default to unknown if no prediction

    await fs.unlink(imagePath); // deletes uploaded file after processing (cleaning up uploads file)

    //return result to front end
    res.json({ message: `${prediction}` });
    console.log(`car is a ${prediction}`);
  } catch (err) {
    console.error("Error processing image: ", err);
    res
      .status(500)
      .json({ message: "an error occured while classifying the car image" });
  }
});

// start server
app.listen(port, () => {
  console.log(
    `server is connected 🔌 & running 🏃🏼‍♀️💨 on http://localhost:${port}`
  );
});
