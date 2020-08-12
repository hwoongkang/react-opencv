import React, { useRef, useEffect, useState } from "react";

import { StyledVideo, StyledCanvas } from "./WebCam.styled";

const WebCam = ({ loading, cvRef, setLoc }) => {
  const cv = cvRef.current;
  const videoRef = useRef();
  const canvasRef = useRef();
  const ctxRef = useRef();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [canplay, setCanplay] = useState(false);
  const animationRef = useRef(null);

  const srcMatRef = useRef(null);
  const grayMatRef = useRef(null);
  const faceDetectorRef = useRef(null);

  const [delay, setDelay] = useState(0);
  const tsRef = useRef(0);

  useEffect(() => {
    if (loading) return;

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then(stream => {
        console.log(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  }, [loading]);

  useEffect(() => {
    if (canplay) {
      const { videoWidth: width, videoHeight: height } = videoRef.current;
      console.log(width, height);
      setSize({ width, height });

      ctxRef.current = canvasRef.current.getContext("2d");
      srcMatRef.current = new cv.Mat(height, width, cv.CV_8UC4);
      grayMatRef.current = new cv.Mat(height, width, cv.CV_8UC1);

      faceDetectorRef.current = new cv.CascadeClassifier();

      faceDetectorRef.current.load("preloaded.xml");

      animationRef.current = requestAnimationFrame(processVideo);
    }
    return () => cancelAnimationFrame(animationRef.current);
    // eslint-disable-next-line
  }, [canplay]);

  const processVideo = ts => {
    if (faceDetectorRef.current?.empty()) {
      animationRef.current = requestAnimationFrame(processVideo);
      return;
    }
    ctxRef.current.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imageData = ctxRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    srcMatRef.current.data.set(imageData.data);

    const delta = ts - tsRef.current;
    setDelay(delta);
    tsRef.current = ts;
    cv.cvtColor(srcMatRef.current, grayMatRef.current, cv.COLOR_RGBA2GRAY);

    const faceVect = new cv.RectVector();

    const faceMat = new cv.Mat();

    cv.pyrDown(grayMatRef.current, faceMat);

    cv.pyrDown(faceMat, faceMat);

    faceDetectorRef.current.detectMultiScale(faceMat, faceVect);

    for (let i = 0; i < faceVect.size(); i++) {
      const face = faceVect.get(i);

      ctxRef.current.strokeStyle = "blue";
      ctxRef.current.lineWidth = 3;
      ctxRef.current.strokeRect(
        4 * face.x,
        4 * face.y,
        4 * face.width,
        4 * face.height
      );

      if (i === 0) {
        setLoc({
          x: (4 * face.x) / canvasRef.current.width,
          y: (4 * face.y) / canvasRef.current.height,
        });
      }
    }

    faceVect.delete();
    faceMat.delete();
    animationRef.current = requestAnimationFrame(processVideo);
  };

  return (
    <>
      <p>current delay: {delay.toFixed(2)}ms</p>
      <StyledVideo
        ref={videoRef}
        onLoadedMetadata={() => videoRef.current?.play?.()}
        onCanPlay={() => {
          setCanplay(true);
        }}
      ></StyledVideo>
      <StyledCanvas
        width={size.width}
        height={size.height}
        ref={canvasRef}
      ></StyledCanvas>
    </>
  );
};

export default WebCam;
