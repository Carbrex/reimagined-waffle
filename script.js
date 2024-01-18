const repositoriesContainer = document.getElementById("repositories");
const userBioContainer = document.getElementById("userBio");
const userImageContainer = document.getElementById("userImage");
const usernameInput = document.getElementById("usernameInput");
const perPageSelect = document.getElementById("perPageSelect");
let currentPage = 1;
let repositoriesPerPage = parseInt(perPageSelect.value, 10);

usernameInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        fetchUserData();
    }
})

function fetchUserData() {
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter a valid GitHub username.");
        return;
    }

    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(userData => {
            if (userData.message === "Not Found") {
                alert("User not found.");
                userBioContainer.innerHTML = "User not found.";
                userImageContainer.innerHTML = "";
                repositoriesContainer.innerHTML = "";
                return;
            }
            // Display user bio
            userBioContainer.innerHTML = `
                    <h2>Bio</h2>
                    <p>${userData.bio || "No bio available."}</p>
                    <p>GitHub: <a href="${userData.html_url}" target="_blank">${userData.html_url}</a></p>
                    <p>Twitter: <a href="https://twitter.com/${userData.twitter_username}" target="_blank">${userData.twitter_username || "Not specified"}</a></p>
                `;
            userImageContainer.innerHTML = `<img src="${userData.avatar_url}" alt="User Image" class="user-image">`;
            fetchRepositories(username);
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Error fetching user data. Please try again later.");
            userBioContainer.innerHTML = "User not found.";
            userImageContainer.innerHTML = "";
            repositoriesContainer.innerHTML = "";
        });
}

function fetchRepositories(username) {
    fetch(`https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${repositoriesPerPage}`)
        .then(response => response.json())
        .then(repositories => {
            repositoriesContainer.innerHTML = ""; // Clear previous repositories

            repositories.forEach(repository => {
                const repositoryElement = document.createElement("div");
                repositoryElement.className = "repository";
                repositoryElement.innerHTML = `
                        <h3><a href="${repository.html_url}" target="_blank">${repository.name}</a></h3>
                        <p>${repository.description || "No description available."}</p>
                        <p>Language: ${repository.language || "Not specified"}</p>
                        <p>Tags: ${repository.topics.map(tag => `<span class="tag">${tag}</span>`).join("")|| "No tags"}</p>
                    `;
                repositoriesContainer.appendChild(repositoryElement);
            });
            if (repositories.length === 0) {
                repositoriesContainer.innerHTML = "No repositories found.";
            }
            // Enable/disable pagination buttons based on the current page
            const prevButton = document.querySelector("#pagination button:first-child");
            prevButton.disabled = currentPage === 1;

            const currentPageElement = document.getElementById("currentPage");
            currentPageElement.textContent = currentPage;

        })
        .catch(error => {
            console.error("Error fetching repositories:", error);
            alert("Error fetching repositories. Please try again later.");
            repositoriesContainer.innerHTML = "User not found.";
        });
}

function nextPage() {
    currentPage++;
    fetchUserData();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchUserData();
    }
}

function changePerPage() {
    repositoriesPerPage = parseInt(perPageSelect.value, 10);
    currentPage = 1;
    fetchUserData();
}

document.querySelector('button').addEventListener('click', fetchUserData);
