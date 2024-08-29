// // models/ProcessingRequest.js
// const mongoose = require('mongoose');

// const requestProcessingSchema = new mongoose.Schema({
//   requestId: { type: String, required: true, unique: true },
//   status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
//   inputImageUrls: [String],
//   outputImageUrls: [String],
// }, {
//   timestamps: true
// });

// const RequestProcessing = mongoose.model('RequestProcessing', requestProcessingSchema);
// module.exports = RequestProcessing;

const mongoose = require('mongoose');

// Subdocument for images
const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ['input', 'output'], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Product subdocument
const ProductSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true },
    productName: { type: String, required: true, index: true }, // Indexing for faster searches
    inputImages: [ImageSchema],  // Separate array for input images
    outputImages: [ImageSchema], 
});

// Main request schema
const RequestSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true, index: true },
    products: [ProductSchema],  // Embedded product data for faster reads
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending', index: true },
    createdAt: { type: Date, default: Date.now, index: true }  // Indexed for faster queries on creation time
});

// Indexing the combination of requestId and status for faster status checks
RequestSchema.index({ requestId: 1, status: 1 });

// Exporting the models
module.exports = mongoose.model('RequestProcessing', RequestSchema);