const canvas = document.getElementById('snowCanvas'), ctx = canvas.getContext('2d');
let frontM = [], backM = [], centerM = [], snow = [], times = [], flakes = [], bSnow = [], bTimes = [], bFlakes = [], auroraTime = 0;
let glider = { x: window.innerWidth / 2, y: window.innerHeight * 1.5, tX: window.innerWidth / 2, tY: window.innerHeight * 1.5, vx: 1.2, vy: 0.1, angle: 0, tAngle: 0, time: 0, phase: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight * 3);
    const cX = canvas.width / 2, baseW = canvas.width * 0.33, hF = canvas.height - 180, hB = canvas.height - 320;
    frontM = []; backM = []; centerM = []; 
    snow = new Array(canvas.width + 1).fill(0); times = new Array(canvas.width + 1).fill(null).map(() => []);
    bSnow = new Array(canvas.width + 1).fill(0); bTimes = new Array(canvas.width + 1).fill(null).map(() => []);

    for (let x = 0; x < canvas.width; x++) {
        backM.push(hB - (320 - Math.abs(Math.sin(x * 0.0015) * 340) + (60 - Math.abs(Math.cos(x * 0.004) * 80)) + Math.sin(x * 0.03) * 6));
        let dist = Math.abs(x - cX), cH = 0;
        if (dist < baseW / 2) {
            let sharp = Math.pow(Math.cos((dist / (baseW / 2)) * (Math.PI / 2)), 2.2);
            cH = window.innerHeight * 1.25 * sharp - Math.abs(Math.sin(x * 0.045) * 85) * sharp + (Math.cos(x * 0.07) * 25) * sharp - Math.abs(Math.sin(x * 0.22) * Math.cos(x * 0.08) * 22) * sharp + (Math.sin(x * 0.009) * 45) * sharp;
        }
        centerM.push(canvas.height - Math.max(0, cH));
        frontM.push(hF - (220 - Math.abs(Math.sin(x * 0.004) * 240) + (60 - Math.abs(Math.cos(x * 0.009) * 70)) + Math.sin(x * 0.06) * 8));
    }
}

function makeFlake(init = false, isBack = false) {
    return { x: Math.random() * canvas.width, y: init ? Math.random() * canvas.height : -10, size: isBack ? Math.random() * 1.3 + 0.6 : Math.random() * 2.2 + 1.2, speed: isBack ? Math.random() * 0.8 + 0.4 : Math.random() * 1.4 + 0.8, opacity: isBack ? Math.random() * 0.3 + 0.2 : Math.random() * 0.5 + 0.4, swing: Math.random() * 0.02 + 0.01, amp: isBack ? Math.random() * 1.0 + 0.3 : Math.random() * 1.6 + 0.5 };
}

function drawGlider(x, y, scale, tilt) {
    glider.phase += 0.05; const bS = Math.sin(glider.phase) * 1.2, lS = Math.cos(glider.phase * 0.8) * 0.04;
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(scale, scale);
    ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.fillStyle = '#060d1a'; ctx.strokeStyle = '#02050a'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(-58, 12); ctx.lineTo(-18, 7); ctx.lineTo(0, 2); ctx.lineTo(18, 7); ctx.lineTo(58, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(-18, 7); ctx.moveTo(0, -28); ctx.lineTo(18, 7); ctx.moveTo(0, -28); ctx.lineTo(0, 2); ctx.moveTo(-29, -8); ctx.lineTo(-18, 7); ctx.moveTo(29, -8); ctx.lineTo(18, 7); ctx.stroke();
    ctx.strokeStyle = '#1c2e44'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, 14); ctx.lineTo(14, 14); ctx.lineTo(0, -6); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#03070f'; ctx.strokeStyle = '#03070f'; ctx.lineJoin = 'round';
    ctx.save(); ctx.translate(bS, 14); ctx.rotate(lS); ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-1, 29); ctx.lineTo(2, 29); ctx.lineTo(4, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, 27); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#03070f'; ctx.beginPath(); ctx.ellipse(bS, 11, 5, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#03070f'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bS - 4, 9); ctx.lineTo(bS - 10, 11); ctx.lineTo(-14, 14); ctx.moveTo(bS + 4, 9); ctx.lineTo(bS + 10, 11); ctx.lineTo(14, 14); ctx.stroke();
    ctx.fillStyle = '#1e324a'; ctx.beginPath(); ctx.arc(bS, 4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#020408'; ctx.beginPath(); ctx.arc(bS, 3.5, 2.5, Math.PI * 0.9, Math.PI * 2.1); ctx.fill(); ctx.restore();
}

function drawMountainSnow(mapY, maxH, mulFreq, opacity) {
    for (let x = 0; x < canvas.width; x++) {
        if (mapY[x] >= canvas.height) continue;
        let depth = Math.max(5, maxH + (Math.sin(x * mulFreq) * Math.cos(x * (mulFreq * 0.4)) * (maxH * 0.2) + Math.sin(x * 0.03) * (maxH * 0.05)) + (Math.sin(x * 0.005) * (maxH * 0.5)));
        if (Math.sin(x * (mulFreq * 3)) * Math.cos(x * (mulFreq * 1.5)) > -0.45) {
            let startY = mapY[x], endY = Math.min(canvas.height, mapY[x] + depth), g = ctx.createLinearGradient(x, startY, x, endY);
            g.addColorStop(0, `rgba(235,245,255,${opacity})`); g.addColorStop(0.4, `rgba(165,205,240,${opacity * 0.6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath(); ctx.moveTo(x, startY); ctx.lineTo(x, endY); ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
        }
    }
}

function simulateSnowPlan(arrayFlakes, arrayM, arraySnow, arrayTimes, currentNow, limitH, isBackPlan) {
    for (let i = 0; i < arrayFlakes.length; i++) {
        let f = arrayFlakes[i]; f.y += f.speed; f.x += Math.sin(f.swing + i) * f.amp;
        if (f.x < 0) f.x = canvas.width; if (f.x > canvas.width) f.x = 0;
        let xi = Math.floor(f.x);
        if (xi >= 0 && xi < arrayM.length && f.y >= arrayM[xi] - arraySnow[xi]) {
            arraySnow[xi] = Math.min(arraySnow[xi] + 0.4, limitH); arrayTimes[xi].push(currentNow);
            if (xi > 0) arraySnow[xi - 1] = Math.min(arraySnow[xi - 1] + 0.2, limitH);
            if (xi < arraySnow.length - 1) arraySnow[xi + 1] = Math.min(arraySnow[xi + 1] + 0.2, limitH);
            arrayFlakes[i] = makeFlake(false, isBackPlan); continue;
        }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${f.opacity})`; ctx.fill();
    }
}

function drawScene() {
    auroraTime += 0.002; const cX = canvas.width / 2, now = Date.now();
    const updateSnow = (s, t) => { for (let x = 0; x < s.length; x++) { t[x] = t[x].filter(v => { if (now - v >= 60000) { s[x] = Math.max(0, s[x] - 0.3); return false; } return true; }); if (x > 0 && x < s.length - 1) s[x] = s[x] * 0.94 + (s[x - 1] + s[x + 1]) * 0.03; } };
    updateSnow(snow, times); updateSnow(bSnow, bTimes);
    
    let sky = ctx.createLinearGradient(0, 0, 0, window.innerHeight * 1.5); sky.addColorStop(0, '#040b16'); sky.addColorStop(0.25, '#07162c'); sky.addColorStop(0.5, '#0b2343'); ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); ctx.moveTo(0, canvas.height); for (let x = 0; x < canvas.width; x++) ctx.lineTo(x, backM[x] - bSnow[x]);
    ctx.lineTo(canvas.width, canvas.height); ctx.closePath();
    let bgG = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); bgG.addColorStop(0, '#02060d'); bgG.addColorStop(1, '#050a12'); ctx.fillStyle = bgG; ctx.fill();
    simulateSnowPlan(bFlakes, backM, bSnow, bTimes, now, 30, true);
    
    let peakY = centerM[Math.floor(cX)] || canvas.height;
    ['left', 'right'].forEach(side => {
        ctx.beginPath(); ctx.moveTo(cX, peakY);
        if (side === 'left') { for (let x = Math.floor(cX); x >= 0; x--) ctx.lineTo(x, centerM[x]); ctx.lineTo(0, canvas.height); }
        else { for (let x = Math.floor(cX); x < canvas.width; x++) ctx.lineTo(x, centerM[x]); ctx.lineTo(canvas.width, canvas.height); }
        ctx.lineTo(cX, canvas.height); ctx.closePath();
        let g = ctx.createLinearGradient(canvas.width / 2, peakY, canvas.width / 2, canvas.height); g.addColorStop(0, '#598cb3'); g.addColorStop(0.2, '#1b3859'); g.addColorStop(0.6, '#091526'); g.addColorStop(1, '#01040a'); ctx.fillStyle = g; ctx.fill();
    });
    if (peakY < canvas.height) drawMountainSnow(centerM, 80, 0.08, 0.85);

    ctx.save(); ctx.beginPath(); ctx.moveTo(0, canvas.height); for (let x = 0; x < canvas.width; x++) ctx.lineTo(x, frontM[x] - snow[x]);
    ctx.lineTo(canvas.width, canvas.height); ctx.closePath();
    let frG = ctx.createLinearGradient(0, 0, canvas.width, 0); frG.addColorStop(0, '#040810'); frG.addColorStop(1, '#091320'); ctx.fillStyle = frG; ctx.fill();
    ctx.beginPath(); for (let x = 0; x < canvas.width; x++) { if (x === 0) ctx.moveTo(x, frontM[x] - snow[x]); else ctx.lineTo(x, frontM[x] - snow[x]); }
    ctx.strokeStyle = 'rgba(220, 240, 255, 0.6)'; ctx.lineWidth = 2.2; ctx.stroke(); ctx.restore();
    simulateSnowPlan(flakes, frontM, snow, times, now, 35, false);

    glider.time += 0.003; glider.tX = (canvas.width / 2) + Math.sin(glider.time * 2.2) * (canvas.width * 0.35); glider.tY = (window.innerHeight * 1.5) + Math.cos(glider.time * 1.7) * (window.innerHeight * 0.25);
    glider.vx = (glider.vx + (glider.tX - glider.x) * 0.0006) * 0.985; glider.vy = (glider.vy + (glider.tY - glider.y) * 0.0005) * 0.985;
    glider.x += glider.vx; glider.y += glider.vy; glider.angle += (glider.vx * 0.06 - glider.angle) * 0.1;
    drawGlider(glider.x, glider.y, 1.8, glider.angle);
    requestAnimationFrame(drawScene);
}

window.addEventListener('scroll', () => {
    const s = document.getElementById('heroSlogan');
    if (s) { let p = Math.min(window.scrollY / window.innerHeight, 1); s.style.opacity = (1 - p * 1.5).toString(); s.style.transform = `translate(-50%, -${50 + p * 20}%)`; }
});

window.addEventListener('resize', resizeCanvas); window.addEventListener('load', resizeCanvas);
resizeCanvas(); for(let i = 0; i < 90; i++) flakes.push(makeFlake(true, false)); for(let i = 0; i < 60; i++) bFlakes.push(makeFlake(true, true)); drawScene();
