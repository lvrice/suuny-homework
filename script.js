/* ============================================================
 * 幼儿园中班 20 天小作业 —— 数据与渲染（可配置版）
 * ============================================================ */

const TOTAL_DAYS = 20;

/* ========== 默认配置 ========== */
const DEFAULT_CONFIG = {
  numMin: 1,
  numMax: 100,
  mathMax: 10,
  mathAdd: true,
  mathSub: false,
  letterStart: 0,   // A=0
  letterEnd: 25,     // Z=25
  customChars: "",
};

let CFG = { ...DEFAULT_CONFIG };

/* ---------- 默认汉字库（60 个） ---------- */
const DEFAULT_CHARS = [
  "一","二","三","四","五","六","七","八","九","十",
  "大","小","上","下","中","人","口","手","日","月",
  "星","水","火","山","田","土","木","爸","妈","我",
  "爷","奶","家","多","少","来","左","右","前","天",
  "地","雨","爱","心","好","红","黄","蓝","花","草",
  "树","牛","羊","马","鸡","鸭","鱼","春","夏","秋",
];

/* ============================================================
 * 模块一：数字书写
 * ============================================================ */
function getNumbersForDay(day) {
  const min = CFG.numMin;
  const max = CFG.numMax;
  const total = max - min + 1;
  const perDay = 10;
  const offset = ((day - 1) * perDay) % total;
  const list = [];
  for (let i = 0; i < perDay; i++) {
    list.push(min + (offset + i) % total);
  }
  return list.map((n) => ({ value: n }));
}

/* ============================================================
 * 模块二：计算练习（动态生成，支持加减法 + 不同范围）
 * ============================================================ */
function generateMathProblems(day) {
  const maxVal = CFG.mathMax;
  const canAdd = CFG.mathAdd;
  const canSub = CFG.mathSub;
  if (!canAdd && !canSub) return [];

  const seed = day * 137 + 42;
  const rng = mulberry32(seed);
  const problems = [];

  const progressFrac = (day - 1) / (TOTAL_DAYS - 1);
  const currentCeil = Math.max(3, Math.round(maxVal * (0.3 + 0.7 * progressFrac)));

  for (let i = 0; i < 10; i++) {
    const doSub = canSub && (!canAdd || rng() > 0.5);
    if (doSub) {
      const sum = Math.floor(rng() * currentCeil) + 1;
      const b = Math.floor(rng() * sum) + 0;
      const a = sum;
      problems.push({ a, op: "−", b, answer: a - b });
    } else {
      const sum = Math.floor(rng() * currentCeil) + 1;
      const a = Math.floor(rng() * sum);
      const b = sum - a;
      problems.push({ a, op: "+", b, answer: a + b });
    }
  }
  return problems;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getMathThemeForDay(day) {
  const maxVal = CFG.mathMax;
  const progressFrac = (day - 1) / (TOTAL_DAYS - 1);
  const currentCeil = Math.max(3, Math.round(maxVal * (0.3 + 0.7 * progressFrac)));
  const ops = [];
  if (CFG.mathAdd) ops.push("加法");
  if (CFG.mathSub) ops.push("减法");
  const opStr = ops.join("和") || "加法";

  if (day <= 2) return `${opStr} · ${currentCeil} 以内入门`;
  if (day <= 5) return `${opStr} · ${currentCeil} 以内基础`;
  if (day <= 10) return `${opStr} · ${currentCeil} 以内提高`;
  if (day <= 15) return `${opStr} · ${currentCeil} 以内巩固`;
  if (day <= 18) return `${opStr} · ${currentCeil} 以内灵活`;
  return `${opStr} · ${currentCeil} 以内综合挑战`;
}

/* ============================================================
 * 模块三：英文字母
 * ============================================================ */
function getLettersForDay(day) {
  const start = CFG.letterStart;
  const end = CFG.letterEnd;
  const range = end - start + 1;
  const letters = [];
  for (let i = 0; i < 3; i++) {
    const idx = start + ((day - 1) * 3 + i) % range;
    const upper = String.fromCharCode(65 + idx);
    const lower = String.fromCharCode(97 + idx);
    letters.push({ upper, lower });
  }
  return letters;
}

/* ============================================================
 * 模块四：汉字书写
 * ============================================================ */
function getActiveChars() {
  if (CFG.customChars && CFG.customChars.trim()) {
    return CFG.customChars.trim().split(/[\s,，、]+/).filter(Boolean);
  }
  return DEFAULT_CHARS;
}

function getCharsForDay(day) {
  const pool = getActiveChars();
  const perDay = 3;
  const out = [];
  for (let i = 0; i < perDay; i++) {
    const idx = ((day - 1) * perDay + i) % pool.length;
    out.push(pool[idx]);
  }
  return out;
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
        <span>模块二：计算小能手</span>
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
    .map((n) => `<div class="num-cell">${n.value}</div>`)
    .join("");

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
  const problems = generateMathProblems(day);
  const items = problems.map((p, i) => `
    <div class="math-item">
      <span class="idx">${i + 1}.</span>
      <span>${p.a} ${p.op} ${p.b} =</span>
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
 * 导航逻辑（桌面端按 spread 对开页，移动端按单天）
 * ============================================================ */
const DAYS_PER_SPREAD = 2;
const TOTAL_SPREADS = Math.ceil(TOTAL_DAYS / DAYS_PER_SPREAD);

let currentSpread = 1;
let currentMobileDay = 1;

function isMobile() {
  return window.innerWidth < 768;
}

function spreadDays(s) {
  const d1 = (s - 1) * DAYS_PER_SPREAD + 1;
  const d2 = Math.min(d1 + 1, TOTAL_DAYS);
  return [d1, d2];
}

function showSpread(s) {
  s = Math.max(1, Math.min(TOTAL_SPREADS, s));
  currentSpread = s;
  const [d1, d2] = spreadDays(s);

  document.querySelectorAll(".spread").forEach((el) => {
    el.classList.remove("active");
    el.classList.remove("show-second");
  });
  const target = document.querySelector(`.spread[data-spread="${s}"]`);
  if (target) target.classList.add("active");

  if (isMobile()) {
    const isSecond = currentMobileDay === d2 && d1 !== d2;
    if (isSecond && target) target.classList.add("show-second");
    document.getElementById("currentDay").textContent = `${currentMobileDay}`;
    document.getElementById("prevBtn").disabled = currentMobileDay === 1;
    document.getElementById("nextBtn").disabled = currentMobileDay === TOTAL_DAYS;
  } else {
    document.getElementById("currentDay").textContent = d1 === d2 ? `${d1}` : `${d1}-${d2}`;
    document.getElementById("prevBtn").disabled = s === 1;
    document.getElementById("nextBtn").disabled = s === TOTAL_SPREADS;
  }

  document.getElementById("daySelect").value = isMobile() ? String(currentMobileDay) : String(s);

  const hashVal = isMobile() ? `day=${currentMobileDay}` : `spread=${s}`;
  if (location.hash !== `#${hashVal}`) {
    history.replaceState(null, "", `#${hashVal}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigate(delta) {
  if (isMobile()) {
    currentMobileDay = Math.max(1, Math.min(TOTAL_DAYS, currentMobileDay + delta));
    currentSpread = Math.ceil(currentMobileDay / DAYS_PER_SPREAD);
    showSpread(currentSpread);
  } else {
    showSpread(currentSpread + delta);
  }
}

function jumpTo(val) {
  if (isMobile()) {
    currentMobileDay = Math.max(1, Math.min(TOTAL_DAYS, val));
    currentSpread = Math.ceil(currentMobileDay / DAYS_PER_SPREAD);
    showSpread(currentSpread);
  } else {
    showSpread(val);
  }
}

function buildSelect() {
  const sel = document.getElementById("daySelect");
  sel.innerHTML = "";
  if (isMobile()) {
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const opt = document.createElement("option");
      opt.value = String(d);
      opt.textContent = `第 ${d} 天`;
      sel.appendChild(opt);
    }
  } else {
    for (let s = 1; s <= TOTAL_SPREADS; s++) {
      const [d1, d2] = spreadDays(s);
      const opt = document.createElement("option");
      opt.value = String(s);
      opt.textContent = d1 === d2 ? `第 ${d1} 天` : `第 ${d1}-${d2} 天`;
      sel.appendChild(opt);
    }
  }
}

function initNav() {
  document.getElementById("prevBtn").addEventListener("click", () => navigate(-1));
  document.getElementById("nextBtn").addEventListener("click", () => navigate(1));
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  buildSelect();
  document.getElementById("daySelect").addEventListener("change", (e) => jumpTo(Number(e.target.value)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  let prevMobile = isMobile();
  window.addEventListener("resize", () => {
    const nowMobile = isMobile();
    if (nowMobile !== prevMobile) {
      prevMobile = nowMobile;
      buildSelect();
      if (nowMobile) {
        const [d1] = spreadDays(currentSpread);
        currentMobileDay = d1;
      } else {
        currentSpread = Math.ceil(currentMobileDay / DAYS_PER_SPREAD);
      }
      showSpread(currentSpread);
    }
  });

  // 支持手机左右滑动翻页
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      navigate(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* ============================================================
 * 配置面板逻辑
 * ============================================================ */
function initConfigPanel() {
  const panel = document.getElementById("configPanel");
  const openBtn = document.getElementById("settingsBtn");
  const closeBtn = document.getElementById("configClose");
  const overlay = document.getElementById("configOverlay");
  const applyBtn = document.getElementById("cfgApply");
  const resetBtn = document.getElementById("cfgReset");

  // 初始化字母下拉
  const startSel = document.getElementById("cfgLetterStart");
  const endSel = document.getElementById("cfgLetterEnd");
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    startSel.appendChild(new Option(ch, String(i)));
    endSel.appendChild(new Option(ch, String(i)));
  }

  function openPanel() {
    syncUIFromConfig();
    panel.style.display = "flex";
  }
  function closePanel() {
    panel.style.display = "none";
  }

  openBtn.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  applyBtn.addEventListener("click", () => {
    readConfigFromUI();
    saveConfig();
    rebuildPages();
    closePanel();
  });

  resetBtn.addEventListener("click", () => {
    CFG = { ...DEFAULT_CONFIG };
    syncUIFromConfig();
  });
}

function syncUIFromConfig() {
  document.getElementById("cfgNumMin").value = CFG.numMin;
  document.getElementById("cfgNumMax").value = CFG.numMax;
  document.getElementById("cfgMathMax").value = String(CFG.mathMax);
  document.getElementById("cfgMathAdd").checked = CFG.mathAdd;
  document.getElementById("cfgMathSub").checked = CFG.mathSub;
  document.getElementById("cfgLetterStart").value = String(CFG.letterStart);
  document.getElementById("cfgLetterEnd").value = String(CFG.letterEnd);
  document.getElementById("cfgCharsInput").value = CFG.customChars;
}

function readConfigFromUI() {
  CFG.numMin = Math.max(1, parseInt(document.getElementById("cfgNumMin").value, 10) || 1);
  CFG.numMax = Math.max(CFG.numMin, parseInt(document.getElementById("cfgNumMax").value, 10) || 100);
  CFG.mathMax = parseInt(document.getElementById("cfgMathMax").value, 10) || 10;
  CFG.mathAdd = document.getElementById("cfgMathAdd").checked;
  CFG.mathSub = document.getElementById("cfgMathSub").checked;
  if (!CFG.mathAdd && !CFG.mathSub) CFG.mathAdd = true;
  CFG.letterStart = parseInt(document.getElementById("cfgLetterStart").value, 10) || 0;
  CFG.letterEnd = parseInt(document.getElementById("cfgLetterEnd").value, 10) || 25;
  if (CFG.letterEnd < CFG.letterStart) CFG.letterEnd = CFG.letterStart;
  CFG.customChars = document.getElementById("cfgCharsInput").value;
}

function saveConfig() {
  try { localStorage.setItem("hw_config", JSON.stringify(CFG)); } catch (e) {}
}

function loadConfig() {
  try {
    const saved = localStorage.getItem("hw_config");
    if (saved) CFG = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch (e) {}
}

/* ============================================================
 * 重新生成所有页面
 * ============================================================ */
function rebuildPages() {
  const container = document.getElementById("pages");
  container.innerHTML = "";

  for (let s = 1; s <= TOTAL_SPREADS; s++) {
    const spread = document.createElement("section");
    spread.className = "spread";
    spread.dataset.spread = String(s);
    const [d1, d2] = spreadDays(s);
    spread.appendChild(renderPage(d1));
    if (d2 !== d1) spread.appendChild(renderPage(d2));
    container.appendChild(spread);
  }

  showSpread(currentSpread);
}

/* ============================================================
 * 初始化
 * ============================================================ */
function init() {
  loadConfig();
  rebuildPages();
  initNav();
  initConfigPanel();

  const mSpread = location.hash.match(/spread=(\d+)/);
  const mDay = location.hash.match(/day=(\d+)/);

  if (isMobile()) {
    if (mDay) currentMobileDay = Number(mDay[1]);
    else if (mSpread) currentMobileDay = spreadDays(Number(mSpread[1]))[0];
    currentSpread = Math.ceil(currentMobileDay / DAYS_PER_SPREAD);
  } else {
    if (mSpread) currentSpread = Number(mSpread[1]);
    else if (mDay) currentSpread = Math.ceil(Number(mDay[1]) / DAYS_PER_SPREAD);
    currentMobileDay = spreadDays(currentSpread)[0];
  }

  showSpread(currentSpread);
}

document.addEventListener("DOMContentLoaded", init);
