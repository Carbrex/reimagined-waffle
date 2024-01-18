document.getElementById("usernameInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        fetchRepositories();
    }
});

function fetchRepositories() {
    const usernameInput = document.getElementById("usernameInput");
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter a valid GitHub username.");
        return;
    }

    const repositoriesContainer = document.getElementById("repositories");
    repositoriesContainer.innerHTML = ""; // Clear previous repositories

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repositories => {
            repositories.forEach(repository => {
                const repositoryElement = document.createElement("div");
                repositoryElement.className = "repository";
                repositoryElement.innerHTML = `
                    <h2><a href="${repository.html_url}" target="_blank">${repository.name}</a></h2>
                    <p>${repository.description || "No description available."}</p>
                    <p>Language: ${repository.language || "Not specified"}</p>
                `;
                repositoriesContainer.appendChild(repositoryElement);
            });
            if (repositories.length === 0) {
                const repositoryElement = document.createElement("div");
                repositoryElement.className = "repository";
                repositoryElement.innerHTML = `
                    <h2>No repositories found.</h2>
                `;
                repositoriesContainer.appendChild(repositoryElement);
            }
        })
        .catch(error => {
            console.error("Error fetching repositories:", error);
            alert("Error fetching repositories. User doesn't exist. Please enter a valid GitHub username.");
        });
}