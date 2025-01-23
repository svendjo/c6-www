import React, { useState } from 'react';
import './App.css';

const ResultBubble = ({ text }) => {
  return (
    <div className="result-bubble-container">
      <div className="result-bubble">
        <p className="result-bubble-text">{text}</p>
      </div>
    </div>
  );
};

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [resultText, setResultText] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setResultText(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    const blob = dataURLtoBlob(image);
    formData.append('file', blob, 'image.jpg');

    try {
      const response = await fetch('https://22y7kxtymk.us-west-2.awsapprunner.com/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.prediction);
      setResultText(data.prediction_text);
    } catch (error) {
      console.error('Error:', error);
      setResult(0);
      setResultText('The count regretfully cannot be made at this time');
    }
  };

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const getPredictionMessage = () => {
    if (!result || !resultText) return null;
    if (resultText === "Cookie") {
      return `There are ${Math.round(result)} chocolate chips in the cookie.`;
    } else {
      return "That is not a cookie!";
    }
  };

  return (
    <div className="App">
      <div className="app-body">
        <h1>Count Chocolate II</h1>
        <p>Upload an image of a cookie to count the chocolate chips.</p>
        <p>Only JPG/JPEG images are supported.</p>
        <p>For best results, use a clear, well-lit image of a single cookie. Do not under any circumstances upload an images of non-cookies. The count will not tolerate it.</p>

        <div className="controls-container">
          <input type="file" accept="image/jpeg" onChange={handleImageUpload} />
          <button onClick={handleSubmit}>Count chocolate chips</button>
        </div>

        {image && (
          <div className="image-container">
            <img src={image} alt="Uploaded" className="image" />
          </div>
        )}

        {result !== null && resultText !== null && (
          <ResultBubble text={getPredictionMessage()} />
        )}
        <div className="copyright">© 2024-2025 Svend K. Johannsen. All rights reserved. v2.1</div>
      </div>
    </div>
  );
}

export default App;
