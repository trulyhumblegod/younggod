const posts = [
    {
        id: "why-chatgpt-sucks",
        title: "On the Inadequacy of Consumer-Grade Language Models", // Updated title
        date: "JAN 28, 2026",
        file: "posts/why-chatgpt-sucks.html"
    }
];


// Global references filled during init
let postList, postView, postFrame, backButton, progressBar, themeToggle;

function init() {
    console.log("[Blog] Initializing...");

    postList = document.getElementById('post-list');
    postView = document.getElementById('post-view');
    postFrame = document.getElementById('post-frame');
    backButton = document.getElementById('back-to-list');
    progressBar = document.getElementById('reading-progress');

    // Inject Toggle Button
    // createThemeToggle(); // Removed global toggle
    // themeToggle = document.getElementById('theme-toggle'); 


    if (!postList || !postView || !postFrame) {
        console.error("[Blog] Critical error: One or more DOM elements not found.");
        return;
    }


    // Initialize Theme
    // initTheme(); // Removed to protect homepage


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
    window.addEventListener('hashchange', handleHash);
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

        // Check local storage for inner iframe theme
        const savedTheme = localStorage.getItem('blog_theme') || 'dark';

        // Write content to iframe document
        const frameDoc = postFrame.contentDocument || postFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(`
            <!DOCTYPE html>
            <html lang="en" data-theme="${savedTheme}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="style.css">
                <style>
                    html {
                        width: 100%;
                        height: 100%; 
                        overflow-y: auto; /* Scroll inside iframe */
                    }
                    body {
                        margin: 0;
                        padding: 3rem 2rem 5rem 2rem; /* Adjusted opacity/readability */
                        box-sizing: border-box;
                        min-height: 100%;
                        background-image: none !important;
                    }
                    
                    /* Theme overrides applied to HTML to ensure full coverage */
                    html[data-theme="dark"] {
                         background-color: #050505 !important;
                         color: #ffffff;
                    }
                    html[data-theme="dark"] body {
                        background-color: #050505 !important;
                        color: #ffffff;
                    }

                    html[data-theme="light"] {
                        background-color: #f5f5f7 !important;
                         color: #1d1d1f;
                    }
                    html[data-theme="light"] body {
                        background-color: #f5f5f7 !important;
                        color: #1d1d1f;
                    }

                    /* Floating Toggle inside Iframe */
                    .theme-toggle {
                        position: fixed;
                        top: 1rem;
                        right: 1.5rem;
                        z-index: 9999;
                    }
                    
                    /* Correct colors for the toggle inside iframe */
                    html[data-theme="light"] .theme-toggle {
                        color: #000;
                        border-color: rgba(0,0,0,0.1);
                    }
                    
                     /* Force text colors */
                    html[data-theme="dark"] .post-content h1, 
                    html[data-theme="dark"] .post-content h2, 
                    html[data-theme="dark"] .post-content li::before {
                        color: #ffffff !important;
                    }
                    html[data-theme="light"] .post-content h1, 
                    html[data-theme="light"] .post-content h2 {
                        color: #000000 !important;
                    }
                </style>
            </head>
            <body>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Dark Mode">
                    ${savedTheme === 'light' ? '☾' : '☀'}
                </button>
                <button id="close-post" class="back-link" style="position:fixed; top:1.5rem; left:2rem; z-index:9000; margin:0;">← Back</button>

                <div class="post-content">
                    ${html}
                </div>

                <script>
                    const toggle = document.getElementById('theme-toggle');
                    toggle.addEventListener('click', () => {
                        const html = document.documentElement;
                        const current = html.getAttribute('data-theme');
                        const next = current === 'light' ? 'dark' : 'light';
                        
                        html.setAttribute('data-theme', next);
                        toggle.innerHTML = next === 'light' ? '☾' : '☀';
                        
                        localStorage.setItem('blog_theme', next);
                    });
                    
                    document.getElementById('close-post').addEventListener('click', () => {
                        window.parent.postMessage({ type: 'close' }, '*');
                    });
                    
                    // Lightbox functionality
                    document.addEventListener('click', (e) => {
                        if (e.target.matches('img')) {
                            window.parent.postMessage({
                                type: 'openLightbox',
                                src: e.target.src,
                                alt: e.target.alt
                            }, '*');
                        }
                    });
                </script>
            </body>
            </html>
        `);
        frameDoc.close();


        postView.classList.remove('hidden');

        // No resize logic needed for 100% height iframe

        setTimeout(() => {
            postView.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    } catch (error) {
        console.error("[Blog] Error loading post:", error);
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
        } else if (event.data.type === 'close') {
            closePost();
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
