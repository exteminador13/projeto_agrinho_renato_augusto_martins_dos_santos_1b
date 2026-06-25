/* =============================================
   AGRINHO — Futuro Sustentável, Agro Forte
   Scripts de interatividade
   ============================================= */

/* ── PARTÍCULAS HERO ── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function Particle() {
  this.x     = Math.random() * W;
  this.y     = Math.random() * H;
  this.r     = Math.random() * 2 + 0.5;
  this.vx    = (Math.random() - 0.5) * 0.3;
  this.vy    = -Math.random() * 0.5 - 0.1;
  this.alpha = Math.random() * 0.5 + 0.1;
  this.color = Math.random() > 0.5 ? '#2D7A3A' : '#C8A94A';
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 80; i++) particles.push(new Particle());
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle   = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -5) {
      particles[i]   = new Particle();
      particles[i].y = H + 5;
    }
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

resize();
initParticles();
drawParticles();
window.addEventListener('resize', () => { resize(); initParticles(); });


/* ── MAPA INTERATIVO ── */
const regioes      = document.querySelectorAll('.map-region');
const regionDetail = document.getElementById('region-detail');

regioes.forEach(r => {
  const activate = () => {
    regioes.forEach(x => x.classList.remove('active'));
    r.classList.add('active');
    regionDetail.innerHTML =
      `<h4>🌿 ${r.dataset.name}</h4><p>${r.dataset.info}</p>`;
  };
  r.addEventListener('click', activate);
  r.addEventListener('keypress', e => {
    if (e.key === 'Enter' || e.key === ' ') activate();
  });
});


/* ── QUIZ ── */
const perguntas = [
  {
    q: "Qual prática agrícola ajuda a preservar a umidade do solo e evitar a erosão?",
    opts: ["Queimada controlada", "Plantio direto", "Monocultura intensiva", "Aração profunda"],
    certa: 1,
    exp: "O plantio direto mantém a palhada sobre o solo, preservando umidade, reduzindo erosão e aumentando matéria orgânica! ✅"
  },
  {
    q: "O que é irrigação por gotejamento?",
    opts: [
      "Regar as plantas à noite com mangueira",
      "Sistema que entrega água diretamente na raiz, economizando até 50%",
      "Inundação controlada das lavouras",
      "Uso de aspersores de alta pressão"
    ],
    certa: 1,
    exp: "O gotejamento é um dos métodos mais eficientes do mundo — leva água direto à raiz com mínimo desperdício! 💧"
  },
  {
    q: "O Cerrado brasileiro é conhecido como:",
    opts: [
      "A Floresta Atlântica do interior",
      "A Savana mais rica em biodiversidade do planeta",
      "O maior deserto do Brasil",
      "A região dos pampas gaúchos"
    ],
    certa: 1,
    exp: "O Cerrado abriga 5% de toda a biodiversidade mundial e é o berço das águas do Brasil! 🌿"
  },
  {
    q: "Qual é o significado de 'agricultura de precisão'?",
    opts: [
      "Plantar somente 1 tipo de cultura",
      "Usar tecnologia para aplicar insumos na quantidade certa, no lugar certo",
      "Fazer a colheita à mão com mais cuidado",
      "Importar tecnologia estrangeira para o campo"
    ],
    certa: 1,
    exp: "Agricultura de precisão usa sensores, GPS e dados para otimizar cada metro quadrado da lavoura! 🛰️"
  },
  {
    q: "O que é o sistema de integração lavoura-pecuária-floresta (ILPF)?",
    opts: [
      "Separar completamente animais e plantas",
      "Integrar cultivo, criação e árvores no mesmo espaço de forma sustentável",
      "Desmatar para criar pasto",
      "Importar animais de outros países"
    ],
    certa: 1,
    exp: "O ILPF é uma das estratégias mais sustentáveis do agro — produz mais usando menos terra e regenera o solo! 🐄🌾🌳"
  }
];

let qAtual = 0, pontos = 0, respondeu = false;

function buildProgress() {
  const bar = document.getElementById('quiz-progress');
  bar.innerHTML = perguntas.map((_, i) => {
    let cls = '';
    if (i < qAtual)      cls = 'done';
    else if (i === qAtual) cls = 'active';
    return `<div class="quiz-dot ${cls}" aria-hidden="true"></div>`;
  }).join('');
}

function carregarQ() {
  respondeu = false;
  const p = perguntas[qAtual];

  document.getElementById('quiz-pergunta').textContent = p.q;
  document.getElementById('quiz-opcoes').innerHTML = p.opts.map((o, i) =>
    `<button class="quiz-opt" onclick="responder(${i})" aria-label="Opção ${i + 1}: ${o}">${o}</button>`
  ).join('');

  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next').className = 'quiz-next';
  buildProgress();
}

function responder(idx) {
  if (respondeu) return;
  respondeu = true;

  const p    = perguntas[qAtual];
  const btns = document.querySelectorAll('.quiz-opt');
  btns.forEach(b => b.disabled = true);

  const fb = document.getElementById('quiz-feedback');

  if (idx === p.certa) {
    btns[idx].classList.add('correct');
    fb.className   = 'quiz-feedback show ok';
    fb.textContent = '✅ Correto! ' + p.exp;
    pontos++;
  } else {
    btns[idx].classList.add('wrong');
    btns[p.certa].classList.add('correct');
    fb.className   = 'quiz-feedback show err';
    fb.textContent = '❌ Não foi dessa vez. ' + p.exp;
  }

  document.getElementById('quiz-next').className = 'quiz-next show';
}

function proximaQ() {
  qAtual++;
  if (qAtual >= perguntas.length) {
    document.getElementById('quiz-content').style.display = 'none';

    const res = document.getElementById('quiz-result');
    res.className   = 'quiz-result show';

    const pct = Math.round((pontos / perguntas.length) * 100);
    let emoji, titulo, msg;

    if (pct === 100) {
      emoji  = '🏆';
      titulo = 'Mestre do Agro Sustentável!';
      msg    = 'Incrível! Você acertou tudo! O campo brasileiro tem um guardião.';
    } else if (pct >= 60) {
      emoji  = '🌱';
      titulo = 'Agricultor Consciente!';
      msg    = `Você acertou ${pontos} de ${perguntas.length} perguntas. Continue aprendendo!`;
    } else {
      emoji  = '🌾';
      titulo = 'Continue Aprendendo!';
      msg    = `${pontos} de ${perguntas.length} certas. Explore o site e tente novamente!`;
    }

    document.getElementById('quiz-emoji').textContent        = emoji;
    document.getElementById('quiz-result-titulo').textContent = titulo;
    document.getElementById('quiz-result-msg').textContent    = msg;
  } else {
    carregarQ();
  }
}

function reiniciarQuiz() {
  qAtual = 0;
  pontos = 0;
  document.getElementById('quiz-content').style.display = 'block';
  document.getElementById('quiz-result').className      = 'quiz-result';
  carregarQ();
}


/* ── LIBRAS PANEL ── */
function toggleLibras() {
  const panel = document.getElementById('libras-panel');
  const btn   = document.getElementById('libras-btn');
  const open  = panel.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}


/* ── ALTO CONTRASTE ── */
function toggleContraste() {
  document.body.classList.toggle('alto-contraste');
}


/* ── SCROLL ANIMATION (Timeline) ── */
const tlItems = document.querySelectorAll('.tl-item');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 150);
    }
  });
}, { threshold: 0.2 });
tlItems.forEach(el => obs.observe(el));


/* ── INICIAR QUIZ ── */
carregarQ();
