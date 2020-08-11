import React, { useState, useEffect, useRef } from "react";

import "./App.css";
import CV from "./components/CV";

import ImageAndCanvas from "./components/ImageAndCanvas";

function App() {
  const [loading, setLoading] = useState(true);
  const cvRef = useRef(null);

  useEffect(() => {
    console.log("loading started");
    const script = document.createElement("script");
    script.src = `${process.env.PUBLIC_URL}/js/opencv/opencv.js`;
    script.async = true;
    script.onload = () => {
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
      <CV loading={loading} cvRef={cvRef} />
      <ImageAndCanvas loading={loading} cvRef={cvRef} />
    </div>
  );
}

export default App;
