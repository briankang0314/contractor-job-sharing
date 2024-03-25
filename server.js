const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Multer setup for handling multipart/form-data (for the image)
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
const mongoUri = 'your_mongodb_connection_uri';
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDb() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Could not connect to MongoDB:", e);
    }
}

connectDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route for submitting the job
app.post('/submit-job', upload.single('jobImage'), async (req, res) => {
    const jobData = req.body;
    // In a real application, upload the file to cloud storage here and save the URL in jobData

    try {
        const jobsCollection = client.db("contractors").collection("jobs");
        await jobsCollection.insertOne(jobData);
        res.status(200).send("Job submitted successfully.");
    } catch (e) {
        console.error("Error saving job:", e);
        res.status(500).send("Error submitting job.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
