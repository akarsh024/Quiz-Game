// JavaScript to toggle dropdown visibility
document.getElementById("profileIcon").addEventListener("click", function () {
  const dropdown = document.getElementById("dropdownContent");
  dropdown.classList.toggle("show");
});

const playerName = localStorage.getItem("userName");
console.log(`player name is ${playerName}`);
document.getElementById("Name").innerHTML = playerName;
fetchUserEmail(playerName).then(email => {
    document.getElementById("Email").textContent = email; // Display the email
}).catch(error => {
    console.error('Error fetching email:', error);
});


async function fetchUserEmail(playerName) {
    try {
        const response = await fetch('http://localhost:3001/getmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: playerName }), // Change this line
        });

        if (response.ok) {
            const data = await response.json(); // Parse the JSON response
            console.log('User email:', data.email);
            return data.email // Handle the retrieved email
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            throw new Error(errorData.message) // Handle error messages
        }
    } catch (error) {
        console.error('Network error:', error);
        throw error; // Handle network errors
    }
}




// Close the dropdown if clicked outside
window.onclick = function (event) {
  if (!event.target.matches("#profileIcon")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function preventBack() {
  window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () {
  null;
};
