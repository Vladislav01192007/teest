// ==== Global Variables ====
let alt = 0;
let altPerSecond = 0;
let level = 1;
let title = "Bronze";
let nftCount = 0;
let geniusNFTCount = 0;
let referrals = [];
let upgrades = [];
const nftBaseCost = 500000;
const titles = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legendary", "Mythic", "Immortal"];

// ==== Load Progress ====
function loadProgress() {
  alt = parseInt(localStorage.getItem("alt") || "0");
  altPerSecond = parseInt(localStorage.getItem("altPerSecond") || "0");
  level = parseInt(localStorage.getItem("level") || "1");
  title = localStorage.getItem("title") || "Bronze";
  nftCount = parseInt(localStorage.getItem("nftCount") || "0");
  geniusNFTCount = parseInt(localStorage.getItem("geniusNFTCount") || "0");
  referrals = JSON.parse(localStorage.getItem("referrals") || "[]");
  upgrades = JSON.parse(localStorage.getItem("upgrades") || "[]");
  updateUI();
}

// ==== Save Progress ====
function saveProgress() {
  localStorage.setItem("alt", alt);
  localStorage.setItem("altPerSecond", altPerSecond);
  localStorage.setItem("level", level);
  localStorage.setItem("title", title);
  localStorage.setItem("nftCount", nftCount);
  localStorage.setItem("geniusNFTCount", geniusNFTCount);
  localStorage.setItem("referrals", JSON.stringify(referrals));
  localStorage.setItem("upgrades", JSON.stringify(upgrades));
}

// ==== Update UI ====
function updateUI() {
  document.getElementById("altCount").textContent = alt;
  document.getElementById("user-level").textContent = `Level ${level}`;
  document.getElementById("user-title").textContent = title;
}

// ==== Mining Button ====
document.getElementById("mineButton").addEventListener("click", () => {
  alt += 1;
  checkLevelUp();
  updateUI();
  saveProgress();
});

// ==== Start Mining Loop ====
function startMining() {
  setInterval(() => {
    alt += altPerSecond + nftCount * 150 + geniusNFTCount * 50;
    checkLevelUp();
    updateUI();
    saveProgress();
  }, 1000);
}

// ==== Level Up ====
function checkLevelUp() {
  const requiredAlt = Math.pow(10, level) * 100000;
  if (alt >= requiredAlt && level < 10) {
    level++;
    title = titles[level - 1];
    confetti();
    alert(`🎉 Level up! You are now ${title}`);
  }
}

// ==== Show Tabs ====
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById(tabId).style.display = "block";
  if (tabId === 'quiz-tab') loadQuiz();
}

// ==== Quiz ALT-Genius ====
const quizData = [
  { question: "What is ALTSETING Token?", options: ["Cryptocurrency", "Pizza", "Hamster Game"], correct: 0 },
  { question: "How many NFT miners are planned?", options: ["50", "100", "500"], correct: 1 }
];

let currentQuestion = 0;
let quizScore = 0;

function loadQuiz() {
  if (currentQuestion < quizData.length) {
    const q = quizData[currentQuestion];
    document.getElementById('quiz-question').textContent = q.question;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(idx);
      optionsDiv.appendChild(btn);
    });
  } else {
    finishQuiz();
  }
}

function checkAnswer(index) {
  if (index === quizData[currentQuestion].correct) {
    quizScore++;
    alert("✅ Correct!");
  } else {
    alert("❌ Wrong answer!");
  }
  currentQuestion++;
  loadQuiz();
}

function finishQuiz() {
  alert(`🎉 Quiz finished! You got ${quizScore}/${quizData.length}!`);
  alt += quizScore * 5000;
  geniusNFTCount++;
  updateUI();
  saveProgress();
  document.getElementById('quiz-question').textContent = "Quiz Completed!";
  document.getElementById('quiz-options').innerHTML = "";
}

// ==== Confetti Animation ====
function confetti() {
  // Можна вставити бібліотеку конфетті або мінімальну анімацію тут
  console.log("🎊 Confetti animation!");
}

// ==== Initialize Game ====
window.onload = () => {
  loadProgress();
  startMining();
  generateUpgrades();
};

// ==== Generate Upgrades ====
function generateUpgrades() {
  const upgradesList = document.getElementById("upgrades-list");
  upgradesList.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const cost = Math.pow(i, 2) * 1000;
    const value = i;
    upgrades.push({ id: i, cost: cost, value: value });
    const upgradeDiv = document.createElement('div');
    upgradeDiv.className = 'upgrade';
    upgradeDiv.innerHTML = `
      <span>+${value} ALT/sec — <strong>Cost: ${cost} ALT</strong></span>
      <button onclick="buyUpgrade(${i})">Buy</button>
    `;
    upgradesList.appendChild(upgradeDiv);
  }
}

function buyUpgrade(id) {
  const upgrade = upgrades.find(u => u.id === id);
  if (alt >= upgrade.cost) {
    alt -= upgrade.cost;
    altPerSecond += upgrade.value;
    upgrade.cost = Math.floor(upgrade.cost * 1.8);
    updateUI();
    saveProgress();
    generateUpgrades();
  } else {
    alert("Not enough ALT!");
  }
}
