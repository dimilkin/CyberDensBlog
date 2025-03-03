document.addEventListener("DOMContentLoaded", loadSinglePost);

function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    fetch("../assets/posts-bg.json")
        .then(response => response.json())
        .then(posts => {
            const post = posts.find(p => p.id == postId);
            if (post) {
                document.getElementById("post-title").textContent = post.title;
                document.getElementById("post-content").textContent = post.content;
                document.getElementById("post-date").textContent = post.date;

                if (post.imageUrl) {
                    const postImage = document.getElementById("post-image");
                    postImage.src = post.imageUrl;
                    postImage.alt = post.title;
                    postImage.style.display = "block";
                }
            } else {
                document.getElementById("post-title").textContent = "Post Not Found";
                document.getElementById("post-content").textContent = "Sorry, we couldn't find the requested blog post.";
            }
        })
        .catch(error => console.error("Error loading post:", error));
}


