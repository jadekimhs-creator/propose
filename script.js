let audioContext;
let analyser;
let microphone;
let dataArray;
let isBlowing = false;
let blowDuration = 0;
let animationId;

// Switch screens helper
function switchScreen(fromId, toId) {
    document.getElementById(fromId).classList.remove('active');
    setTimeout(() => {
        document.getElementById(toId).classList.add('active');
    }, 1500); // Wait for fade out
}

async function startMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        microphone.connect(analyser);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        switchScreen('introScreen', 'cakeScreen');
        checkAudioVolume();
        
    } catch (err) {
        alert("마이크 권한이 필요합니다! 권한을 허용하고 다시 시도해주세요.");
        console.error("Error accessing microphone", err);
    }
}

function checkAudioVolume() {
    if (isBlowing) return; // Stop checking if already blown out
    
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let average = sum / dataArray.length;
    
    // Update visual meter
    const meterBar = document.getElementById('meterBar');
    // Map average (0-128 typically for speech/blow) to percentage
    let meterPercentage = Math.min(100, (average / 100) * 100);
    meterBar.style.width = meterPercentage + '%';
    
    // Make flame react to sound
    const flame = document.getElementById('flame');
    if (average > 10) {
        flame.style.transform = `translateX(-50%) scale(1) rotate(${Math.random() * 20 - 10}deg)`;
    } else {
        flame.style.transform = `translateX(-50%) scale(1) rotate(0deg)`;
    }
    
    // Check for "blowing" threshold (loud sustained noise)
    if (average > 80) { // Adjust threshold based on testing
        blowDuration++;
        if (blowDuration > 15) { // Needs to blow for roughly 15 frames
            blowOutCandle();
        }
    } else {
        blowDuration = 0; // Reset if they stop
    }
    
    animationId = requestAnimationFrame(checkAudioVolume);
}

function blowOutCandle() {
    isBlowing = true;
    cancelAnimationFrame(animationId);
    
    const flame = document.getElementById('flame');
    flame.classList.add('blown-out');
    
    // Fade to dark screen after candle goes out
    setTimeout(() => {
        document.getElementById('cakeScreen').classList.remove('active');
        document.getElementById('darkScreen').classList.add('active');
        
        // Wait a bit in darkness, then show blooming flowers and proposal
        setTimeout(() => {
            document.getElementById('darkScreen').classList.remove('active');
            document.getElementById('proposalScreen').classList.add('active');
            createFlowers();
        }, 2500);
        
    }, 1000);
}

function createFlowers() {
    const container = document.getElementById('flowers');
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.classList.add('flower-particle');
            
            // Random size 100px to 300px
            const size = Math.random() * 200 + 100;
            flower.style.width = `${size}px`;
            flower.style.height = `${size}px`;
            
            // Random position
            flower.style.left = `${Math.random() * 100}vw`;
            flower.style.top = `${Math.random() * 100}vh`;
            
            // Random color tint
            const hues = [350, 320, 40, 20]; // Pink, Magenta, Gold, Orange
            const hue = hues[Math.floor(Math.random() * hues.length)];
            flower.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 75%, 0.8) 0%, transparent 70%)`;
            
            container.appendChild(flower);
        }, i * 150);
    }
}

// "No" button escaping logic
const noBtn = document.getElementById('noBtn');

function moveNoBtn() {
    noBtn.style.position = 'fixed';
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 40) + 20;
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 40) + 20;
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

noBtn.addEventListener('mouseover', moveNoBtn);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoBtn();
});

// Premium Confetti (Proposal Accepted)
function acceptProposal() {
    switchScreen('proposalScreen', 'successScreen');
    
    var duration = 4000;
    var end = Date.now() + duration;
    var colors = ['#ffb6c1', '#fbc2eb', '#ffffff', '#e5a872']; 

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            zIndex: 10000
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            zIndex: 10000
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 160,
            origin: { y: 0.6 },
            colors: colors,
            zIndex: 10000
        });
    }, 800);
}
