function playQuestion() {
    if (!gameState.currentAnswer) return;
    
    const letter = gameState.currentAnswer;
    
    const btn = document.getElementById("btnListen");
    if (btn) {
        btn.style.animation = "none";
        setTimeout(() => btn.style.animation = "pulse 2s infinite", 10);
    }
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(letter.lat);
        utterance.lang = "id-ID";
        utterance.pitch = 1.8;
        utterance.rate = 0.8;
        utterance.volume = 1.0;
        const voices = speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang && v.lang.includes("id"));
        if (idVoice) utterance.voice = idVoice;
        speechSynthesis.speak(utterance);
        document.getElementById("questionHint").textContent = "Mendengarkan: " + letter.lat;
    } else {
        document.getElementById("questionHint").textContent = "Suara: " + letter.lat;
    }
}
