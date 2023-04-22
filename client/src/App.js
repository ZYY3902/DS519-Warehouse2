import React from 'react';
import { useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import { Typography, TextField, Button, Box,Input } from "@mui/material";
import { BlobServiceClient } from "@azure/storage-blob";

function App() {
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleChooseImage = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };
 
  const handleUploadImage = async () => {
    if (!file && !inputValue) {
      return;
    }
    let imageUrl = '';

    if (file){
      const connectionString = "BlobEndpoint=https://assignment5storages.blob.core.windows.net/;QueueEndpoint=https://assignment5storages.queue.core.windows.net/;FileEndpoint=https://assignment5storages.file.core.windows.net/;TableEndpoint=https://assignment5storages.table.core.windows.net/;SharedAccessSignature=sv=2021-12-02&ss=b&srt=co&sp=rwdlaciytfx&se=2023-12-30T08:38:21Z&st=2023-04-13T23:38:21Z&spr=https&sig=S0djOo5scDvCMh%2BKuxGU89pZw4i8QDiJmdNH8QL8gsc%3D";
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerName = "image";
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blob = new Blob([file], { type: file.type });
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadData(blob);
      imageUrl = blockBlobClient.url;
    }
    else if (inputValue){
      imageUrl = inputValue;
    }

    setSuccessMessage("File uploaded successfully!");

    // Call HTTP trigger and send blob URL to queue
    const http_url = 'https://warehouse-containerapp.salmondesert-8cf08169.eastus.azurecontainerapps.io/api/AddItem';
    const response = await fetch(http_url, {
      method: 'POST',
      body: JSON.stringify({ url: imageUrl }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Data Entry
          </Typography>
        </Grid>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }} m>
            <Input
              type="file"
              onChange={handleChooseImage}
              sx={{ display: "none" }}
              id="choose-image-input"
            />
            <label htmlFor="choose-image-input">
              <Button variant="contained" component="span">
                Choose Image
              </Button>
            </label>
            <Button variant="contained" onClick={handleUploadImage}>
              Upload
            </Button>
          </Box>
        </Grid>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ m: 1, display: "flex", flexDirection: "row", gap: "1rem" }}>
            <TextField
              label="Enter the URL"
              variant="outlined"
              value={inputValue}
              onChange={handleInputValue}
            />
            <Button variant="contained" onClick={handleUploadImage}>
              Upload the URL
            </Button>
          </Box>
        </Grid>
        {successMessage && (
          <Grid xs={12} container alignItems="center" justifyContent="center">
            <Box sx={{ m: 1 }}>
              <Typography variant="body2" gutterBottom>
                {successMessage}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default App;
