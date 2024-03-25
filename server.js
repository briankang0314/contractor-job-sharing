require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection URI from your .env file
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const conn = mongoose.connection;
    console.log(`Connected to database: ${conn.name} on host: ${conn.host}`);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for the job
const jobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, match: [/^\d{3}-\d{4}-\d{4}$/, '올바른 전화번호를 입력해주세요'] },
  jobDescription: { type: String, required: true },
  desiredFee: { type: Number, required: true },
});

// Create a Mongoose model based on the schema
const Job = mongoose.model('Job', jobSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from 'public' directory
app.use(express.static('public'));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for submitting jobs
app.post('/submit-job', async (req, res) => {
    const jobData = new Job(req.body);
    console.log('Received job submission:', req.body); // Log received data

    const startTime = Date.now(); // Start timing the database operation

    try {
        await jobData.save();
        const duration = Date.now() - startTime; // Calculate operation duration
        console.log(`Job submitted successfully in ${duration}ms.`); // Log success with duration
        res.status(200).json({ message: "Job submitted successfully." });
    } catch (e) {
        console.error("Error saving job:", e);
        res.status(500).send("Error submitting job.");
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));