const multer = require('multer');
const parseCSV = require('../utils/csvParser');
const RequestProcessing = require('../models/RequestProcessing');
const { processImage } = require('../services/imageProcessingService');
const crypto = require('crypto');
const upload = multer({ dest: 'uploads/' });
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const csvData = await parseCSV(req.file.path);
    
    // Generate a unique requestId using crypto
    const requestId = crypto.randomBytes(16).toString('hex');

    const products = [];
    const totalImages = csvData.reduce((count, row) => count + row['Input Image Urls'].split(',').length, 0);

    let imageCount = 0;
    for (const row of csvData) {
      const { 'Product Name': productName, 'S. No.': serialNumber, 'Input Image Urls': inputUrlsString } = row;
      const inputUrls = inputUrlsString.split(',').map(url => url.trim());

      const inputImages = inputUrls.map(url => ({
        url,
        type: 'input',
      }));

      products.push({
        serialNumber,
        productName,
        inputImages,
      });

      for (const url of inputUrls) {
        imageCount++;
        const hash = crypto.createHash('sha256')
          .update(url)
          .update(crypto.randomBytes(8).toString('hex'))
          .digest('hex');
        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${hash}.jpg`;

        processImage(url, s3Url, hash, requestId, serialNumber, totalImages, imageCount).catch((error) => {
          console.error(`Error processing image: ${url}`, error);
        });
      }
    }

    const processingRequest = new RequestProcessing({
      requestId,
      products,
      status: 'processing',
    });

    await processingRequest.save();

    res.status(201).json({ requestId });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    res.status(500).send('Error processing CSV file.');
  }
};

module.exports = { upload, uploadCSV };