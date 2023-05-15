
const blogPosts = [
    {
        title: 'Първи Пост',
        date: '01-01-2023',
        content: 'Това е първият ми пост',
        image: 'https://bjorsbo.nu/wp-content/uploads/2015/06/Placeholder-Landscape-1.jpg',
        url: ''
    },
    {
        title: 'Втори Пост',
        date: '01-02-2023',
        content: 'Това е вторият ми пост',
        image: 'https://bjorsbo.nu/wp-content/uploads/2015/06/Placeholder-Landscape-1.jpg'
    },
    {
        title: 'Трети Пост',
        date: '01-03-2023',
        content: 'Това е третият ми пост',
        image: 'https://bjorsbo.nu/wp-content/uploads/2015/06/Placeholder-Landscape-1.jpg'
    }
];

function loadPosts() {

    const blogContainer = document.getElementById("post-container");

    blogPosts.forEach((post, index) => {
        const postWrapper = document.createElement('div');
        postWrapper.classList.add('post-wrapper');

        const textWrapper = document.createElement('div');
        textWrapper.classList.add('text-wrapper');

        const postImage = document.createElement('img');
        postImage.src = post.image;
        postImage.classList.add('post-image');

        const postHeader = document.createElement('h2');
        postHeader.textContent = post.title;
        postHeader.classList.add('post-header');

        const postDate = document.createElement('p');
        postDate.textContent = post.date;
        postDate.classList.add('post-date');

        const postContent = document.createElement('p');
        postContent.textContent = post.content;
        postContent.classList.add('post-content');

        const postButton = document.createElement('button');
        postButton.textContent = 'Прочети ме';
        postButton.onclick = post.title;
        postButton.classList.add('read_more_button');

        textWrapper.appendChild(postHeader);
        textWrapper.appendChild(postDate);
        textWrapper.appendChild(postContent);
        textWrapper.appendChild(postButton);
        postWrapper.appendChild(postImage);
        postWrapper.appendChild(textWrapper);

        blogContainer.appendChild(postWrapper);
    });
}

window.addEventListener("load", loadPosts);