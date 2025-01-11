const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace these with your GitHub credentials and repository info
const GITHUB_USERNAME = 'mjthewalker';
const GITHUB_REPO = 'pdf';
const GITHUB_TOKEN = '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';

// Function to get the sha of a file from the repository
async function getFileSha(filePath) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/pdfs/${filePath}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
        },
      }
    );
    return response.data.sha; // Return the sha value
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // File doesn't exist
    }
    console.error('Error fetching file SHA:', error);
    throw error;
  }
}

// Function to upload a PDF file to GitHub repository
async function uploadFileToGitHub(filePath) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

  try {
    const sha = await getFileSha(fileName); // Check if the file exists and get sha
    const requestBody = {
      message: `Upload ${fileName}`,
      content: fileContent, // Base64 encoded file content
    };

    if (sha) {
      // If the file exists, add the sha to the request body
      requestBody.sha = sha;
    }

    const response = await axios.put(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/pdfs/${fileName}`,
      requestBody,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
        },
      }
    );

    const username = GITHUB_USERNAME;
    const repoName = GITHUB_REPO;
    const branch = 'main';
    const downloadURL = `https://github.com/${username}/${repoName}/raw/${branch}/pdfs/${encodeURIComponent(fileName)}`;

    console.log(`File uploaded successfully`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Usage
const pdfFilePath = './output.pdf';
uploadFileToGitHub(pdfFilePath).then(downloadURL => {
  console.log(downloadURL);
});
