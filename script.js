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
    }, 1500);
}

// User images config (can be updated by user)
const memoryImages = [
    'assets/photo1.jpg',
    'assets/photo2.jpg',
    'assets/photo3.jpg',
    'assets/photo4.jpg'
];

async function startApp() {
    // Attempt to play BGM
    const bgm = document.getElementById('bgMusic');
    if(bgm) {
        bgm.volume = 0.5;
        bgm.play().catch(e => console.log("BGM play failed (maybe no file yet)", e));
    }

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
        alert("마이크 권한이 거부되었거나 지원하지 않는 기기입니다. 촛불을 터치해서 진행할 수 있습니다!");
        switchScreen('introScreen', 'cakeScreen');
    }
}

function checkAudioVolume() {
    if (isBlowing) return; 
    
    analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    let average = sum / dataArray.length;
    
    const meterBar = document.getElementById('meterBar');
    let meterPercentage = Math.min(100, (average / 60) * 100);
    if (meterBar) meterBar.style.width = meterPercentage + '%';
    
    const flame = document.getElementById('flame');
    if (average > 10) {
        flame.style.transform = `translateX(-50%) scale(1) rotate(${Math.random() * 30 - 15}deg)`;
    } else {
        flame.style.transform = `translateX(-50%) scale(1) rotate(0deg)`;
    }
    
    if (average > 30) { 
        blowDuration++;
        if (blowDuration > 5) {
            blowOutCandle();
        }
    } else {
        blowDuration = 0; 
    }
    
    animationId = requestAnimationFrame(checkAudioVolume);
}

function blowOutCandle() {
    if (isBlowing) return;
    isBlowing = true;
    if (animationId) cancelAnimationFrame(animationId);
    
    const flame = document.getElementById('flame');
    flame.classList.add('blown-out');
    
    setTimeout(() => {
        document.getElementById('cakeScreen').classList.remove('active');
        document.getElementById('darkScreen').classList.add('active');
        
        setTimeout(() => {
            document.getElementById('darkScreen').classList.remove('active');
            document.getElementById('proposalScreen').classList.add('active');
            createFlowers();
            createMemories(); // Scatter memory photos
        }, 2000);
        
    }, 1500);
}

// Fallback: Click the candle to blow it out
document.getElementById('candleWrapper').addEventListener('click', () => {
    blowOutCandle();
});


function createFlowers() {
    const container = document.getElementById('flowers');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.classList.add('flower-particle');
            
            const size = Math.random() * 250 + 100;
            flower.style.width = `${size}px`;
            flower.style.height = `${size}px`;
            
            flower.style.left = `${Math.random() * 100}vw`;
            flower.style.top = `${Math.random() * 100}vh`;
            
            const hues = [35, 45, 55, 0];
            const hue = hues[Math.floor(Math.random() * hues.length)];
            flower.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 85%, 0.4) 0%, transparent 60%)`;
            
            container.appendChild(flower);
        }, i * 200);
    }
}

function createMemories() {
    const container = document.getElementById('memories');
    
    memoryImages.forEach((src, index) => {
        setTimeout(() => {
            const polaroid = document.createElement('div');
            polaroid.classList.add('memory-photo');
            
            // Random positioning around the screen
            const isLeft = Math.random() > 0.5;
            const x = isLeft ? Math.random() * 20 : 60 + Math.random() * 20; // 0-20vw or 60-80vw
            const y = Math.random() * 60 + 10; // 10-70vh
            const rotation = Math.random() * 40 - 20; // -20 to 20 deg
            
            polaroid.style.left = `${x}vw`;
            polaroid.style.top = `${y}vh`;
            
            // Image setup
            const img = document.createElement('img');
            img.src = src;
            
            // If image fails to load (user didn't add it yet), hide it or show placeholder
            img.onerror = () => { polaroid.style.display = 'none'; };
            
            // Polaroid sizing
            polaroid.style.width = `${Math.random() * 100 + 150}px`; // 150-250px
            polaroid.style.height = `${parseFloat(polaroid.style.width) * 1.2}px`;
            
            polaroid.appendChild(img);
            container.appendChild(polaroid);
            
            // Trigger animation
            setTimeout(() => {
                polaroid.classList.add('show');
                polaroid.style.transform = `scale(1) rotate(${rotation}deg)`;
            }, 50);
            
        }, index * 800); // Stagger appearance
    });
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

// Premium Confetti
function acceptProposal() {
    switchScreen('proposalScreen', 'successScreen');
    
    var duration = 4000;
    var end = Date.now() + duration;
    var colors = ['#e5a872', '#ffffff', '#ffd700'];

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
            particleCount: 100,
            spread: 160,
            origin: { y: 0.6 },
            colors: colors,
            zIndex: 10000
        });
    }, 800);
}
