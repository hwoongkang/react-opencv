import React, { useState, useEffect, useRef } from "react";

import "./App.css";
import WebCam from "./components/WebCam";

function App() {
  const [loading, setLoading] = useState(true);
  const cvRef = useRef(null);
  const [loc, setLoc] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log("loading started");

    const script = document.createElement("script");
    script.src = `${process.env.PUBLIC_URL}/js/opencv/opencv.js`;
    script.async = true;
    script.onload = () => {
      window.cv &&
        window.cv
          .then(data => {
            cvRef.current = data;

            console.log("loaded");
            setLoading(false);
          })
          .catch(err => console.log(err.message));
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="App">
      <br />
      <p>{loading ? "OpenCV is being loaded" : "OpenCV is loaded"}</p>

      <br />

      <WebCam loading={loading} cvRef={cvRef} setLoc={setLoc} />

      <p>x</p>
      <input type="range" value={loc.x} min={0} max={1} step={0.01} disabled />
    </div>
  );
}

export default App;
