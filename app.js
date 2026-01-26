const posts = [
    {
        id: "digital-consciousness",
        title: "The Emergence of Digital Consciousness",
        date: "JAN 26, 2026",
        file: "posts/digital-consciousness.html"
    },
    {
       
    },
    {
        
    }
];

const postList = document.getElementById('post-list');
const postView = document.getElementById('post-view');
const postContent = document.getElementById('post-content');
const backButton = document.getElementById('back-to-list');
const progressBar = document.getElementById('reading-progress');

function renderPosts() {
    postList.innerHTML = posts.map(post => `
        <li>
            <a href="#" class="post-item" data-id="${post.id}">
                <span class="post-title">${post.title}</span>
                <span class="post-date">${post.date}</span>
            </a>
        </li>
    `).join('');

    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const id = item.getAttribute('data-id');
            showPost(id);
        });
    });
}

async function showPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    try {
        const response = await fetch(post.file);
        const html = await response.text();
        postContent.innerHTML = html;

        postView.classList.remove('hidden');
        setTimeout(() => {
            postView.classList.add('active');
            document.body.style.overflow = 'hidden';
            postView.scrollTop = 0;
        }, 10);
    } catch (error) {
        console.error("Error loading post:", error);
        postContent.innerHTML = "<h1>Error loading post</h1><p>Please try again later.</p>";
    }
}

backButton.addEventListener('click', () => {
    postView.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        postView.classList.add('hidden');
    }, 600);
});

// Reading Progress
postView.addEventListener('scroll', () => {
    const scrollTotal = postView.scrollHeight - postView.clientHeight;
    const scrollPos = postView.scrollTop;
    const progress = (scrollPos / scrollTotal) * 100;
    progressBar.style.width = `${progress}%`;
});



document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
});

