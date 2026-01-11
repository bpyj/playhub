// -----------------------------
// 1) EDIT THIS LIST TO ADD GAMES
// -----------------------------
const GAMES = [
  {
    title: "Forest Bingo",
    url: "https://bpyj.github.io/gruffalobingo/",
    tags: ["Math", "Turn-Based", "Ages 4–6"],
    description: "Roll and match symbols to complete rows. Great for turn-taking and counting.",
    isNew: false
  },
  {
    title: "Numbers Combine",
    url: "https://bpyj.github.io/numberscombine/",
    tags: ["Math", "Logic", "Ages 4–6"],
    description: "Combine numbers to reach a target. Builds number sense and simple strategy.",
    isNew: true
  },
  {
    title: "Crosswords by Kay",
    url: "https://bpyj.github.io/crosswordsbykay/",
    tags: ["Words", "Reading", "Ages 5–7"],
    description: "Simple crosswords for early readers. Encourages spelling and vocabulary practice.",
    isNew: false
  },
  {
    title: "Too Full Trains",
    url: "https://bpyj.github.io/toofulltrains/",
    tags: ["Logic", "Trains & Vehicles", "Ages 4–6"],
    description: "A capacity-themed mini game: plan your choices so the train doesn’t get too full.",
    isNew: false
  },
  {
    title: "Wordway Racers",
    url: "https://bpyj.github.io/wordway_racers/",
    tags: ["Words", "Racing", "Ages 5–7"],
    description: "Answer correctly to race forward. A fun way to reinforce quick reading and word recall.",
    isNew: true
  },
  {
    title: "River Safari Adventure",
    url: "https://bpyj.github.io/river_safari/",
    tags: ["Directions", "Racing", "Ages 5–7"],
    description: "Move North, South, East, West to find animals!",
    isNew: true
  }
];

// -----------------------------
// 2) FILTER CATEGORIES (auto-built from tags)
// -----------------------------
const PINNED_CATEGORIES = ["All", "Math", "Words", "Logic", "Trains & Vehicles", "Racing", "Turn-Based", "New"];

const grid = document.getElementById("grid");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.getElementById("filterButtons");
const searchBox = document.getElementById("searchBox");
const resultsCount = document.getElementById("resultsCount");

document.getElementById("year").textContent = new Date().getFullYear();

let activeCategory = "All";

function uniqueTagsFromGames(games){
  const set = new Set();
  games.forEach(g => (g.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a,b) => a.localeCompare(b));
}

function buildCategories(){
  const allTags = uniqueTagsFromGames(GAMES);

  // Start with pinned, then add any extra tags not already pinned.
  const categories = [...PINNED_CATEGORIES];
  allTags.forEach(t => {
    if (!categories.includes(t)) categories.push(t);
  });

  return categories;
}

function renderFilterButtons(){
  const cats = buildCategories();
  filterButtons.innerHTML = "";

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chipbtn" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat;

    btn.addEventListener("click", () => {
      activeCategory = cat;
      // reset button states
      [...filterButtons.querySelectorAll("button")].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });

    filterButtons.appendChild(btn);
  });
}

function matchesCategory(game){
  if (activeCategory === "All") return true;
  if (activeCategory === "New") return !!game.isNew;
  return (game.tags || []).includes(activeCategory);
}

function matchesSearch(game, q){
  if (!q) return true;
  const hay = [
    game.title,
    game.description,
    ...((game.tags || []))
  ].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

function createCard(game){
  const card = document.createElement("article");
  card.className = "card";

  const tagsHtml = (game.tags || [])
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  const badge = game.isNew ? `<span class="badge">New</span>` : "";

  card.innerHTML = `
    <div class="card-body">
      <div class="card-top">
        <h2 class="title">${escapeHtml(game.title)}</h2>
        ${badge}
      </div>

      <div class="tags" aria-label="Tags">
        ${tagsHtml}
      </div>

      <p class="desc">${escapeHtml(game.description || "")}</p>

      <div class="meta">
        <span class="subtle">${escapeHtml(new URL(game.url).host)}</span>
      </div>
    </div>

    <div class="card-actions">
      <a class="play" href="${game.url}" target="_blank" rel="noopener noreferrer">Play</a>
    </div>
  `;

  return card;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render(){
  const q = searchBox.value.trim();
  const filtered = GAMES.filter(g => matchesCategory(g) && matchesSearch(g, q));

  grid.innerHTML = "";
  filtered.forEach(g => grid.appendChild(createCard(g)));

  emptyState.style.display = filtered.length ? "none" : "block";
  resultsCount.textContent = `${filtered.length} game${filtered.length === 1 ? "" : "s"}`;
}

// Search input handler
searchBox.addEventListener("input", () => render());

// Nav shortcuts
document.getElementById("navAll").addEventListener("click", (e) => {
  e.preventDefault();
  activeCategory = "All";
  renderFilterButtons();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("navAbout").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("about").scrollIntoView({ behavior: "smooth" });
});

// Init
renderFilterButtons();
render();
