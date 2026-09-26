/* ============================================
   NGAJI CERIA - Halaman Huruf Hijaiyah
   ============================================ */

// Data 28 huruf hijaiyah
const hijaiyahData = [
    { ar: 'ا', lat: 'Alif' },
    { ar: 'ب', lat: 'Ba' },
    { ar: 'ت', lat: 'Ta' },
    { ar: 'ث', lat: 'Tsa' },
    { ar: 'ج', lat: 'Jim' },
    { ar: 'ح', lat: 'Ha' },
    { ar: 'خ', lat: 'Kho' },
    { ar: 'د', lat: 'Dal' },
    { ar: 'ذ', lat: 'Dzal' },
    { ar: 'ر', lat: 'Ra' },
    { ar: 'ز', lat: 'Zai' },
    { ar: 'س', lat: 'Sin' },
    { ar: 'ش', lat: 'Syin' },
    { ar: 'ص', lat: 'Shod' },
    { ar: 'ض', lat: 'Dhod' },
    { ar: 'ط', lat: 'Tho' },
    { ar: 'ظ', lat: 'Zho' },
    { ar: 'ع', lat: "'Ain" },
    { ar: 'غ', lat: 'Ghoin' },
    { ar: 'ف', lat: 'Fa' },
    { ar: 'ق', lat: 'Qof' },
    { ar: 'ك', lat: 'Kaf' },
    { ar: 'ل', lat: 'Lam' },
    { ar: 'م', lat: 'Mim' },
    { ar: 'ن', lat: 'Nun' },
    { ar: 'و', lat: 'Wau' },
    { ar: 'ه', lat: 'Ha' },
    { ar: 'ي', lat: 'Ya' }
];

let currentIndex = 0;

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    renderLetter();
    renderStrip();
});

// Tampilkan huruf saat ini
function renderLetter() {
    const letter = hijaiyahData[currentIndex];
    
    const card = document.getElementById('letterCard');
    const arabicEl = document.getElementById('arabicLetter');
    const latinEl = document.getElementById('latinLetter');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    
    // Animasi reset
    card.style.animation = 'none';
    setTimeout(() => card.style.animation = 'popIn 0.5s ease-out', 10);
    
    arabicEl.textContent = letter.ar;
    latinEl.textContent = letter.lat;
    
    // Update progress
    progressText.textContent = `${currentIndex + 1} / ${hijaiyahData.length}`;
    const percent = ((currentIndex + 1) / hijaiyahData.length) * 100;
    progressBar.style.width = percent + '%';
    
    // Update strip aktif
    document.querySelectorAll('.mini-letter').forEach((el, i) => {
        el.classList.toggle('active', i === currentIndex);
        if (i === currentIndex) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
    
    // Update tombol nav
    const prevBtn = document.querySelector('.btn-nav.prev');
    const nextBtn = document.querySelector('.btn-nav.next');
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === hijaiyahData.length - 1;
}

// Render strip huruf mini
function renderStrip() {
    const strip = document.getElementById('lettersStrip');
    strip.innerHTML = '';
    
    hijaiyahData.forEach((letter, i) => {
        const el = document.createElement('div');
        el.className = 'mini-letter';
        el.textContent = letter.ar;
        el.onclick = () => {
            currentIndex = i;
            renderLetter();
            if (navigator.vibrate) navigator.vibrate(20);
        };
        strip.appendChild(el);
    });
    
    renderLetter();
}

// Navigasi
function nextLetter() {
    if (typeof playTapSound === "function") playTapSound();
    if (currentIndex < hijaiyahData.length - 1) {
        currentIndex++;
        renderLetter();
        if (navigator.vibrate) navigator.vibrate(20);
    }
}

function prevLetter() {
    if (typeof playTapSound === "function") playTapSound();
    if (currentIndex > 0) {
        currentIndex--;
        renderLetter();
        if (navigator.vibrate) navigator.vibrate(20);
    }
}

// Putar suara huruf (sementara pakai Web Speech API)
async function playSound() {
    const letter = hijaiyahData[currentIndex];
    
    const btn = event ? event.currentTarget : null;
    if (btn) {
        btn.classList.add("animate-pulse");
        setTimeout(() => btn.classList.remove("animate-pulse"), 500);
    }
    
    if (navigator.vibrate) navigator.vibrate(30);
    
    const arabicEl = document.getElementById("arabicLetter");
    if (arabicEl) {
        arabicEl.style.animation = "pulse 0.7s ease-in-out";
        setTimeout(() => { arabicEl.style.animation = "float 3s ease-in-out infinite"; }, 700);
    }
    
    // Coba pakai Native TTS Capacitor dulu
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
        try {
            await window.Capacitor.Plugins.TextToSpeech.speak({
                text: letter.lat,
                lang: "id-ID",
                rate: 0.85,
                pitch: 1.5,
                volume: 1.0,
                category: "ambient"
            });
            return;
        } catch (e) {
            console.log("Native TTS gagal, fallback ke Web Speech API:", e);
        }
    }
    
    // Fallback: Web Speech API
    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(letter.lat);
        utterance.lang = "id-ID";
        utterance.pitch = 1.8;
        utterance.rate = 0.85;
        utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
    } else {
        showToast("🔊 " + letter.lat);
    }
}

// Tombol latihan
function startPractice() {
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    showToast('🎯 Mode Latihan segera hadir!');
}

// Kembali
function goBack() {
    if (navigator.vibrate) navigator.vibrate(30);
    window.location.href = '../index.html';
}

// Toast
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
