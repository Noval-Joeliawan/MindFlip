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
  mode: "ppkn", // Kategori yang dipilih
  playerName: "", // Nama pemain
  cards: [], // Array kartu yang sudah di-acak (shuffle)
  flippedCards: [], // Menyimpan kartu yang sedang dibuka (maksimal 2)
  matchedPairs: 0, // Jumlah pasangan yang sudah ketemu
  moves: 0, // Jumlah klik/langkah pemain
  timer: 0, // Waktu berjalan (detik)
  timerInterval: null, // ID interval untuk hitung mundur/maju
  isLocked: false, // Mengunci papan saat animasi cek kartu sedang jalan
};

// Navigasi Layar
// Fungsi untuk pindah antar menu (Welcome -> Game -> Win)
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
function selectMode(mode) {
  gameState.mode = mode;
  document
    .querySelectorAll(".mode-btn")
    .forEach((btn) => btn.classList.remove("active-mode"));
  event.currentTarget.classList.add("active-mode");
}

// Logika Permainan saat Dimulai
function startGame() {
  const name = document.getElementById("player-name").value.trim();
  if (!name) return alert("Isi Nama Mu Dulu ❗❗");

  // Reset status game ke awal
  gameState.playerName = name;
  gameState.moves = 0;
  gameState.matchedPairs = 0;
  gameState.timer = 0;
  gameState.flippedCards = [];
  gameState.isLocked = false;

  // Pilih data kartu berdasarkan mode yang dipilih user
  const source =
    gameState.mode === "ppkn"
      ? ppknCards
      : gameState.mode === "agamaislam"
        ? agamaislamCards
        : pjokCards;

  // Logika Shuffle
  gameState.cards = [...source, ...source].sort(() => Math.random() - 0.5);

  document.getElementById("display-player").textContent = name;
  document.getElementById("moves").textContent = "0";

  renderBoard();
  startTimer();
  showScreen("game-screen");
}

// Fungsi untuk membuat elemen HTML kartu satu per satu
function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  gameState.cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "card-container cursor-pointer";
    el.innerHTML = `
            <div class="card-inner w-full h-full">
                <div class="card-front">?</div>
                <div class="card-back flex-col p-2 text-center">
                    <span class="text-3xl">${card.emoji}</span>
                    <span class="text-[9px] font-extrabold uppercase mt-2 text-slate-500 tracking-wider">${card.name}</span>
                </div>
            </div>`;
    el.onclick = () => flipCard(i, el);
    board.appendChild(el);
  });
}

// logika kartu flip dan match
function flipCard(i, el) {
  if (gameState.isLocked || el.classList.contains("card-flipped")) return;
  el.classList.add("card-flipped");
  gameState.flippedCards.push({ i, el });

  // logika saat dua kartu terbuka
  if (gameState.flippedCards.length === 2) {
    gameState.moves++; // Tambah jumlah langkah
    document.getElementById("moves").textContent = gameState.moves;
    checkMatch(); // Cek apakah sama
  }
}

function checkMatch() {
  gameState.isLocked = true;
  const [c1, c2] = gameState.flippedCards;

  //logika kecocokan kartu
  if (gameState.cards[c1.i].id === gameState.cards[c2.i].id) {
    // Jika cocok: Beri tanda matched dan biarkan terbuka
    c1.el.classList.add("card-matched");
    c2.el.classList.add("card-matched");

    gameState.matchedPairs++;
    gameState.flippedCards = [];
    gameState.isLocked = false;

    // logika saat kartu sudah ketemu semua
    if (gameState.matchedPairs === 8) setTimeout(endGame, 700);
  } else {
    // Jika tidak cocok: Tutup lagi kartunya dan delay
    setTimeout(() => {
      c1.el.classList.remove("card-flipped");
      c2.el.classList.remove("card-flipped");
      gameState.flippedCards = [];
      gameState.isLocked = false;
    }, 800);
  }
}

// Logika Timer Dan Scoring
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

  // Logika hitung skor: (Poin awal - penalti waktu - penalti langkah)
  const score = Math.max(
    0,
    10000 - gameState.timer * 12 - gameState.moves * 40,
  );

  document.getElementById("win-player").textContent = gameState.playerName;
  document.getElementById("final-score").textContent = score.toLocaleString();
  saveScore(gameState.playerName, score); // Simpan skor ke LocalStorage
  showScreen("win-screen");
}

// Penyimpanan Lokal Skor top 10 pemain Leaderboard
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
          // Logika tampilan warna khusus untuk juara 1, 2, dan 3
          let bgStyle = "bg-white/50";
          let rankColor = "bg-slate-100 text-slate-500";
          let icon = "";

          if (i === 0) {
            bgStyle = "bg-yellow-50/80 border border-yellow-200";
            rankColor = "bg-yellow-400 text-white shadow-yellow-200";
            icon = "👑";
          } else if (i === 1) {
            bgStyle = "bg-slate-50/80 border border-slate-200";
            rankColor = "bg-slate-400 text-white shadow-slate-200";
          } else if (i === 2) {
            bgStyle = "bg-orange-50/80 border border-orange-200";
            rankColor = "bg-orange-400 text-white shadow-orange-200";
          }

          return `
        <div class="flex items-center justify-between p-4 ${bgStyle} rounded-2xl shadow-sm transition-all hover:translate-x-1">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg ${rankColor}">
                    ${i + 1}
                </div>
                <div>
                    <p class="font-extrabold text-slate-800 text-lg">${s.name} ${icon}</p>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${s.date}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-black text-indigo-600 text-2xl leading-none">${s.score.toLocaleString()}</p>
                <p class="text-[9px] text-slate-400 font-bold mt-1">PTS</p>
            </div>
        </div>`;
        })
        .join("")
    : `<div class="text-center py-20">
                    <p class="text-4xl">📭</p>
                    <p class="text-slate-400 font-bold mt-2">Belum ada skor tercatat</p>
                  </div>`;

  showScreen("leaderboard-screen");
}

function backToMenu() {
  clearInterval(gameState.timerInterval);
  showScreen("welcome-screen");
}
