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
                document.getElementById("post-date").textContent = post.date;

                const postContentContainer = document.getElementById("post-content");
                postContentContainer.innerHTML = ""; // Clear existing content

                // Add main post image if available
                if (post.imageUrl) {
                    const mainImage = document.createElement("img");
                    mainImage.src = post.imageUrl;
                    mainImage.alt = post.title;
                    mainImage.classList.add("main-post-image"); // Add CSS class for styling
                    postContentContainer.appendChild(mainImage);
                }

                // Loop through content array and dynamically create elements
                post.content.forEach(item => {
                    if (item.type === "paragraph") {
                        const paragraph = document.createElement("p");
                        paragraph.textContent = item.text;
                        postContentContainer.appendChild(paragraph);
                    } else if (item.type === "image") {
                        const img = document.createElement("img");
                        img.src = item.url;
                        img.alt = item.caption || "Image";
                        img.classList.add("post-image"); // Add CSS class for styling
                        postContentContainer.appendChild(img);

                        if (item.caption) {
                            const caption = document.createElement("p");
                            caption.textContent = item.caption;
                            caption.classList.add("image-caption"); // Add CSS class for styling
                            postContentContainer.appendChild(caption);
                        }
                    } else if (item.type === "ad") {
                        const adContainer = document.createElement("div");
                        adContainer.classList.add("ad-container"); // Add CSS class for styling

                        const adImage = document.createElement("img");
                        adImage.src = item.bannerUrl;
                        adImage.alt = "Advertisement";
                        adImage.classList.add("ad-banner"); // Add CSS class for styling
                        adImage.addEventListener("click", () => {
                            window.open(item.link, "_blank");
                        });

                        const adDescription = document.createElement("p");
                        adDescription.textContent = item.description;
                        adDescription.classList.add("ad-description");

                        adContainer.appendChild(adImage);
                        adContainer.appendChild(adDescription);
                        postContentContainer.appendChild(adContainer);
                    }
                });

            } else {
                document.getElementById("post-title").textContent = "Post Not Found";
                document.getElementById("post-content").textContent = "Sorry, we couldn't find the requested blog post.";
            }
        })
        .catch(error => console.error("Error loading post:", error));
}
