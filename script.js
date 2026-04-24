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
  // 每行 5 格中留 2 个空白（左右两行共 4 个），位置随日变化
  const pickBlanks = (seedA, seedB) => {
    const a = seedA % 5;
    let b = seedB % 5;
    if (b === a) b = (b + 1) % 5;
    return new Set([a, b]);
  };
  const leftBlanks = pickBlanks(day * 3, day * 7 + 1);
  const rightBlanks = pickBlanks(day * 5 + 2, day * 11 + 4);
  return list.map((n, idx) => {
    const inLeft = idx < 5;
    const pos = inLeft ? idx : idx - 5;
    const blank = inLeft ? leftBlanks.has(pos) : rightBlanks.has(pos);
    return { value: n, blank };
  });
}

/* ---------- 模块二：加法题（按"数字分解"思路，20 天循序渐进） ----------
 * 教学进度：
 *   Day 1-2:   入门 — 分解 2、3、4
 *   Day 3-5:   打基础 — 分解 5（含复习）
 *   Day 6-7:   分解 6
 *   Day 8-10:  分解 7（含复习）
 *   Day 11-12: 分解 8
 *   Day 13-15: 分解 9（含复习）
 *   Day 16-18: 分解 10（重点）
 *   Day 19-20: 综合挑战
 */
const MATH_BY_DAY = [
  // Day 1 — 分解 2、3
  [[1,1],[1,2],[2,1],[1,1],[2,1],[1,2],[1,1],[1,2],[2,1],[1,1]],
  // Day 2 — 分解 3、4
  [[1,2],[2,1],[1,3],[3,1],[2,2],[1,3],[2,2],[3,1],[1,2],[2,2]],
  // Day 3 — 分解 4、5（入门）
  [[1,3],[3,1],[2,2],[1,4],[4,1],[2,3],[3,2],[1,4],[2,3],[3,2]],
  // Day 4 — 分解 5（重点）
  [[1,4],[2,3],[3,2],[4,1],[1,4],[2,3],[3,2],[4,1],[2,3],[3,2]],
  // Day 5 — 复习 2-5
  [[1,1],[1,2],[2,2],[1,3],[3,1],[2,3],[3,2],[1,4],[4,1],[2,3]],
  // Day 6 — 分解 6（入门）
  [[1,5],[2,4],[3,3],[4,2],[5,1],[1,5],[2,4],[3,3],[4,2],[5,1]],
  // Day 7 — 分解 6 + 复习 5
  [[1,5],[2,4],[3,3],[4,2],[5,1],[2,3],[1,4],[3,2],[4,1],[2,4]],
  // Day 8 — 分解 7（入门）
  [[1,6],[2,5],[3,4],[4,3],[5,2],[6,1],[1,6],[2,5],[3,4],[4,3]],
  // Day 9 — 分解 7（巩固）
  [[3,4],[4,3],[2,5],[5,2],[1,6],[6,1],[3,4],[4,3],[2,5],[5,2]],
  // Day 10 — 复习 5-7
  [[1,4],[2,3],[3,3],[2,4],[1,5],[2,5],[3,4],[4,3],[1,6],[5,2]],
  // Day 11 — 分解 8（入门）
  [[1,7],[2,6],[3,5],[4,4],[5,3],[6,2],[7,1],[1,7],[2,6],[3,5]],
  // Day 12 — 分解 8（巩固）
  [[4,4],[3,5],[5,3],[2,6],[6,2],[1,7],[7,1],[4,4],[3,5],[5,3]],
  // Day 13 — 分解 9（入门）
  [[1,8],[2,7],[3,6],[4,5],[5,4],[6,3],[7,2],[8,1],[1,8],[4,5]],
  // Day 14 — 分解 9（巩固）
  [[4,5],[5,4],[3,6],[6,3],[2,7],[7,2],[1,8],[8,1],[4,5],[5,4]],
  // Day 15 — 复习 7-9
  [[3,4],[2,5],[4,4],[2,6],[3,5],[1,7],[4,5],[3,6],[2,7],[8,1]],
  // Day 16 — 分解 10（入门）
  [[1,9],[2,8],[3,7],[4,6],[5,5],[6,4],[7,3],[8,2],[9,1],[5,5]],
  // Day 17 — 分解 10（巩固）
  [[5,5],[4,6],[6,4],[3,7],[7,3],[2,8],[8,2],[1,9],[9,1],[5,5]],
  // Day 18 — 分解 10（灵活）
  [[1,9],[9,1],[2,8],[8,2],[3,7],[7,3],[4,6],[6,4],[5,5],[5,5]],
  // Day 19 — 综合复习 1-10
  [[2,3],[3,4],[4,4],[3,5],[2,6],[4,5],[3,6],[5,4],[6,4],[4,6]],
  // Day 20 — 综合挑战 1-10
  [[4,4],[3,5],[5,5],[4,6],[6,4],[3,7],[7,3],[2,8],[5,5],[9,1]],
];

// 每日主题（显示在模块标题中，加强教学感）
const MATH_THEME = [
  "分解 2、3 — 开始啦",
  "分解 3、4 — 试试看",
  "分解 4、5 — 入门练习",
  "分解 5 — 5 个苹果分两堆",
  "2-5 综合复习",
  "分解 6 — 6 个小朋友",
  "分解 6 和 5 混合",
  "分解 7 — 一周有 7 天",
  "分解 7 — 再练一练",
  "5-7 综合复习",
  "分解 8 — 挑战开始",
  "分解 8 — 巩固练习",
  "分解 9 — 加油",
  "分解 9 — 再巩固",
  "7-9 综合复习",
  "分解 10 — 10 个手指",
  "分解 10 — 巩固练习",
  "分解 10 — 灵活变换",
  "1-10 综合复习",
  "1-10 综合挑战 — 冲刺！",
];

function getMathForDay(day) {
  return MATH_BY_DAY[day - 1].map(([a, b]) => ({ a, b }));
}

function getMathThemeForDay(day) {
  return MATH_THEME[day - 1];
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
      <span class="sub">加油！棒棒哒 🌟</span>
    </div>

    <div class="module module-numbers">
      <div class="module-title"><span class="emoji">🔢</span> 模块一：认识数字（照着写一写）</div>
      ${renderNumbers(day)}
    </div>

    <div class="module module-math">
      <div class="module-title">
        <span class="emoji">➕</span>
        <span>模块二：加法小能手</span>
        <span class="module-theme">· ${getMathThemeForDay(day)}</span>
      </div>
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

    <div class="page-footer">第 ${day}/${TOTAL_DAYS} 天 · 家长签字 ✍️ ________</div>
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

  // 下方练习行：5 个空白格，让孩子照着上面写一遍
  const practiceRow = Array(5)
    .fill('<div class="num-cell blank"></div>')
    .join("");

  return `
    <div class="numbers-grid">
      <div class="num-group">
        <div class="num-row">${buildRow(col1)}</div>
        <div class="num-row practice">${practiceRow}</div>
      </div>
      <div class="num-group">
        <div class="num-row">${buildRow(col2)}</div>
        <div class="num-row practice">${practiceRow}</div>
      </div>
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
  const blanks = Array(3).fill('<div class="four-line blank"></div>').join("");
  return `
    <div class="letters-list">
      ${letters.map(({ upper, lower }) => `
        <div class="letter-row">
          <div class="letter-label">${upper} ${lower}</div>
          <div class="four-line-row">
            <div class="four-line demo">${upper}</div>
            <div class="four-line demo">${lower}</div>
            ${blanks}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderChars(day) {
  const chars = getCharsForDay(day);
  const blanks = Array(3).fill('<div class="mi-cell blank"></div>').join("");
  return `
    <div class="chars-list">
      ${chars.map((ch) => `
        <div class="char-row">
          <div class="char-label">${ch}</div>
          <div class="mi-cells">
            <div class="mi-cell demo">${ch}</div>
            ${blanks}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

/* ============================================================
 * 导航逻辑（按 spread 对开页，每页 2 天）
 * ============================================================ */

const DAYS_PER_SPREAD = 2;
const TOTAL_SPREADS = Math.ceil(TOTAL_DAYS / DAYS_PER_SPREAD);

let currentSpread = 1;

function spreadDays(s) {
  const d1 = (s - 1) * DAYS_PER_SPREAD + 1;
  const d2 = Math.min(d1 + 1, TOTAL_DAYS);
  return [d1, d2];
}

function showSpread(s) {
  s = Math.max(1, Math.min(TOTAL_SPREADS, s));
  currentSpread = s;

  document.querySelectorAll(".spread").forEach((el) => el.classList.remove("active"));
  const target = document.querySelector(`.spread[data-spread="${s}"]`);
  if (target) target.classList.add("active");

  const [d1, d2] = spreadDays(s);
  document.getElementById("currentDay").textContent = d1 === d2 ? `${d1}` : `${d1}-${d2}`;
  document.getElementById("prevBtn").disabled = s === 1;
  document.getElementById("nextBtn").disabled = s === TOTAL_SPREADS;
  document.getElementById("daySelect").value = String(s);

  if (location.hash !== `#spread=${s}`) {
    history.replaceState(null, "", `#spread=${s}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initNav() {
  document.getElementById("prevBtn").addEventListener("click", () => showSpread(currentSpread - 1));
  document.getElementById("nextBtn").addEventListener("click", () => showSpread(currentSpread + 1));
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  const sel = document.getElementById("daySelect");
  for (let s = 1; s <= TOTAL_SPREADS; s++) {
    const [d1, d2] = spreadDays(s);
    const opt = document.createElement("option");
    opt.value = String(s);
    opt.textContent = d1 === d2 ? `第 ${d1} 天` : `第 ${d1}-${d2} 天`;
    sel.appendChild(opt);
  }
  sel.addEventListener("change", (e) => showSpread(Number(e.target.value)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showSpread(currentSpread - 1);
    if (e.key === "ArrowRight") showSpread(currentSpread + 1);
  });
}

/* ============================================================
 * 初始化
 * ============================================================ */
function init() {
  const container = document.getElementById("pages");
  for (let s = 1; s <= TOTAL_SPREADS; s++) {
    const spread = document.createElement("section");
    spread.className = "spread";
    spread.dataset.spread = String(s);
    const [d1, d2] = spreadDays(s);
    spread.appendChild(renderPage(d1));
    if (d2 !== d1) spread.appendChild(renderPage(d2));
    container.appendChild(spread);
  }
  initNav();

  // URL hash 兼容 #spread=N 和旧的 #day=N
  let startSpread = 1;
  const mSpread = location.hash.match(/spread=(\d+)/);
  const mDay = location.hash.match(/day=(\d+)/);
  if (mSpread) startSpread = Number(mSpread[1]);
  else if (mDay) startSpread = Math.ceil(Number(mDay[1]) / DAYS_PER_SPREAD);
  showSpread(startSpread);
}

document.addEventListener("DOMContentLoaded", init);
