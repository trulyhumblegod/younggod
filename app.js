const posts = [
    {
        id: "why-chatgpt-sucks",
        title: "Why ChatGPT sucks (and what to use instead)",
        date: "JAN 26, 2026",
        file: "posts/why-chatgpt-sucks.html"
    },
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
let postList, postView, postFrame, backButton, progressBar;

function init() {
    console.log("[Blog] Initializing...");

    postList = document.getElementById('post-list');
    postView = document.getElementById('post-view');
    postFrame = document.getElementById('post-frame');
    backButton = document.getElementById('back-to-list');
    progressBar = document.getElementById('reading-progress');

    if (!postList || !postView || !postFrame || !backButton || !progressBar) {
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
        // Use pushState to remove hash without triggering scroll jump
        history.pushState("", document.title, window.location.pathname + window.location.search);
        handleHash(); // Manually trigger hash handler since pushState doesn't fire hashchange
    });

    window.addEventListener('hashchange', handleHash);

    // Progress bar listener on the postView container
    postView.addEventListener('scroll', () => {
        const scrollTotal = postView.scrollHeight - postView.clientHeight;
        const scrollPos = postView.scrollTop;
        if (scrollTotal > 0) {
            const progress = (scrollPos / scrollTotal) * 100;
            progressBar.style.width = `${progress}%`;
        } else {
            progressBar.style.width = '0%';
        }
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
        const postFrame = document.getElementById('post-frame');

        // Write content to iframe document
        const frameDoc = postFrame.contentDocument || postFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="style.css">
                <style>
                    html, body {
                        background: #ffffff;
                        overflow: hidden; /* Prevent iframe scrollbars */
                        padding: 0;
                        margin: 0;
                        width: 100%;
                    }
                    body {
                        padding: 0 2rem 4rem 2rem;
                        box-sizing: border-box;
                    }
                    /* Ensure lightbox images work inside iframe */
                    .post-content img { cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="post-content">
                    ${html}
                </div>
            </body>
            </html>
        `);
        frameDoc.close();

        postView.classList.remove('hidden');

        // Resize iframe and setup listeners when loaded
        postFrame.onload = () => {
            const frameDoc = postFrame.contentDocument || postFrame.contentWindow.document;

            // Auto-resize iframe
            const resizeIframe = () => {
                postFrame.style.height = frameDoc.body.scrollHeight + 'px';
            };
            resizeIframe();
            // Resize again after images load within iframe
            frameDoc.querySelectorAll('img').forEach(img => {
                img.onload = resizeIframe;
            });

            frameDoc.addEventListener('click', (e) => {
                if (e.target.matches('img')) {
                    window.parent.postMessage({
                        type: 'openLightbox',
                        src: e.target.src,
                        alt: e.target.alt
                    }, '*');
                }
            });
        };

        setTimeout(() => {
            postView.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    } catch (error) {
        console.error("[Blog] Error loading post:", error);
        // postFrame.srcdoc = "<h1>Error loading post</h1><p>Please try again later.</p>"; 
    }
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Message listener for iframe clicks
    window.addEventListener('message', (event) => {
        if (event.data.type === 'openLightbox') {
            lightboxImg.src = event.data.src;
            lightboxImg.alt = event.data.alt;
            lightbox.classList.add('active');
        }
    });

    // Close lightbox when clicking the close button or backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            lightbox.classList.remove('active');
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
