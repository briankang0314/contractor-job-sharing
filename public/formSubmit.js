document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('jobShareForm');

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent the default form submission

        if (!form.checkValidity()) {
            alert('Please fill out the form correctly.');
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        try {
            // Send the form data to the server using Fetch API
            const response = await fetch('/submit-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Handle the response from the server
            if (response.ok) {
                const result = await response.json(); // Assuming server sends back JSON response
                console.log("Job submitted successfully.", result);
                // Display a success message to the user or redirect
                alert('Job submitted successfully!');
                form.reset(); // Optionally reset the form
            } else {
                // Handle server errors or invalid responses
                console.error("Submission failed.");
                alert('Failed to submit job. Please try again.');
            }
        } catch (error) {
            // Handle network errors
            console.error("Error submitting the form:", error);
            alert('An error occurred. Please try again.');
        }
    });
});
