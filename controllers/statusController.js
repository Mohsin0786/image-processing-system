const RequestProcessing = require('../models/RequestProcessing');
const generateCSV = require('../utils/csvGenerator');
const checkStatus = async (req, res) => {
  const { requestId } = req.params;
  const processingRequest = await RequestProcessing.findOne({ requestId });

  if (!processingRequest) {
    return res.status(404).send('Request ID not found.');
  }

  res.json({
    status: processingRequest.status,
    products: processingRequest.products,
    // outputImageUrls: processingRequest.outputImageUrls,
  });
};


const downloadCSV =  async (req, res) => {
  const { requestId } = req.params;
  
  // Find the processing request by requestId
  const processingRequest = await RequestProcessing.findOne({ requestId });
  
  if (!processingRequest) {
    return res.status(404).send('Request ID not found.');
  }
  
  // Check if processing is complete
  if (processingRequest.status !== 'completed') {
    return res.status(400).send('Processing not yet completed.');
  }
  

  const csvData = generateCSV(processingRequest);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=output.csv');

  // Send the CSV data as a response
  res.send(csvData);
}
module.exports = { checkStatus, downloadCSV };