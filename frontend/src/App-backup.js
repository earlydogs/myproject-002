import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type selected');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setIsPreviewVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!isPreviewVisible) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
          setIsPreviewVisible(true);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const drawBox = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.rect(offsetX, offsetY, 100, 100); // 100x100 is a placeholder
    contextRef.current.stroke();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.strokeStyle = 'red'; // Change the box color here
      context.lineWidth = 2; // Change the line width here
      contextRef.current = context;
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (image && isPreviewVisible) {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        let img = new Image();
        img.onload = function () {
          // Determine the new dimensions while maintaining the image's aspect ratio
          let imgHeight = img.height;
          let imgWidth = img.width;
          const imgAspectRatio = imgWidth / imgHeight;
          let canvasWidth = windowDimensions.width;
          let canvasHeight = windowDimensions.height;
          if (canvasWidth / canvasHeight > imgAspectRatio) {
            canvasWidth = canvasHeight * imgAspectRatio;
          } else {
            canvasHeight = canvasWidth / imgAspectRatio;
          }
          
          // Set the new dimensions of the canvas
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          
          // Draw the image on the canvas
          context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        };
        img.src = image;
      }
    }
  }, [image, isPreviewVisible, windowDimensions]);
  

  const handleReset = () => {
    setImage(null);
    setIsPreviewVisible(false);
  };

  return (
    <div className="image-uploader-container" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <form className="image-uploader-form">
        {!isPreviewVisible && (
          <div className="image-select-container">
            <label htmlFor="file-input" className="image-uploader-label">
              <i className="material-symbols-outlined">add_photo_alternate</i>
              <input type="file" id="file-input" onChange={handleChange} style={{ display: 'none' }} />
            </label>
          </div>
        )}
        {isPreviewVisible && (
          <div className="image-preview-overlay">
            <div className="image-preview-container">
              <canvas ref={canvasRef} onClick={drawBox} />
            </div>
            <button type="button" onClick={handleReset} className="close-button">
              <i className="material-icons">close</i>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
