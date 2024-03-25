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
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        // Remove formatting for the phone number before sending
        data.phone = data.phone.replace(/\D/g, '');

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
