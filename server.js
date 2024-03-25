require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection URI from your .env file
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for the job
const jobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  jobDescription: { type: String, required: true },
  desiredFee: { type: Number, required: true },
});

// Create a Mongoose model based on the schema
const Job = mongoose.model('Job', jobSchema);

app.use(express.json());

// API route for submitting jobs
app.post('/submit-job', async (req, res) => {
    const jobData = new Job(req.body);

    try {
        await jobData.save();
        res.status(200).send("Job submitted successfully.");
    } catch (e) {
        console.error("Error saving job:", e);
        res.status(500).send("Error submitting job.");
    }
});
