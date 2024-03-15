import { useState } from "react";
import "./App.css";
import FileUpload from "./FileUpload";
function App() {
  return (
    <div className="App">
      <h1>NFT Minter</h1>
      <FileUpload></FileUpload>
    </div>
  );
}

export default App;
