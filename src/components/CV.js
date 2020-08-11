import React from "react";

const CV = ({ loading, cvRef }) => {
  return (
    <div>
      <p>{loading ? "Open CV is being loaded" : "Open CV is loaded"}</p>
    </div>
  );
};

export default CV;
