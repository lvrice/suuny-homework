/* ============================================================
 * 幼儿园中班 20 天小作业 —— 数据与渲染
 * ============================================================ */

const TOTAL_DAYS = 20;

/* ---------- 数据：60 个中班认知汉字，每天 3 个 ---------- */
const CHARS_60 = [
  "一", "二", "三",
  "四", "五", "六",
  "七", "八", "九",
  "十", "大", "小",
  "上", "下", "中",
  "人", "口", "手",
  "日", "月", "星",
  "水", "火", "山",
  "田", "土", "木",
  "爸", "妈", "我",
  "爷", "奶", "家",
  "多", "少", "来",
  "左", "右", "前",
  "天", "地", "雨",
  "爱", "心", "好",
  "红", "黄", "蓝",
  "花", "草", "树",
  "牛", "羊", "马",
  "鸡", "鸭", "鱼",
  "春", "夏", "秋",
];

/* ---------- 模块一：数字 1-100（每天 10 个） ---------- */
function getNumbersForDay(day) {
  // 第 1-10 天：1-10, 11-20, ..., 91-100
  // 第 11-20 天：再循环一轮
  const cycleDay = ((day - 1) % 10) + 1;
  const start = (cycleDay - 1) * 10 + 1;
  const list = [];
  for (let i = 0; i < 10; i++) {
    list.push(start + i);
  }
  // 每天预留 2 个空白格让孩子填写，位置随日变化
  const blank1 = (day * 3) % 10;
  let blank2 = (day * 7 + 5) % 10;
  if (blank2 === blank1) blank2 = (blank2 + 1) % 10;
  return list.map((n, idx) => ({
    value: n,
    blank: idx === blank1 || idx === blank2,
  }));
}

/* ---------- 模块二：加法题（每天 10 道，sum ≤ 10） ---------- */
function getMathForDay(day) {
  const problems = [];
  const seen = new Set();
  let i = 0;
  let guard = 0;
  while (problems.length < 10 && guard < 200) {
    guard++;
    const r1 = (day * 31 + i * 13 + 7) * 17;
    const r2 = (day * 53 + i * 19 + 3) * 23;
    const a = (Math.abs(r1) % 9) + 1; // 1-9
    const maxB = 10 - a;
    const b = maxB > 0 ? (Math.abs(r2) % maxB) + 1 : 1;
    const key = `${a}+${b}`;
    i++;
    if (seen.has(key)) continue;
    seen.add(key);
    problems.push({ a, b });
  }
  // 兜底：如果少于 10 题，填充简单题
  const simple = [
    [1, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [2, 2], [3, 3], [1, 5], [2, 6], [4, 6],
  ];
  let k = 0;
  while (problems.length < 10) {
    problems.push({ a: simple[k][0], b: simple[k][1] });
    k++;
  }
  return problems;
}

/* ---------- 模块三：英文字母（每天 3 个，大小写） ---------- */
function getLettersForDay(day) {
  const letters = [];
  for (let i = 0; i < 3; i++) {
    const idx = ((day - 1) * 3 + i) % 26;
    const upper = String.fromCharCode(65 + idx);
    const lower = String.fromCharCode(97 + idx);
    letters.push({ upper, lower });
  }
  return letters;
}

/* ---------- 模块四：汉字（每天 3 个） ---------- */
function getCharsForDay(day) {
  const start = (day - 1) * 3;
  return [CHARS_60[start], CHARS_60[start + 1], CHARS_60[start + 2]];
}

/* ============================================================
 * 渲染
 * ============================================================ */

function renderPage(day) {
  const page = document.createElement("section");
  page.className = "page";
  page.dataset.day = String(day);

  page.innerHTML = `
    <div class="page-header">
      第 ${day} 天 · 小小练习本
      <span class="sub">加油！今天也要棒棒哒 🌟</span>
    </div>

    <div class="module module-numbers">
      <div class="module-title"><span class="emoji">🔢</span> 模块一：认识数字（照着写一写）</div>
      ${renderNumbers(day)}
    </div>

    <div class="module module-math">
      <div class="module-title"><span class="emoji">➕</span> 模块二：加法小能手（算一算）</div>
      ${renderMath(day)}
    </div>

    <div class="module module-letters">
      <div class="module-title"><span class="emoji">🔤</span> 模块三：英文字母（描一描 写一写）</div>
      ${renderLetters(day)}
    </div>

    <div class="module module-chars">
      <div class="module-title"><span class="emoji">📝</span> 模块四：写汉字（描红 练写）</div>
      ${renderChars(day)}
    </div>

    <div class="page-footer">—— 第 ${day} / ${TOTAL_DAYS} 天 · 完成后请家长签字 ✍️ ——</div>
  `;
  return page;
}

function renderNumbers(day) {
  const nums = getNumbersForDay(day);
  const col1 = nums.slice(0, 5);
  const col2 = nums.slice(5, 10);

  const buildRow = (list) => list
    .map((n) => `<div class="num-cell ${n.blank ? "blank" : ""}">${n.blank ? "" : n.value}</div>`)
    .join("");

  return `
    <div class="numbers-grid">
      <div class="num-row">${buildRow(col1)}</div>
      <div class="num-row">${buildRow(col2)}</div>
    </div>
  `;
}

function renderMath(day) {
  const problems = getMathForDay(day);
  const items = problems.map((p, i) => `
    <div class="math-item">
      <span class="idx">${i + 1}.</span>
      <span>${p.a} + ${p.b} =</span>
      <span class="math-blank"></span>
    </div>
  `).join("");
  return `<div class="math-grid">${items}</div>`;
}

function renderLetters(day) {
  const letters = getLettersForDay(day);
  return `
    <div class="letters-list">
      ${letters.map(({ upper, lower }) => `
        <div class="letter-row">
          <div class="letter-label">${upper} ${lower}（大写 / 小写）</div>
          <div class="four-line-row">
            <div class="four-line demo">${upper}</div>
            <div class="four-line demo">${lower}</div>
            <div class="four-line blank"></div>
            <div class="four-line blank"></div>
            <div class="four-line blank"></div>
            <div class="four-line blank"></div>
            <div class="four-line blank"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderChars(day) {
  const chars = getCharsForDay(day);
  return `
    <div class="chars-list">
      ${chars.map((ch) => `
        <div class="char-row">
          <div class="char-label">${ch}</div>
          <div class="mi-cells">
            <div class="mi-cell demo">${ch}</div>
            <div class="mi-cell blank"></div>
            <div class="mi-cell blank"></div>
            <div class="mi-cell blank"></div>
            <div class="mi-cell blank"></div>
            <div class="mi-cell blank"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

/* ============================================================
 * 导航逻辑
 * ============================================================ */

let currentDay = 1;

function showDay(day) {
  day = Math.max(1, Math.min(TOTAL_DAYS, day));
  currentDay = day;

  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const target = document.querySelector(`.page[data-day="${day}"]`);
  if (target) target.classList.add("active");

  document.getElementById("currentDay").textContent = String(day);
  document.getElementById("prevBtn").disabled = day === 1;
  document.getElementById("nextBtn").disabled = day === TOTAL_DAYS;
  document.getElementById("daySelect").value = String(day);

  if (location.hash !== `#day=${day}`) {
    history.replaceState(null, "", `#day=${day}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initNav() {
  document.getElementById("prevBtn").addEventListener("click", () => showDay(currentDay - 1));
  document.getElementById("nextBtn").addEventListener("click", () => showDay(currentDay + 1));
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  const sel = document.getElementById("daySelect");
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const opt = document.createElement("option");
    opt.value = String(d);
    opt.textContent = `第 ${d} 天`;
    sel.appendChild(opt);
  }
  sel.addEventListener("change", (e) => showDay(Number(e.target.value)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showDay(currentDay - 1);
    if (e.key === "ArrowRight") showDay(currentDay + 1);
  });
}

/* ============================================================
 * 初始化
 * ============================================================ */
function init() {
  const container = document.getElementById("pages");
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    container.appendChild(renderPage(d));
  }
  initNav();

  const m = location.hash.match(/day=(\d+)/);
  const startDay = m ? Number(m[1]) : 1;
  showDay(startDay);
}

document.addEventListener("DOMContentLoaded", init);
