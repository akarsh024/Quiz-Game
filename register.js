document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries()); // Convert FormData to a regular object

    // Check if passwords match
    if (data.password !== data.confirm_password) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed.');
        }

        alert('Registration successful! Redirecting to sign in page...');
        window.location.assign('index.html'); // Redirect to index.html

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`); // Display error message
    }
});
