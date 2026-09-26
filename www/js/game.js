/* ============================================
   NGAJI CERIA - Game Hijaiyah (FIXED)
   ============================================ */

const gameLetters = [
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

let gameState = {
    currentQuestion: 0,
    totalQuestions: 10,
    correctAnswers: 0,
    pointsEarned: 0,
    currentAnswer: null,
    answered: false
};

// ===== INIT GAME =====
function initGame() {
    console.log('🎮 initGame dipanggil');
    gameState = {
        currentQuestion: 0,
        totalQuestions: 10,
        correctAnswers: 0,
        pointsEarned: 0,
        currentAnswer: null,
        answered: false
    };
    
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('modalOverlay').classList.remove('show');
    
    nextQuestion();
}

// ===== SOAL BARU =====
function nextQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        endGame();
        return;
    }
    
    gameState.currentQuestion++;
    gameState.answered = false;
    
    document.getElementById('currentQ').textContent = gameState.currentQuestion;
    const percent = (gameState.currentQuestion / gameState.totalQuestions) * 100;
    document.getElementById('gameProgressFill').style.width = percent + '%';
    
    // Pilih 1 huruf jawaban + 3 pengecoh
    const shuffled = [...gameLetters].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    gameState.currentAnswer = options[Math.floor(Math.random() * 4)];
    
    // Reset UI
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('questionHint').textContent = 'Tekan tombol untuk mendengar';
    
    // Render pilihan
    renderAnswers(options);
    
    // Auto play suara
    setTimeout(() => playQuestion(), 600);
}

// ===== RENDER PILIHAN =====
function renderAnswers(options) {
    const grid = document.getElementById('answerGrid');
    grid.innerHTML = '';
    
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = letter.ar;
        btn.onclick = () => checkAnswer(btn, letter);
        grid.appendChild(btn);
    });
}

// ===== MAIN SUARA SOAL =====
async function playQuestion() {
    if (!gameState.currentAnswer) return;
    
    const letter = gameState.currentAnswer;
    
    const btn = document.getElementById('btnListen');
    if (btn) {
        btn.style.animation = 'none';
        setTimeout(() => btn.style.animation = 'pulse 2s infinite', 10);
    }
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Pakai Native TTS Capacitor
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
        try {
            await window.Capacitor.Plugins.TextToSpeech.speak({
                text: letter.lat,
                lang: 'id-ID',
                rate: 0.8,
                pitch: 1.5,
                volume: 1.0,
                category: 'ambient'
            });
            document.getElementById('questionHint').textContent = 'Mendengarkan: ' + letter.lat;
            return;
        } catch (e) {
            console.log('Native TTS gagal:', e);
        }
    }
    
    // Fallback: Web Speech API
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(letter.lat);
        utterance.lang = 'id-ID';
        utterance.pitch = 1.8;
        utterance.rate = 0.8;
        utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
        document.getElementById('questionHint').textContent = 'Mendengarkan: ' + letter.lat;
    } else {
        document.getElementById('questionHint').textContent = 'Suara: ' + letter.lat;
    }
}

// ===== CEK JAWABAN =====
function checkAnswer(btn, chosenLetter) {
    if (gameState.answered) return;
    gameState.answered = true;
    
    const isCorrect = chosenLetter.lat === gameState.currentAnswer.lat;
    const feedback = document.getElementById('feedback');
    const allBtns = document.querySelectorAll('.answer-btn');
    
    allBtns.forEach(b => b.disabled = true);
    
    if (isCorrect) {
        btn.classList.add('correct');
        feedback.textContent = '✅ Hebat! Benar!';
        feedback.className = 'feedback correct';
        
        gameState.correctAnswers++;
        gameState.pointsEarned += 10;
        
        if (typeof addPoints === 'function') addPoints(10);
        
        document.getElementById('gameScore').textContent = gameState.pointsEarned;
        
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        if (typeof showConfetti === 'function') showConfetti();
        
        setTimeout(() => nextQuestion(), 1200);
    } else {
        btn.classList.add('wrong');
        feedback.textContent = '❌ Salah, yang benar: ' + gameState.currentAnswer.lat;
        feedback.className = 'feedback wrong';
        
        allBtns.forEach(b => {
            if (b.textContent === gameState.currentAnswer.ar) {
                b.classList.add('correct');
            }
        });
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        
        setTimeout(() => nextQuestion(), 1800);
    }
}

// ===== SELESAI GAME =====
function endGame() {
    const overlay = document.getElementById('modalOverlay');
    const correctRate = gameState.correctAnswers / gameState.totalQuestions;
    
    let emoji = '🎉';
    let title = 'Hebat!';
    let text = 'Kamu menyelesaikan ' + gameState.totalQuestions + ' soal!';
    
    if (correctRate >= 0.9) {
        emoji = '🏆';
        title = 'Luar Biasa!';
        text = 'Kamu sangat pintar!';
        if (typeof addStar === 'function') addStar();
    } else if (correctRate >= 0.7) {
        emoji = '🌟';
        title = 'Bagus Sekali!';
        text = 'Terus berlatih ya!';
        if (typeof addStar === 'function') addStar();
    } else if (correctRate >= 0.5) {
        emoji = '👍';
        title = 'Bagus!';
        text = 'Ayo coba lagi!';
    } else {
        emoji = '💪';
        title = 'Semangat!';
        text = 'Coba lagi ya, kamu pasti bisa!';
    }
    
    document.getElementById('modalEmoji').textContent = emoji;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    document.getElementById('statCorrect').textContent = gameState.correctAnswers;
    document.getElementById('statPoints').textContent = gameState.pointsEarned;
    
    overlay.classList.add('show');
    
    if (typeof showConfetti === 'function') showConfetti();
}

// ===== RESTART =====
function restartGame() {
    document.getElementById('modalOverlay').classList.remove('show');
    initGame();
}

// ===== KEMBALI =====
function goBack() {
    if (navigator.vibrate) navigator.vibrate(30);
    window.location.href = '../index.html';
}

// ===== START =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 game.js loaded');
    initGame();
});
