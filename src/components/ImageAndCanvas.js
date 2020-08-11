import React, { useRef, useState } from "react";

const ImageAndCanvas = ({ loading, cvRef }) => {
  const imgRef = useRef();

  const [src, setSrc] = useState(null);
  const canvasRef = useRef();

  const handleChange = e => {
    e.preventDefault();
    const file = e.currentTarget.files?.[0];
    if (file) setSrc(URL.createObjectURL(file));
  };

  return (
    <div>
      <img
        src={src}
        alt="Upload one"
        style={{
          width: "300px",
          minHeight: "300px",
          border: "solid black 1px",
        }}
        ref={imgRef}
        onLoad={() => {
          const mat = cvRef.current.imread(imgRef.current);
          console.log(mat);
          cvRef.current.imshow(canvasRef.current, mat);
          mat.delete();
        }}
      />
      <br />
      <input type="file" onChange={handleChange} disabled={loading} />
      <br />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ImageAndCanvas;
