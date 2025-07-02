import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('http://localhost:8000/predict', formData);
    setResult(response.data.ethnicity_prediction);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Analyze</button>
      {result && (
        <div>
          <h3>Predicted Ethnicity</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
