document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("posts-container")) {
        loadPosts();
    } else {
        loadSinglePost();
    }

    document.getElementById("lang-toggle").addEventListener("click", toggleLanguage);
});

function loadPosts() {
    fetch("../assets/posts-bg.json")
        .then(response => response.json())
        .then(posts => {
            const container = document.getElementById("posts-container");
            container.innerHTML = "";

            posts.forEach(post => {
                let postDiv = document.createElement("div");
                postDiv.classList.add("blog-post");
            
                postDiv.innerHTML = `
                    <div class="post-content">
                        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" class="blog-thumbnail">` : ""}
                        <h2>${post.title}</h2>
                        <p>${post.preview}</p> <!-- Use the preview here -->
                        <p class="post-date">${post.date}</p>
                    </div>
                `;
            
                postDiv.addEventListener("click", function () {
                    window.location.href = `post.html?id=${post.id}`;
                });
            
                container.appendChild(postDiv);
            });
            
        })
        .catch(error => console.error("Error loading posts:", error));
}




function toggleLanguage() {
    alert("Language toggle functionality can be implemented here.");
}
