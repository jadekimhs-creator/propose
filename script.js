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
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime); // Volume lowered
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
}

document.addEventListener('DOMContentLoaded', () => {

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
});

// Typewriter effect for Intro
const t1 = "To. 나의 우주인 너에게";
const t2 = "수많은 기적들이 모여 완성된 우리의 시간.\n가장 빛나는 오늘, 너를 위해 준비했어.";

function startCinematicIntro() {
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
}

function beginProposal() {
    switchScreen('startScreen', 'introScreen', 1000);
    
    const bgm = document.getElementById('bgMusic');
    if(bgm) {
        bgm.volume = 0.15;
        bgm.play().catch(e => console.log("BGM play failed", e));
    }
    
    // Play a silent sound to initialize audio context immediately
    playTypeSound();
    
    // Start intro text after transition
    setTimeout(startCinematicIntro, 1500);
}

let isBlowing = false;

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
                if (char !== ' ') playTypeSound();
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

// User memory photos and their corresponding cinematic texts
const memories = [
    { src: 'assets/photo1.jpg', text: '바라던 사람을 만나,\n나의 세상은 온통 따뜻한 빛이 되었어.' },
    { src: 'assets/gom.jpg', text: '2022년 너의 생일, 함께했던 천사 곰이도 있지?\n지금쯤 하늘의 가장 밝은 별이 된 곰이가 누구보다 크게 축하해주고 있을 거야.' },
    { src: 'assets/photo2.jpg', text: '곰이가 보내준 따뜻한 사랑까지 듬뿍 받아,\n이제는 완전한 가족이 되어 맞이하는 특별한 생일.' },
    { src: 'assets/ggyul.jpg', text: '뀰이를 만난 지 15주 2일차,\n우리 셋이서 함께할 찬란한 나날들이 너무도 기대돼.' },
    { src: 'assets/photo3.jpg', text: '마음의 응원을 가득 곰이, 뱃속 뀰이, 그리고 우리 두 사람.\n내가 가장 든든한 남편이자 아빠가 되어 평생 지켜줄게.' }
];

async function startApp() {
    // Left intentionally blank if used later, beginProposal handles BGM now.
}

function runCinematicSequence() {
    switchScreen('introScreen', 'prologueScreen', 1000);
    
    setTimeout(() => {
        const elements = document.querySelectorAll('#prologueScreen .typewriter-element');
        typeSequence(elements, 150, 1000, () => {
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
        
        typeSequence(elements, 130, 700, () => {
            cakeVisual.style.opacity = '1';
        });
    }, 1000);
}

function blowOutCandle() {
    if (isBlowing) return;
    isBlowing = true;
    
    const flame = document.getElementById('flame');
    flame.classList.add('blown-out');
    
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
            createFlowers();
            scatterMemoriesBackground();
            startProposalScene();
            return;
        }
        
        const mem = memories[currentStep];
        const stepDiv = document.createElement('div');
        stepDiv.className = 'memory-step';
        
        const img = document.createElement('img');
        img.src = mem.src;
        img.onerror = () => { img.style.display = 'none'; };
        
        const p = document.createElement('p');
        p.className = 'typewriter-element';
        p.setAttribute('data-text', mem.text);
        
        stepDiv.appendChild(img);
        stepDiv.appendChild(p);
        container.appendChild(stepDiv);
        
        setTimeout(() => {
            stepDiv.classList.add('show');
            setTimeout(() => {
                // Type moderately for memories so photos stay longer
                typeText(p, 100, () => {
                    setTimeout(() => {
                        stepDiv.classList.remove('show');
                        setTimeout(() => {
                            stepDiv.remove();
                            currentStep++;
                            showNextMemory();
                        }, 1000); 
                    }, 2500); 
                });
            }, 500);
        }, 100);
    }
    showNextMemory();
}

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

function scatterMemoriesBackground() {
    const container = document.getElementById('scatteredMemories');
    
    memories.forEach((mem, index) => {
        setTimeout(() => {
            const polaroid = document.createElement('div');
            polaroid.classList.add('scattered-photo');
            
            const isLeft = Math.random() > 0.5;
            const x = isLeft ? Math.random() * 20 : 60 + Math.random() * 20; 
            const y = Math.random() * 60 + 10; 
            const rotation = Math.random() * 40 - 20; 
            
            polaroid.style.left = `${x}vw`;
            polaroid.style.top = `${y}vh`;
            
            const img = document.createElement('img');
            img.src = mem.src;
            img.onerror = () => { polaroid.style.display = 'none'; };
            
            polaroid.style.width = `${Math.random() * 80 + 120}px`; 
            polaroid.style.height = `${parseFloat(polaroid.style.width) * 1.2}px`;
            
            polaroid.appendChild(img);
            container.appendChild(polaroid);
            
            setTimeout(() => {
                polaroid.classList.add('show');
                polaroid.style.transform = `scale(1) rotate(${rotation}deg)`;
            }, 50);
            
        }, index * 400); 
    });
}

function startProposalScene() {
    setTimeout(() => {
        const elements = document.querySelectorAll('#proposalScreen .typewriter-element');
        const btns = document.getElementById('proposalBtns');
        
        typeSequence(elements, 150, 800, () => {
            btns.style.opacity = '1';
            btns.style.transform = 'translateY(0)';
        });
    }, 1500);
}

const noBtn = document.getElementById('noBtn');
function moveNoBtn() {
    noBtn.style.position = 'fixed';
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 40) + 20;
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 40) + 20;
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}
noBtn.addEventListener('mouseover', moveNoBtn);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoBtn(); });

function acceptProposal() {
    // 1. Cinematic White Flash
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0'; flash.style.left = '0'; 
    flash.style.width = '100vw'; flash.style.height = '100vh';
    flash.style.background = '#fff';
    flash.style.zIndex = '9999';
    flash.style.opacity = '1';
    flash.style.transition = 'opacity 2.5s ease-out';
    document.body.appendChild(flash);
    
    setTimeout(() => { flash.style.opacity = '0'; }, 100);
    setTimeout(() => { flash.remove(); }, 3000);

    // 2. Emotional Music Swell
    const bgm = document.getElementById('bgMusic');
    if (bgm) {
        let vol = bgm.volume;
        const swellInterval = setInterval(() => {
            if (vol < 0.35) {
                vol += 0.02;
                bgm.volume = Math.min(vol, 0.35);
            } else {
                clearInterval(swellInterval);
            }
        }, 300);
    }

    // 3. Switch Screen
    switchScreen('proposalScreen', 'successScreen', 500);
    
    // Create Starfield Effect
    const starfield = document.getElementById('starfield');
    if (starfield) {
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.classList.add('star');
                
                const size = Math.random() * 3 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                
                star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
                star.style.setProperty('--delay', `${Math.random() * 2}s`);
                star.style.setProperty('--max-opacity', `${Math.random() * 0.7 + 0.3}`);
                
                starfield.appendChild(star);
            }, i * 20);
        }
    }
    
    setTimeout(() => {
        const line = document.getElementById('successLine');
        line.style.opacity = '0.8';
        line.style.height = '60px';
        
        setTimeout(() => {
            const elements = document.querySelectorAll('#successScreen .typewriter-element');
            typeSequence(elements, 160, 900, () => {
                // 4. Dramatic Confetti after typing finishes!
                if (window.confetti) {
                    const duration = 15 * 1000;
                    const animationEnd = Date.now() + duration;
                    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
                    
                    const interval = setInterval(function() {
                        const timeLeft = animationEnd - Date.now();
                        if (timeLeft <= 0) return clearInterval(interval);
                        
                        const particleCount = 20 * (timeLeft / duration);
                        confetti(Object.assign({}, defaults, { 
                            particleCount,
                            origin: { x: Math.random(), y: Math.random() - 0.2 },
                            colors: ['#ffffff', '#e5a872', '#ffd700']
                        }));
                    }, 250);
                }
            });
        }, 1500);
    }, 1000);
}
