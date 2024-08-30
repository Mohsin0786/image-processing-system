# Setup Instructions for Image Processing System

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 14 or higher)
- **MongoDB** (running locally or remotely)
- **AWS Account** (for S3 access)

## Installation Steps

1. **Clone the Repository**

   Start by cloning the repository to your local machine:

   ```bash
   git clone https://github.com/Mohsin0786/image-processing-system.git
   cd image-processing-system
Install Dependencies Navigate to the project directory and install the required dependencies using npm:


```bash
npm install
```
2. Create a .env FileIn the root directory of the project, create a .env file to store your environment variables. Add the following variables:



```bash
AWS_ACCESS_KEY_ID=your_access_key_id AWS_SECRET_ACCESS_KEY=your_secret_access_key AWS_BUCKET_NAME=your_bucket_name PORT=5000 MONGO_URI=DB_URI AWS_REGION=YOUR_REGION WEBHOOK_URL=YOUR_WEBHOOK
Replace your_access_key_id, your_secret_access_key, and your_bucket_name with your actual AWS credentials and bucket name and other credentials.
```
3. Start the ApplicationYou can start the application in development mode using the following command:



```bash
npm run dev
```
This will start the server using nodemon, which automatically restarts the server when file changes are detected.

4. Access the ApplicationOnce the server is running, you can access the application by navigating to:




http://localhost:5000
You can use tools like Postman to interact with the API endpoints.
```bash
API Endpoints
* Upload Images: POST /api/upload - Upload a CSV file containing image URLs and associated product data.
* Check Status: GET /api/status/:requestId - Retrieve the current status of a processing request.
* Download CSV: GET /api/download-csv/:requestId - Download the CSV file containing processing results.
```
Conclusion
You have successfully set up the Image Processing System. If you encounter any issues or have questions, please refer to the documentation or reach out for assistance generate .md format to put in readme
