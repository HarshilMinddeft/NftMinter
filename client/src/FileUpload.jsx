import React, { useState } from "react";
const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.cid);
          console.log(data.transactionHash);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const retreieveFile = (event) => {
    try {
      const data = event.target.files[0];
      setFile(data);
      event.preventDefault();
    } catch (error) {
      alert("Dose not work");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <input type="file" className="choose" onChange={retreieveFile} />
        <button className="btn">Nft Minter</button>
      </form>
    </div>
  );
};

export default FileUpload;
