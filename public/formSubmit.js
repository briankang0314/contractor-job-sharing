document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('jobShareForm');
    const phoneInput = document.getElementById('phone');

    // Function to auto-format the phone number
    const formatPhoneNumber = (input) => {
        // Strip all characters from the input except digits
        const numbers = input.replace(/\D/g, '');

        // Split the string into parts based on the desired format (xxx-xxx-xxxx)
        const matches = numbers.match(/^(\d{3})(\d{4})(\d{4})$/);

        // If there's a match, format it. Otherwise, return the original input
        return matches ? `${matches[1]}-${matches[2]}-${matches[3]}` : numbers;
    };

    // Listen for input events on the phone input to auto-format the phone number
    phoneInput.addEventListener('input', function () {
        this.value = formatPhoneNumber(this.value);

        // Check if the formatted number matches the expected pattern
        if (/^\d{3}-\d{4}-\d{4}$/.test(this.value)) {
            // Optionally change the input border color or show a checkmark to indicate a valid format
            this.style.borderColor = 'green';
        } else {
            // Indicate that the format is not yet correct
            this.style.borderColor = 'red'; // Example: change border color to red
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent the default form submission

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
                alert(result.message || 'Job submitted successfully!');
                form.reset(); // Optionally reset the form
            } else {
                try {
                    const errorResult = await response.json();
                    console.error("Submission failed:", errorResult);
                    alert(errorResult.message || 'Failed to submit job. Please try again.');
                } catch (jsonParseError) {
                    // If the error response isn't JSON, use a generic error message
                    alert('Failed to submit job. Please try again.');
                }
            }
        } catch (error) {
            // Handle network errors
            console.error("Error submitting the form:", error);
            alert('An error occurred. Please try again.');
        }
    });
});
