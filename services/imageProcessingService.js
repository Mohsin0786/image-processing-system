// // services/imageProcessingService.js

// services/imageProcessingService.js
const { Worker } = require('worker_threads');
const path = require('path');
const RequestProcessing = require('../models/RequestProcessing');
const axios = require('axios');

// Function to send a webhook notification4
// http://localhost:5000/api/upload
const sendWebhookNotification = async (requestId,status) => {
  try {
    const response = await axios.post(process.env.WEBHOOK_URL, {
      requestId,
      status
    });
    console.log('Webhook notification sent:', response.data);
  } catch (error) {
    console.error('Error sending webhook notification:', error.message);
  }
};

const processImage = (imageUrl, outputUrl, hash, requestId, serialNumber,total_images,image_count) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, '../workers/imageWorker.js'));

    worker.postMessage({ imageUrl, outputUrl, hash, requestId,total_images,image_count });

    worker.on('message', async (result) => {
      if (result.success) {
        await RequestProcessing.findOneAndUpdate(
                    { requestId, "products.serialNumber": serialNumber },
                    {
                      $push: { "products.$.outputImages": { url: outputUrl, type: 'output' } }, // Push to the outputImages array of the correct product
                      $set: { status: 'completed' }  // Keep status updated (if required)
                    },
                    { new: true }  // Return the updated document
                  );

        // Check if all images for the request are processed
        if (result.webhook) {
          // Send webhook notification after processing is complete
          await sendWebhookNotification(requestId,'completed');

        
        }

        resolve(result.outputUrl); // Return the output URL
      } else {
      
        await sendWebhookNotification(requestId,'failed');
        console.error(`Failed to process image for request ${requestId}: ${result.error}`);
        reject(result.error);
      }
    });

    worker.on('error', (error) => {
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

module.exports = { processImage };