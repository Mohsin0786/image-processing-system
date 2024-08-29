
const RequestProcessing = require('../models/RequestProcessing');

const statusWebhook = async (req, res) => {
  const { requestId, status } = req.body;

  try {
    // Update the status in the database
    const updatedRequest = await RequestProcessing.findOneAndUpdate(
      { requestId },
      { status },
      { new: true }
    );

    // Check if the request was found and updated
    if (!updatedRequest) {
      return res.status(404).send('Request ID not found.');
    }

    // Handle the webhook notification
    console.log(`Webhook received for Request ID: ${requestId}`);
    console.log(`Status: ${status}`);

    // Respond to acknowledge receipt of the webhook
    res.status(200).send('Webhook received successfully');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

module.exports = { statusWebhook };