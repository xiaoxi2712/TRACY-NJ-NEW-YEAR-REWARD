const prizes = [
  { amount:"₦1000", weight:40 }, { amount:"₦500", weight:30 }, { amount:"₦1200", weight:17 },
  { amount:"₦1500", weight:8 }, { amount:"₦2000", weight:3 }, { amount:"₦2500", weight:2 }
];
const wheel = [];
prizes.forEach(p => { for(let i=0;i<p.weight;i++) wheel.push(p.amount); });

const gifts = Array.from(document.querySelectorAll('.gift'));
const popup = document.getElementById('popup');
const popupBox = document.getElementById('popup-box');
const popupText = document.getElementById('popup-text');
const openSound = document.getElementById('openSound');
const replayBtn = document.getElementById('replay');
const fxCanvas = document.getElementById('fxCanvas');
let openedIndex = null;

function pickPrize() { return wheel[Math.floor(Math.random()*wheel.length)]; }

gifts.forEach(g=>{
  g.addEventListener('click', function(){
    if(openedIndex!==null) return;
    openedIndex = Number(g.dataset.index);
    g.classList.add('opened');
    try{ openSound.currentTime=0; openSound.play(); }catch(e){}
    g.classList.add('opening');
    setTimeout(()=>g.classList.remove('opening'),220);

    const prize = pickPrize();
    const img = g.querySelector('img').getAttribute('src');
    popupBox.src = img;
    popupText.textContent = `Congratulations! You won ${prize}`;
    popup.setAttribute('aria-hidden','false');
    replayBtn.classList.remove('hidden');
    launchConfetti(180);
  });
});

replayBtn.addEventListener('click', ()=>{
  openedIndex=null;
  gifts.forEach(g=>g.classList.remove('opened','opening'));
  popup.setAttribute('aria-hidden','true');
  clearCanvas();
});

const ctx = fxCanvas.getContext ? fxCanvas.getContext('2d') : null;
let particles=[], fxRunning=false;
function resizeCanvas(){ fxCanvas.width=fxCanvas.clientWidth; fxCanvas.height=fxCanvas.clientHeight; }
window.addEventListener('resize',resizeCanvas); resizeCanvas();

function launchConfetti(duration = 2000) {
  if (!ctx) return;

  const startTime = performance.now();

  function spawnOnce() {
    const W = fxCanvas.width, H = fxCanvas.height;
    for (let i = 0; i < 90; i++) { 
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: W * 0.5,
        y: H * 0.35 + (Math.random() * H * 0.1 - H * 0.05),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2 + 2),
        size: Math.random() * 5 + 2,
        life: Math.random() * 70 + 40,
        color: randomColor()
      });
    }
  }

  // lần đầu bắn pháo
  spawnOnce();

  // bắt đầu animation nếu chưa chạy
  if (!fxRunning) animateFX();

  // interval bắn liên tục trong 2 giây
  const interval = setInterval(() => {
    if (performance.now() - startTime >= duration) {
      clearInterval(interval);
    } else {
      spawnOnce();
    }
  }, 200);  // mỗi 0.2s bắn thêm pháo hoa
}


function randomColor(){ const palette=['#ff3b30','#ff9500','#ffcc00','#4cd964','#5ac8fa','#0579ff','#c644fc','#ff2d55']; return palette[Math.floor(Math.random()*palette.length)]; }

function animateFX(){
  fxRunning = true;

  function step(){
    const W = fxCanvas.width, H = fxCanvas.height;

    // XÓA NỀN CANVAS → không làm mờ background
    ctx.clearRect(0,0,W,H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.vy += 0.06;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;

      // vẽ pháo
      ctx.beginPath();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0 || p.y > H + 30 || p.x < -50 || p.x > W + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(step);
    } else {
      fxRunning = false;
      clearCanvas();
    }
  }

  requestAnimationFrame(step);
}

function clearCanvas(){ if(!ctx) return; ctx.clearRect(0,0,fxCanvas.width,fxCanvas.height); }
// Snow effect
const snowCanvas = document.getElementById('snowCanvas');
const snowCtx = snowCanvas.getContext('2d');

function resizeSnowCanvas() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeSnowCanvas);
resizeSnowCanvas();

// tạo mảng bông tuyết
const snowflakes = [];
const snowCount = 100;

for(let i=0; i<snowCount; i++){
    snowflakes.push({
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        radius: 2 + Math.random() * 3,
        speed: 1 + Math.random()*2,
        angle: Math.random()*Math.PI*2
    });
}

function resizeSnowCanvas() {
    const dpr = window.devicePixelRatio || 1;
    snowCanvas.width = window.innerWidth * dpr;
    snowCanvas.height = window.innerHeight * dpr;
    snowCtx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeSnowCanvas);
resizeSnowCanvas();

   function drawSnow(){
    snowCtx.clearRect(0,0,window.innerWidth, window.innerHeight);

    for(let flake of snowflakes){
        flake.y += flake.speed;
        flake.x += Math.sin(flake.angle) * 0.5; // lắc qua lại
        flake.angle += 0.01;

        if(flake.y > window.innerHeight) flake.y = -flake.radius;
        if(flake.x > window.innerWidth) flake.x = 0;
        if(flake.x < 0) flake.x = window.innerWidth;

        snowCtx.beginPath();
        snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI*2);
        snowCtx.fillStyle = 'white';
        snowCtx.fill();
    }

    requestAnimationFrame(drawSnow);
}

// gọi hàm lần đầu
drawSnow();
