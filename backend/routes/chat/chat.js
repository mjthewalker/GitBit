const express = require('express');
const Portfolio = require("../../models/portfolio");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const mongoose = require('mongoose');
const router = express.Router();

// GitHub credentials
const GITHUB_USERNAME = 'mjthewalker';
const GITHUB_REPO = 'pdf';
const GITHUB_TOKEN = 'my ass token and all i wont give';

// Define absolute paths for files
const SCRIPT_DIR = __dirname;
const ASSET_JSON_PATH = path.join(SCRIPT_DIR, 'asset.json');
const PYTHON_SCRIPT_PATH = path.join(SCRIPT_DIR, 'convert_pdf.py');
const OUTPUT_PDF_PATH = path.join(SCRIPT_DIR, 'output.pdf');
const CHATBOX_PY_SCRIPT_PATH = path.join(SCRIPT_DIR, 'chatbox.py'); // Path to chatbox.py script


// Function to get file SHA from GitHub (if file exists)
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
    return response.data.sha;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error('Error fetching file SHA:', error);
    throw error;
  }
}

// Function to upload the file to GitHub
async function upload(filePath) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

  try {
    const sha = await getFileSha(fileName);
    const requestBody = {
      message: `Upload ${fileName}`,
      content: fileContent,
    };

    if (sha) {
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

    const downloadURL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/raw/main/pdfs/${encodeURIComponent(fileName)}`;
    
    const linkFilePath = path.join(SCRIPT_DIR, 'link.txt');
    fs.writeFileSync(linkFilePath, downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

async function runChatboxPythonScript(link, query) {
  try {

    const pythonPath = path.join(SCRIPT_DIR, 'venv', 'bin', 'python');
    // Construct the chatbox command with the link and query as arguments
    const chatboxCommand = `${pythonPath} "${CHATBOX_PY_SCRIPT_PATH}" "${link}" "${query}"`; 

    console.log('Executing Chatbox Python command:', chatboxCommand);

    // Execute the command and return the result
    const chatboxScriptResult = await new Promise((resolve, reject) => {
      exec(chatboxCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Chatbox Python script: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    });

    console.log("Chatbox Python script executed successfully.");
    return chatboxScriptResult;
  } catch (error) {
    console.error("Error executing Chatbox Python script:", error);
    throw error;
  }
}

// Route to handle the portfolio
router.get("/:userId", async (req, res) => {
  try {
    // Get the userId from the request parameters
    const userId = req.params.userId;
    
    // Retrieve portfolio from the database
    const portfolio = await Portfolio.findOne({ userId: userId });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found for this user" });
    }

    // Check if there are investments to save the asset codes
    if (portfolio.investments && portfolio.investments.length > 0) {
      const assetCodes = portfolio.investments.map(investment => investment.assetCode);
      console.log("Asset Codes to save:", assetCodes);

      // Save asset codes to asset.json
      if (!fs.existsSync(ASSET_JSON_PATH)) {
        fs.writeFileSync(ASSET_JSON_PATH, '[]', 'utf8');
      }

      const data = await fs.promises.readFile(ASSET_JSON_PATH, 'utf8');
      let existingAssetCodes = JSON.parse(data || '[]');
      const updatedAssetCodes = [...existingAssetCodes, ...assetCodes];
      await fs.promises.writeFile(ASSET_JSON_PATH, JSON.stringify(updatedAssetCodes, null, 2));
    }

    // Verify Python script exists
    if (!fs.existsSync(PYTHON_SCRIPT_PATH)) {
      throw new Error(`Python script not found at: ${PYTHON_SCRIPT_PATH}`);
    }

    // Execute Python script (using `python` instead of `python3`)
    const pythonCommand = `python "${PYTHON_SCRIPT_PATH}" "${ASSET_JSON_PATH}" "${OUTPUT_PDF_PATH}"`;
    console.log('Executing Python command:', pythonCommand);

    const pythonScriptResult = await new Promise((resolve, reject) => {
      exec(pythonCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    });

    // Wait for the Python script to finish and ensure the PDF is created
    if (!fs.existsSync(OUTPUT_PDF_PATH)) {
      throw new Error(`PDF file not created at ${OUTPUT_PDF_PATH}. Python output: ${pythonScriptResult}`);
    }

    // Upload the generated PDF to GitHub
    const downloadURL = await upload(OUTPUT_PDF_PATH);
    console.log("Download URL:", downloadURL);

    // Run the chatbox.py script with the generated download URL
    await runChatboxPythonScript(downloadURL,"");

    res.status(200).json({ portfolio, downloadURL });

  } catch (error) {
    console.error("Error in portfolio route:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/query/:userId', async (req, res) => {
  const userId = req.params.userId;  // Get the userId from the URL parameter
  const { query } = req.body;  // Get the query from the request body

  // Check if userId is valid
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  // Ensure query is provided in the request body
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Find the portfolio based on the userId
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const link = ''

    const result = await runChatboxPythonScript(link, query);  // Call the function to run the Python script

    // Send the result back to the client
    res.json({ result: result.trim() });  // Trim any extra whitespace from the result
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = router;
