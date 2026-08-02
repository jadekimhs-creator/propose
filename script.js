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

    // Typewriter effect
    const t1 = "To. 나의 우주인 너에게";
    const t2 = "수많은 기적들이 모여 완성된 우리의 시간.<br>가장 빛나는 오늘, 너를 위해 준비했어.";
    
    let i = 0;
    const speed = 100;
    const el1 = document.getElementById('typewriter1');
    const el2 = document.getElementById('typewriter2');
    const startBtn = document.getElementById('startBtn');
    
    if (el1 && el2) {
        el1.classList.add('typing-cursor');
        
        function typeWriter1() {
            if (i < t1.length) {
                el1.innerHTML += t1.charAt(i);
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
                if (t2.slice(j, j + 4) === '<br>') {
                    el2.innerHTML += '<br>';
                    j += 4;
                } else {
                    el2.innerHTML += t2.charAt(j);
                    j++;
                }
                setTimeout(typeWriter2, speed - 40);
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

function switchScreen(fromId, toId, delay = 1500) {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    if(fromEl) fromEl.classList.remove('active');
    setTimeout(() => {
        if(toEl) toEl.classList.add('active');
    }, delay);
}

// User memory photos and their corresponding cinematic texts
const memories = [
    { src: 'assets/photo1.jpg', text: '너라는 사람을 만나,<br>나의 세상은 온통 따뜻한 빛이 되었어.' },
    { src: 'assets/gom.jpg', text: '2022년 너의 생일, 함께했던 천사 곰이와 은비.<br>지금쯤 하늘의 가장 밝은 별이 된 곰이도 누구보다 크게 축하해주고 있을 거야.' },
    { src: 'assets/photo2.jpg', text: '곰이가 보내준 따뜻한 사랑까지 듬뿍 받아,<br>이제는 완전한 가족이 되어 맞이하는 특별한 생일.' },
    { src: 'assets/ggyul.jpg', text: '뀰이와 만난 지 15주 2일차,<br>우리 뀰이와 함께할 찬란한 앞날들이 너무나 기대돼.' },
    { src: 'assets/photo3.jpg', text: '마음속 영원한 가족 곰이, 은비, 뀰이, 그리고 우리 두 사람.<br>내가 가장 든든한 남편이자 아빠가 되어 평생 지켜줄게.' }
];

async function startApp() {
    const bgm = document.getElementById('bgMusic');
    if(bgm) {
        bgm.volume = 0.25;
        bgm.play().catch(e => console.log("BGM play failed", e));
    }
    // 스탠바이미 환경을 위해 마이크 권한 요청 제거, 바로 시네마틱 모드 시작
    runCinematicSequence();
}

function runCinematicSequence() {
    switchScreen('introScreen', 'prologueScreen', 1000);
    
    setTimeout(() => {
        const text1 = document.getElementById('prologueText1');
        text1.classList.add('show');
        
        setTimeout(() => {
            text1.classList.remove('show');
            setTimeout(() => {
                const text2 = document.getElementById('prologueText2');
                text2.classList.add('show');
                
                setTimeout(() => {
                    text2.classList.remove('show');
                    
                    setTimeout(() => {
                        switchScreen('prologueScreen', 'cakeScreen', 500);
                    }, 2000);
                    
                }, 3500); // 프롤로그 시간 단축
            }, 1000); // 텍스트 간격 단축
        }, 3500);
    }, 1500);
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
            return;
        }
        
        const mem = memories[currentStep];
        const stepDiv = document.createElement('div');
        stepDiv.className = 'memory-step';
        
        const img = document.createElement('img');
        img.src = mem.src;
        img.onerror = () => { img.style.display = 'none'; };
        
        const p = document.createElement('p');
        p.innerHTML = mem.text;
        
        stepDiv.appendChild(img);
        stepDiv.appendChild(p);
        container.appendChild(stepDiv);
        
        // 이미지 뜨는 속도 대폭 단축 (6초 -> 3.5초 유지)
        setTimeout(() => {
            stepDiv.classList.add('show');
            setTimeout(() => {
                stepDiv.classList.remove('show');
                setTimeout(() => {
                    stepDiv.remove();
                    currentStep++;
                    showNextMemory();
                }, 1000); // 넘어가는 간격 2초 -> 1초
            }, 3500); // 화면에 머무는 시간 6초 -> 3.5초
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
                
                // Set CSS variables for animation
                star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
                star.style.setProperty('--delay', `${Math.random() * 2}s`);
                star.style.setProperty('--max-opacity', `${Math.random() * 0.7 + 0.3}`);
                
                starfield.appendChild(star);
            }, i * 20); // gradually add stars
        }
    }
}
