/* ============================================
   NGAJI CERIA - Main App with 4D Animations
   ============================================ */

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

/* ===== NAVIGASI DENGAN PAGE TRANSITION ===== */
function startMenu(menu) {
    if (navigator.vibrate) navigator.vibrate(30);
    playTapSound();
    
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
        // Page transition
        document.body.classList.add('page-exit');
        setTimeout(() => {
            window.location.href = routes[menu];
        }, 250);
    } else {
        showToast('Membuka ' + menu.toUpperCase() + '... (segera hadir)');
    }
}

function switchTab(el, tab) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(20);
    playTapSound();
    
    const routes = {
        home: 'index.html',
        materi: 'pages/hijaiyah.html',
        game: 'pages/game.html',
        rank: 'pages/rank.html',
        profil: 'pages/profil.html'
    };
    
    if (tab === 'home') return;
    
    if (routes[tab]) {
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = routes[tab]; }, 200);
    }
}

/* ===== TOAST ===== */
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
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/* ===== CONFETTI ===== */
function showConfetti() {
    const colors = ['#FF5252', '#FFD740', '#69F0AE', '#40C4FF', '#E040FB'];
    const emojis = ['⭐', '✨', '🌟', '💫', '🎉', '🎊'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // 50% emoji, 50% square
        if (Math.random() > 0.5) {
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.fontSize = '24px';
            confetti.style.width = 'auto';
            confetti.style.height = 'auto';
            confetti.style.background = 'transparent';
        } else {
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        }
        
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

/* ===== SISTEM POIN ===== */
function addPoints(amount) {
    userState.coins += amount;
    saveState();
    updateUI();
    showToast('+' + amount + ' Poin! 🪙');
    playCoinSound();
}

function addStar() {
    userState.stars = (userState.stars || 0) + 1;
    if (userState.stars >= 3) {
        userState.stars = 0;
        userState.level++;
        saveState();
        updateUI();
        showConfetti();
        showToast('🎉 Naik ke Level ' + userState.level + '!');
        playLevelUpSound();
    } else {
        saveState();
        showToast('⭐ Bintang ' + userState.stars + '/3');
    }
}

/* ===== FLOATING PARTICLES ===== */
function createParticles() {
    const particles = ['✨', '⭐', '🌟', '💫'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = (60 + Math.random() * 40) + 'vh';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.fontSize = (10 + Math.random() * 12) + 'px';
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 8000);
        }, i * 500);
    }
}

/* ===== RIPPLE EFFECT ===== */
function addRipple(e) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

/* ===== SOUND EFFECTS (Web Audio API) ===== */
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
    }
    return audioContext;
}

function playTone(frequency, duration, type) {
    const ctx = initAudio();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type || 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

function playTapSound() {
    playTone(800, 0.05, 'sine');
}

function playCoinSound() {
    playTone(1200, 0.08, 'sine');
    setTimeout(() => playTone(1600, 0.1, 'sine'), 60);
}

function playLevelUpSound() {
    playTone(523, 0.1);
    setTimeout(() => playTone(659, 0.1), 100);
    setTimeout(() => playTone(784, 0.15), 200);
}

function playCorrectSound() {
    playTone(880, 0.1);
    setTimeout(() => playTone(1100, 0.15), 80);
}

function playWrongSound() {
    playTone(400, 0.15);
    setTimeout(() => playTone(300, 0.2), 100);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Page enter animation
    document.body.classList.add('page-enter');
    
    // Add ripple effect to buttons
    setTimeout(() => {
        document.querySelectorAll('.menu-card, .btn-nav, .btn-sound, .btn-practice, .stat-badge').forEach(btn => {
            btn.addEventListener('click', addRipple);
        });
        
        // Stagger animation for menu cards
        document.querySelectorAll('.menu-card').forEach((card, i) => {
            card.classList.add('stagger-item');
            card.style.animationDelay = (i * 0.05) + 's';
        });
    }, 100);
    
    // Floating particles every 15 seconds
    createParticles();
    setInterval(createParticles, 15000);
    
    // Init audio on first tap (required by mobile browsers)
    document.addEventListener('touchstart', function initOnce() {
        initAudio();
        document.removeEventListener('touchstart', initOnce);
    }, { once: true });
    
    console.log('🌙 Ngaji Ceria dengan animasi 4D siap!');
});

document.addEventListener('gesturestart', e => e.preventDefault());
