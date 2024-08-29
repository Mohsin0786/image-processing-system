// workers/imageWorker.js
const { parentPort } = require('worker_threads');
const sharp = require('sharp');
const axios = require('axios');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();
// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.AWS_SECRET_ACCESS_KEY,

});

const s3 = new AWS.S3();
parentPort.on('message', async ({ imageUrl, outputUrl,hash,total_images,image_count}) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  
   const processedImage = await sharp(response.data)
      .jpeg({ quality: 50 }) // Compress image to 50% quality
      .toBuffer();
      // .toFile(outputUrl);
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: hash, // Extract filename from outputUrl
        Body: processedImage,
      };
      await s3.upload(uploadParams).promise();
      if (image_count === parseInt(total_images)) {
        console.log("All images processed.");
        parentPort.postMessage({
          success: true,
          webhook:true
        });
      
      } else {
        parentPort.postMessage({ 
          success: true, 
          outputUrl,
          webhook:false
        });
      }
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});
