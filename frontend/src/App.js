import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const imageRef = useRef();

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

  const handleReset = () => {
    setImage(null);
    setIsPreviewVisible(false);
    setBoxes([]);
  };

  useEffect(() => {
    if (imageRef.current) {
      const boxWidth = imageRef.current.offsetWidth - 5;
      const boxHeight = (imageRef.current.offsetHeight - 10) / 3;
      setBoxes([0, 1, 2].map((_, i) => ({
        id: i,
        x: 2.5,
        y: (boxHeight + 5) * i,
        width: boxWidth,
        height: boxHeight,
      })));
    }
  }, [image]);

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
              <img src={image} alt="Selected" className="image-preview" ref={imageRef} />
              {boxes.map(box => (
                <div
                  key={box.id}
                  className="box"
                  style={{
                    position: 'absolute',
                    border: '1px solid white',
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                    border: '2px solid yellow'
                  }}
                />
              ))}
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
