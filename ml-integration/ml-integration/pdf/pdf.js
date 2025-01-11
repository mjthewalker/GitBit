const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace these with your GitHub credentials and repository info
const GITHUB_USERNAME = 'mjthewalker';
const GITHUB_REPO = 'pdf';
const GITHUB_TOKEN = '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';

// Function to upload a PDF file to GitHub repository
async function uploadFileToGitHub(filePath) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

  try {
    const response = await axios.put(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/pdfs/${fileName}`,
      {
        message: `Upload ${fileName}`,
        content: fileContent, // Base64 encoded file content
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const fileName1 = filePath.slice(2); // Example filename after upload
    const username = 'mjthewalker'; // Your GitHub username
    const repoName = 'pdf'; // The repository where the file is uploaded
    const branch = 'main';
    const downloadURL = `https://github.com/${username}/${repoName}/raw/${branch}/pdfs/${encodeURIComponent(fileName1)}`;
    console.log(`File uploaded successfully`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:');
  }
}

// Usage
const pdfFilePath = './assign4A.pdf'; 
uploadFileToGitHub(pdfFilePath).then(downloadURL => {
  console.log(downloadURL);
});
