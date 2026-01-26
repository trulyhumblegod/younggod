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

// Audio Player Logic
const playBtn = document.getElementById('play-pause');
const audioProgress = document.getElementById('audio-progress');
const audio = new Audio();
audio.src = 'audio/music.mp3'; // Put your mp3 here and name it music.mp3
let isPlaying = false;

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    } else {
        audio.play().catch(e => console.log("Audio play failed - maybe no file yet: ", e));
        playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    audioProgress.style.width = `${progress}%`;
});

renderPosts();
