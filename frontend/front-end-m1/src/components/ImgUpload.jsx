import React, { useState } from "react";
import styles from "./ImgUpload.module.css";
import axios from "axios";
import CalculatePrem from "./CalculatePrem";

function ImgUpload() {
  //useState hooks to manage states in componnt
  const [file, setFile] = useState(null); // store selected file in state
  const [result, setResult] = useState(null); //store cartype result of classification
  const [preview, setPreview] = useState(null); // store the preview of uploaded image

  //event handler for when user select file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; //get selected file from input (always first)
    setFile(selectedFile); // save file to state "selected file"
    setPreview(null); //clear preview img
    setResult(null); // Clear any existing result
  };

  //event handler for when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents default submission behaviour (refresh)

    if (!file) {
      alert("Please select a file to upload."); // ui if file is empty, show alert
      return; //exit function is no selected file
    }

    // upload file to backend

    //try block contains code that may poss throw error, if error occurs, catch block will handle allows program to continue

    const formData = new FormData(); //create new formData object 2 hold form data
    // .append() = method used to to add data to a Form
    formData.append("uploadFile", file);

    try {
      //send file (fromdata) to backend using axios
      const response = await axios.post(
        "http://localhost:4000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // set content type for fileuploads
          },
        }
      );

      //if upload sucessful, set result message to display

      setResult(response.data.message || "file uploaded successfully 🥂"); // display the response message from server using OR operatoer (||)
      setPreview(URL.createObjectURL(file)); // generates url for the img upload to preview after submit
    } catch (err) {
      console.error("error occured during file upload: ", err); // logs any errors from uplod
      setResult("Oh No! An error has occured while uploading the file"); // error message for display (changes state)
    }
  };

  return (
    <div className={styles.container}>
      {/* for where user selects file and submits */}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <input
          className={styles.formInput}
          type="file"
          name="uploadFile"
          accept=".png" //type of file
          onChange={handleFileChange}
          required
        />

        {/* submit button */}
        <input
          className={styles.submitButton}
          type="submit"
          value="Calculate My Premium"
        />
      </form>
      {/* display result message (succsses or error) */}
      {result && (
        <div className={styles.result}>
          Looks like your car is a:
          <span className={styles.carResult}> {result}</span>
        </div>
      )}
      {/* display img preview */}
      {/* if preview is true (not null) display the preview */}
      <br />
      {preview && <img src={preview} alt="car preview" width={300} />}
      <br />
      <CalculatePrem carResult={result} />
    </div>
  );
}

export default ImgUpload;
