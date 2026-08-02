document.addEventListener('DOMContentLoaded', () => {
    // Web Audio API for typing sound
    let audioCtx;
    function playTypeSound() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const bufferSize = audioCtx.sampleRate * 0.03; // 30ms of noise
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        // Randomize frequency slightly for realistic mechanical sound
        filter.frequency.value = 4000 + Math.random() * 1000; 
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime); // Volume
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noise.start();
    }

    // Generate intro particles
    const introParticles = document.getElementById('introParticles');
    if (introParticles) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.classList.add('intro-particle');
            const size = Math.random() * 8 + 4;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}vw`;
            p.style.top = `${Math.random() * 100}vh`;
            p.style.setProperty('--duration', `${Math.random() * 5 + 5}s`);
            p.style.setProperty('--delay', `${Math.random() * 5}s`);
            p.style.setProperty('--max-opacity', `${Math.random() * 0.6 + 0.2}`);
            introParticles.appendChild(p);
        }
    }

    // Typewriter effect for Intro
    const t1 = "To. 나의 우주인 너에게";
    const t2 = "수많은 기적들이 모여 완성된 우리의 시간.\n가장 빛나는 오늘, 너를 위해 준비했어.";
    
    let i = 0;
    const speed = 160; 
    const el1 = document.getElementById('typewriter1');
    const el2 = document.getElementById('typewriter2');
    const startBtn = document.getElementById('startBtn');
    
    if (el1 && el2) {
        el1.classList.add('typing-cursor');
        
        function typeWriter1() {
            if (i < t1.length) {
                el1.innerHTML += t1.charAt(i);
                if (t1.charAt(i) !== ' ') playTypeSound();
                i++;
                setTimeout(typeWriter1, speed);
            } else {
                el1.classList.remove('typing-cursor');
                el2.classList.add('typing-cursor');
                setTimeout(typeWriter2, 500);
            }
        }
        
        let j = 0;
        function typeWriter2() {
            if (j < t2.length) {
                const char = t2.charAt(j);
                if (char === '\n') {
                    el2.innerHTML += '<br>';
                } else {
                    el2.innerHTML += char;
                    if (char !== ' ') playTypeSound();
                }
                j++;
                setTimeout(typeWriter2, speed - 30);
            } else {
                el2.classList.remove('typing-cursor');
                setTimeout(() => {
                    startBtn.style.opacity = '1';
                    startBtn.style.transform = 'translateY(0)';
                }, 500);
            }
        }
        
        setTimeout(typeWriter1, 1000);
    }
});

let isBlowing = false;
const FINAL_SILENT_BEAT_MS = 2000;

function switchScreen(fromId, toId, delay = 1500) {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    
    if(fromEl) fromEl.classList.remove('active');
    setTimeout(() => {
        if(toEl) toEl.classList.add('active');
    }, delay);
}

// Global Typewriter Engine
function typeText(element, speed, onComplete) {
    const text = element.getAttribute('data-text');
    if (!text) {
        if (onComplete) onComplete();
        return;
    }
    
    element.innerHTML = '';
    element.classList.add('typing-cursor');
    let j = 0;
    
    function type() {
        if (j < text.length) {
            const char = text.charAt(j);
            // Handle both literal '\n' characters from HTML attributes and actual newlines
            if (char === '\\' && text.charAt(j+1) === 'n') {
                element.innerHTML += '<br>';
                j += 2;
            } else if (char === '\n') {
                element.innerHTML += '<br>';
                j++;
            } else {
                element.innerHTML += char;
                j++;
            }
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
            if (onComplete) onComplete();
        }
    }
    type();
}

function typeSequence(elements, speed, delayBetween, onComplete) {
    let index = 0;
    function next() {
        if (index < elements.length) {
            typeText(elements[index], speed, () => {
                index++;
                setTimeout(next, delayBetween);
            });
        } else {
            if (onComplete) onComplete();
        }
    }
    next();
}

function revealSequence(elements, visibleMs, delayBetween, onComplete) {
    let index = 0;
    function next() {
        if (index >= elements.length) {
            if (onComplete) onComplete();
            return;
        }
        const element = elements[index];
        element.innerHTML = element.getAttribute('data-text').replace(/\\n|\n/g, '<br>');
        element.classList.add('reveal-copy');
        setTimeout(() => {
            index++;
            setTimeout(next, delayBetween);
        }, visibleMs);
    }
    next();
}

// User memory photos and their corresponding cinematic texts
const memories = [
    { src: 'assets/photo1.jpg', text: '바라던 사람을 만나,\n나의 세상은 온통 따뜻한 빛이 되었어.', variant: 'slow-zoom' },
    { src: 'assets/gom.jpg', text: '2022년 너의 생일, 함께했던 천사 곰이도 있지?\n지금쯤 하늘의 가장 밝은 별이 된 곰이가 누구보다 크게 축하해주고 있을 거야.', variant: 'print' },
    { src: 'assets/photo2.jpg', text: '곰이가 보내준 따뜻한 사랑까지 듬뿍 받아,\n이제는 완전한 가족이 되어 맞이하는 특별한 생일.', variant: 'pan' },
    { src: 'assets/ggyul.jpg', text: '뀰이를 만난 지 15주 2일차,\n우리 셋이서 함께할 찬란한 나날들이 너무도 기대돼.', variant: 'glow' },
    { src: 'assets/photo3.jpg', text: '마음의 응원을 가득 곰이, 뱃속 뀰이, 그리고 우리 두 사람.\n내가 가장 든든한 남편이자 아빠가 되어 평생 지켜줄게.', variant: 'finale' }
];

async function startApp() {
    const bgm = document.getElementById('bgMusic');
    if(bgm) {
        bgm.volume = 0.15;
        bgm.play().catch(e => console.log("BGM play failed", e));
    }
    runCinematicSequence();
}

function runCinematicSequence() {
    switchScreen('introScreen', 'prologueScreen', 1000);
    
    setTimeout(() => {
        const elements = document.querySelectorAll('#prologueScreen .typewriter-element');
        revealSequence(elements, 2200, 700, () => {
            setTimeout(() => {
                switchScreen('prologueScreen', 'cakeScreen', 1000);
                startCakeScene();
            }, 2500);
        });
    }, 1500);
}

function startCakeScene() {
    setTimeout(() => {
        const elements = document.querySelectorAll('#cakeScreen .typewriter-element');
        const cakeVisual = document.getElementById('cakeVisual');
        
        revealSequence(Array.from(elements).slice(0, 2), 1700, 350, () => {
            typeText(elements[2], 75, () => {
                elements[3].innerHTML = elements[3].getAttribute('data-text');
                elements[3].classList.add('reveal-copy');
                cakeVisual.style.opacity = '1';
            });
        });
    }, 1000);
}

function blowOutCandle() {
    if (isBlowing) return;
    isBlowing = true;
    
    const flame = document.getElementById('flame');
    const bgm = document.getElementById('bgMusic');
    flame.classList.add('blown-out');
    if (bgm) bgm.volume = 0.07;
    
    setTimeout(() => {
        switchScreen('cakeScreen', 'darkScreen', 1000);
        
        setTimeout(() => {
            switchScreen('darkScreen', 'memoryScreen', 500);
            setTimeout(playMemorySequence, 1500);
        }, 2000);
        
    }, 1000);
}

document.getElementById('candleWrapper').addEventListener('click', () => {
    blowOutCandle();
});

function playMemorySequence() {
    const container = document.getElementById('memoryContainer');
    let currentStep = 0;
    
    function showNextMemory() {
        if (currentStep >= memories.length) {
            switchScreen('memoryScreen', 'proposalScreen', 1500);
            startProposalScene();
            return;
        }
        
        const mem = memories[currentStep];
        const stepDiv = document.createElement('div');
        stepDiv.className = `memory-step memory-step--${mem.variant}`;
        
        const img = document.createElement('img');
        img.src = mem.src;
        img.onerror = () => { img.style.display = 'none'; };
        
        const p = document.createElement('p');
        p.textContent = mem.text;
        
        stepDiv.appendChild(img);
        stepDiv.appendChild(p);
        container.appendChild(stepDiv);
        
        setTimeout(() => {
            stepDiv.classList.add('show');
            setTimeout(() => p.classList.add('show-caption'), 700);
            setTimeout(() => {
                stepDiv.classList.remove('show');
                setTimeout(() => {
                    stepDiv.remove();
                    currentStep++;
                    showNextMemory();
                }, 700);
            }, 4300);
        }, 100);
    }
    showNextMemory();
}

function startProposalScene() {
    setTimeout(() => {
        const promises = document.querySelectorAll('#proposalScreen .typewriter-element');
        const question = document.getElementById('finalProposalQuestion');
        const cue = document.getElementById('lookUpCue');
        const bgm = document.getElementById('bgMusic');
        revealSequence(promises, 1800, 400, () => {
            if (bgm) bgm.volume = 0.05;
            question.setAttribute('data-text', '나와 결혼해 줄래? 💍');
            typeText(question, 130, () => {
                setTimeout(() => {
                    cue.textContent = '고개를 들어 나를 바라봐줄래? 💐';
                    cue.classList.add('reveal-copy');
                }, FINAL_SILENT_BEAT_MS);
            });
        });
    }, 1500);
}
