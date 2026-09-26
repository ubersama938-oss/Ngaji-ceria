const userState = {
    name: 'Ananda Ahmad',
    level: 3,
    coins: 350,
    stars: 0,
    progress: { iqra: 1, hijaiyah: 0, surat: 0, doa: 0 }
};

function loadState() {
    const saved = localStorage.getItem('ngajiCeriaState');
    if (saved) Object.assign(userState, JSON.parse(saved));
    updateUI();
}

function saveState() {
    localStorage.setItem('ngajiCeriaState', JSON.stringify(userState));
}

function updateUI() {
    const nameEl = document.getElementById('userName');
    const levelEl = document.getElementById('levelNum');
    const coinEl = document.getElementById('coinNum');
    if (nameEl) nameEl.textContent = userState.name;
    if (levelEl) levelEl.textContent = userState.level;
    if (coinEl) coinEl.textContent = userState.coins;
}

function startMenu(menu) {
    if (navigator.vibrate) navigator.vibrate(30);

    const routes = {
        'iqra': 'pages/iqra.html',
        'hijaiyah': 'pages/hijaiyah.html',
        'surat': 'pages/surat.html',
        'doa': 'pages/doa.html',
        'listen': 'pages/listen.html',
        'game': 'pages/game.html',
        'points': 'pages/points.html',
        'map': 'pages/map.html'
    };

    if (menu === 'hijaiyah' || menu === 'game') {
        window.location.href = routes[menu];
    } else {
        showToast('Membuka ' + menu.toUpperCase() + '... (segera hadir)');
    }
}

function switchTab(el, tab) {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    el.classList.add("active");
    if (navigator.vibrate) navigator.vibrate(20);
    const routes = {
        home: "index.html",
        materi: "pages/hijaiyah.html",
        game: "pages/game.html",
        rank: "pages/rank.html",
        profil: "pages/profil.html"
    };
    if (tab === "home") return;
    if (routes[tab]) {
        setTimeout(() => { window.location.href = routes[tab]; }, 200);
    }
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

function showConfetti() {
    const colors = ['#FF5252', '#FFD740', '#69F0AE', '#40C4FF', '#E040FB'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    console.log('🌙 Ngaji Ceria siap!');
});

document.addEventListener('gesturestart', e => e.preventDefault());

/* ============================================
   SISTEM POIN, BINTANG & LEVEL
   ============================================ */

function addPoints(amount) {
    userState.coins += amount;
    saveState();
    updateUI();
    showToast(`+${amount} Poin! 🪙`);
}

function addStar() {
    userState.stars = (userState.stars || 0) + 1;
    
    // Setiap 3 bintang, naik level
    if (userState.stars >= 3) {
        userState.stars = 0;
        userState.level++;
        saveState();
        updateUI();
        showConfetti();
        showToast(`🎉 Naik ke Level ${userState.level}!`);
    } else {
        saveState();
        showToast(`⭐ Bintang ${userState.stars}/3`);
    }
}

function addProgress(category, value) {
    if (!userState.progress) userState.progress = {};
    userState.progress[category] = value;
    saveState();
}

function getProgress(category) {
    return (userState.progress && userState.progress[category]) || 0;
}
