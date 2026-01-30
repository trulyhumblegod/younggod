const posts = [
    {
        id: "noobs-chatgpt",
        title: "Por qué Chat GPT es para noobs y qué es mejor",
        date: "JAN 30, 2026",
        file: "posts/noobs-chatgpt.html"
    },
    {
        id: "two-years-left",
        title: "Why you only have 2 years to make it",
        date: "JAN 30, 2026",
        file: "posts/two-years-left.html"
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
