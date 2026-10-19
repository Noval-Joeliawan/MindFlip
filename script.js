// Array Mapel
const ppknCards = [
  { id: 1, name: "Kebhinekaan", emoji: "🧩" },
  { id: 2, name: "Toleransi", emoji: "🤝" },
  { id: 3, name: "Gotong Royong", emoji: "💪" },
  { id: 4, name: "Persatuan", emoji: "✊" },
  { id: 5, name: "Nasionalisme", emoji: "🇮🇩" },
  { id: 6, name: "Musyawarah", emoji: "📢" },
  { id: 7, name: "Solidaritas", emoji: "🛡️" },
  { id: 8, name: "Demokrasi", emoji: "🗳️" },
];

const agamaislamCards = [
  { id: 1, name: "Pergaulan Bebas", emoji: "🚫" },
  { id: 2, name: "Zina", emoji: "⚠️" },
  { id: 3, name: "Tawakkal", emoji: "🤲" },
  { id: 4, name: "Doa", emoji: "🙏" },
  { id: 5, name: "Khauf", emoji: "😨" },
  { id: 6, name: "Raja'", emoji: "✨" },
  { id: 7, name: "Akhlaq", emoji: "💎" },
  { id: 8, name: "Adab", emoji: "👤" },
];

const pjokCards = [
  { id: 1, name: "Kebugaran", emoji: "🔥" },
  { id: 2, name: "Sepak Bola", emoji: "⚽" },
  { id: 3, name: "Voli", emoji: "🏐" },
  { id: 4, name: "Bulu Tangkis", emoji: "🏸" },
  { id: 5, name: "Atletik", emoji: "🏃" },
  { id: 6, name: "Senam", emoji: "🤸" },
  { id: 7, name: "Bela Diri", emoji: "🥋" },
  { id: 8, name: "Gaya Hidup", emoji: "🥗" },
];

// Status Game
let gameState = {
  mode: "ppkn",
  playerName: "",
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  timer: 0,
  timerInterval: null,
  isLocked: false,
};

// Navigasi Layar
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.add("hidden");
    s.classList.remove("animate-screen");
  });
  const target = document.getElementById(screenId);
  target.classList.remove("hidden");
  target.classList.add("animate-screen");
}

// Logika Pilih Mapel di Welcome Screen
function selectMode(mode, btnElement) {
  gameState.mode = mode;
  document
    .querySelectorAll(".mode-btn")
    .forEach((btn) => btn.classList.remove("active-mode"));
  const targetBtn = btnElement || (window.event && window.event.currentTarget);
  if (targetBtn) targetBtn.classList.add("active-mode");
}

// Logika Permainan saat Dimulai
function startGame() {
  const name = document.getElementById("player-name").value.trim();
  if (!name) return alert("Isi Nama Mu Dulu ❗❗");

  gameState.playerName = name;
  gameState.moves = 0;
  gameState.matchedPairs = 0;
  gameState.timer = 0;
  gameState.flippedCards = [];
  gameState.isLocked = false;

  const source =
    gameState.mode === "ppkn"
      ? ppknCards
      : gameState.mode === "agamaislam"
        ? agamaislamCards
        : pjokCards;

  // Shuffle kartu
  gameState.cards = [...source, ...source].sort(() => Math.random() - 0.5);

  document.getElementById("display-player").textContent = name;
  document.getElementById("moves").textContent = "0";
  document.getElementById("timer").textContent = "00:00";

  renderBoard();
  startTimer();
  showScreen("game-screen");
}

// Render 16 kartu bergaya Flashcard Fisik
function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  gameState.cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "card-container cursor-pointer select-none";
    el.innerHTML = `
      <div class="card-inner w-full h-full">
        <div class="card-front">
          <div class="card-front-badge">?</div>
        </div>
        <div class="card-back flex-col p-2 text-center">
          <span class="text-3xl sm:text-4xl drop-shadow-sm">${card.emoji}</span>
          <span class="text-[9px] sm:text-[10px] font-extrabold uppercase mt-2 text-slate-800 tracking-wide leading-tight px-1 bg-amber-100 rounded border border-slate-900">
            ${card.name}
          </span>
        </div>
      </div>`;
    el.onclick = () => flipCard(i, el);
    board.appendChild(el);
  });
}

// Logika Buka Kartu
function flipCard(i, el) {
  if (gameState.isLocked || el.classList.contains("card-flipped")) return;
  el.classList.add("card-flipped");
  gameState.flippedCards.push({ i, el });

  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    document.getElementById("moves").textContent = gameState.moves;
    checkMatch();
  }
}

function checkMatch() {
  gameState.isLocked = true;
  const [c1, c2] = gameState.flippedCards;

  if (gameState.cards[c1.i].id === gameState.cards[c2.i].id) {
    c1.el.classList.add("card-matched");
    c2.el.classList.add("card-matched");

    gameState.matchedPairs++;
    gameState.flippedCards = [];
    gameState.isLocked = false;

    if (gameState.matchedPairs === 8) setTimeout(endGame, 700);
  } else {
    setTimeout(() => {
      c1.el.classList.remove("card-flipped");
      c2.el.classList.remove("card-flipped");
      gameState.flippedCards = [];
      gameState.isLocked = false;
    }, 800);
  }
}

// Timer & Scoring
function startTimer() {
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(() => {
    gameState.timer++;
    const m = Math.floor(gameState.timer / 60)
      .toString()
      .padStart(2, "0");
    const s = (gameState.timer % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
  }, 1000);
}

function endGame() {
  clearInterval(gameState.timerInterval);

  const score = Math.max(
    0,
    10000 - gameState.timer * 12 - gameState.moves * 40,
  );

  document.getElementById("win-player").textContent = gameState.playerName;
  document.getElementById("final-score").textContent = score.toLocaleString();
  saveScore(gameState.playerName, score);
  showScreen("win-screen");
}

// Leaderboard LocalStorage
function saveScore(name, score) {
  let data = JSON.parse(localStorage.getItem("memoryLeaderboard")) || [];
  data.push({ name, score, date: new Date().toLocaleDateString() });
  data.sort((a, b) => b.score - a.score);
  localStorage.setItem("memoryLeaderboard", JSON.stringify(data.slice(0, 10)));
}

function openLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  const data = JSON.parse(localStorage.getItem("memoryLeaderboard")) || [];

  list.innerHTML = data.length
    ? data
        .map((s, i) => {
          let bgStyle = "bg-white";
          let rankColor = "bg-slate-200 text-slate-800";
          let icon = "";

          if (i === 0) {
            bgStyle = "bg-amber-200";
            rankColor = "bg-amber-400 text-slate-900";
            icon = "👑";
          } else if (i === 1) {
            bgStyle = "bg-sky-100";
            rankColor = "bg-sky-300 text-slate-900";
            icon = "🥈";
          } else if (i === 2) {
            bgStyle = "bg-orange-100";
            rankColor = "bg-orange-300 text-slate-900";
            icon = "🥉";
          }

          return `
        <div class="flex items-center justify-between p-3.5 ${bgStyle} rounded-2xl pop-border-sm transition-transform hover:-translate-y-0.5">
            <div class="flex items-center gap-3.5">
                <div class="w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center font-display text-base ${rankColor}">
                    ${i + 1}
                </div>
                <div>
                    <p class="font-extrabold text-slate-900 text-base leading-tight">${s.name} ${icon}</p>
                    <p class="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">${s.date}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-display text-violet-700 text-xl leading-none">${s.score.toLocaleString()}</p>
                <p class="text-[9px] text-slate-600 font-extrabold mt-0.5">POIN</p>
            </div>
        </div>`;
        })
        .join("")
    : `<div class="text-center py-16 bg-white rounded-2xl pop-border-sm">
          <p class="text-4xl">📭</p>
          <p class="text-slate-600 font-extrabold mt-2 text-sm">Belum ada skor tercatat</p>
       </div>`;

  showScreen("leaderboard-screen");
}

function backToMenu() {
  clearInterval(gameState.timerInterval);
  showScreen("welcome-screen");
}
