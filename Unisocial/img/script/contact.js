// Add event listener for form submission
document.getElementById('Contact us.html').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const form = event.target;

    // Gather the form data
    const formData = new FormData(form);

    // Submit the form data via fetch
    fetch(form.action, {
        method: form.method,
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Message sent successfully!');
                form.reset(); // Reset the form fields after submission
            } else {
                alert('Failed to send message. Please try again.');
            }
        })
        .catch(error => {
            alert('Error occurred while sending the message.');
            console.error('Error:', error);
        });
});