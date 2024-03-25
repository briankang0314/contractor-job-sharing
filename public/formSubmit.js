document.getElementById('jobShareForm').onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    // In a real application, handle the file separately with a cloud storage API

    try {
        const response = await fetch('/submit-job', {
            method: 'POST',
            body: formData,
        });

        if(response.ok) {
            console.log("Job submitted successfully.");
            // Redirect or display a success message
        } else {
            console.error("Submission failed.");
            // Handle errors or display a message
        }
    } catch (error) {
        console.error("Error submitting the form:", error);
    }
};
