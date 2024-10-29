document.querySelector('.form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const text = await response.text(); // Read the response as text first

        if (response.ok) {
            const data = JSON.parse(text); // Parse it as JSON only if the response is ok
            // Store the token and user ID
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', username);

            // alert('Login successful!');
            window.location.href = 'home.html';
        } else {
            // Handle different error responses
            const errorData = JSON.parse(text); // Parse the error message as JSON
            alert(`Error: ${errorData.message || 'Something went wrong.'}`);
        }
    } catch (error) {
        alert(`Network error: ${error.message}`);
    }
});