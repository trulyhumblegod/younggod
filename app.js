const posts = [
    {
        id: "why-chatgpt-sucks",
        title: "On the Inadequacy of Consumer-Grade Language Models",
        date: "JAN 28, 2026",
        file: "posts/why-chatgpt-sucks.html"
    }
];

let postList;

function init() {
    console.log("[Blog] Initializing...");
    postList = document.getElementById('post-list');

    if (!postList) {
        console.error("[Blog] Critical error: post-list not found.");
        return;
    }

    renderPosts();
    console.log("[Blog] Initialization complete.");
}

function renderPosts() {
    console.log("[Blog] Rendering posts...");
    postList.innerHTML = posts.map(post => `
        <li>
            <a href="${post.file}" class="post-item">
                <span class="post-title">${post.title}</span>
                <span class="post-date">${post.date}</span>
            </a>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
