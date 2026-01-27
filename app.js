const posts = [
    {
        id: "digital-consciousness",
        title: "The Emergence of Digital Consciousness",
        date: "JAN 26, 2026",
        file: "posts/digital-consciousness.html"
    },
    {
        id: "organic-architectures",
        title: "Organic Architectures and Sacred Geometry",
        date: "JAN 20, 2026",
        file: "posts/organic-architectures.html"
    },
    {
        id: "infinite-cloud",
        title: "The Silence of the Infinite Cloud",
        date: "JAN 15, 2026",
        file: "posts/infinite-cloud.html"
    }
];

// Global references filled during init
let postList, postView, postContent, backButton, progressBar;

function init() {
    console.log("[Blog] Initializing...");

    postList = document.getElementById('post-list');
    postView = document.getElementById('post-view');
    postContent = document.getElementById('post-content');
    backButton = document.getElementById('back-to-list');
    progressBar = document.getElementById('reading-progress');

    if (!postList || !postView || !postContent || !backButton || !progressBar) {
        console.error("[Blog] Critical error: One or more DOM elements not found.");
        return;
    }

    renderPosts();
    setupEventListeners();

    // Check for deep link on load
    handleHash();

    console.log("[Blog] Initialization complete.");
}

function handleHash() {
    const hash = window.location.hash.substring(1); // Remove #
    if (hash) {
        showPost(hash, true); // true indicates it's from hash/initial load
    } else {
        closePost();
    }
}

function renderPosts() {
    console.log("[Blog] Rendering posts...");
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

function setupEventListeners() {
    backButton.addEventListener('click', () => {
        window.location.hash = ''; // This will trigger hashchange
    });

    window.addEventListener('hashchange', handleHash);

    postView.addEventListener('scroll', () => {
        const scrollTotal = postView.scrollHeight - postView.clientHeight;
        const scrollPos = postView.scrollTop;
        const progress = (scrollPos / scrollTotal) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

function closePost() {
    postView.classList.remove('active');
    document.body.style.overflow = '';
    postView.scrollTop = 0;
    setTimeout(() => {
        postView.classList.add('hidden');
    }, 600);
}

async function showPost(id, fromHash = false) {
    const post = posts.find(p => p.id === id);
    if (!post) {
        if (fromHash) closePost(); // Invalid hash, go home
        return;
    }

    if (!fromHash) {
        window.location.hash = id;
        return; // handleHash will call showPost(id, true)
    }

    console.log(`[Blog] Loading post: ${id}`);
    try {
        const response = await fetch(post.file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        postContent.innerHTML = html;

        postView.classList.remove('hidden');
        setTimeout(() => {
            postView.classList.add('active');
            document.body.style.overflow = 'hidden';
            postView.scrollTop = 0;
        }, 10);
    } catch (error) {
        console.error("[Blog] Error loading post:", error);
        postContent.innerHTML = "<h1>Error loading post</h1><p>Please try again later.</p>";
    }
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Delegate click events to post content for ALL images
    document.addEventListener('click', (e) => {
        if (e.target.matches('.post-content img')) {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close lightbox when clicking the close button or backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            lightbox.classList.remove('active');
            // Keep overflow hidden if post view is still active
            if (!postView.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            // Keep overflow hidden if post view is still active
            if (!postView.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    initLightbox();
});
