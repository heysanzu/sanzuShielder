/* ── SHIELDER — app.js ── */

/* ── Holidays 2026 ── */
const HOLIDAYS = {
  "2026-01-26": "Republic Day",
  "2026-03-25": "Holi",
  "2026-04-14": "Dr. Ambedkar Jayanti",
  "2026-05-01": "Labour Day",
  "2026-06-17": "Eid ul-Adha",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Dussehra",
  "2026-11-04": "Diwali",
  "2026-11-05": "Diwali Holiday",
  "2026-12-25": "Christmas",
};

/* ── Subjects ── */
const SUBJECTS = ["Math", "English", "Science", "Social Studies", "Hindi", "Computer"];

/* ── Seeded RNG ── */
function seededRng(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

/* ── Attendance generator ── */
function generateAttendance(monthStr, seed) {
  const [yr, mo] = monthStr.split("-").map(Number);
  const days = new Date(yr, mo, 0).getDate();
  const rng  = seededRng(seed + yr * 100 + mo);
  const map  = {};
  for (let d = 1; d <= days; d++) {
    const ds  = yr + "-" + String(mo).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    const dow = new Date(ds).getDay();
    if (dow === 0)    { map[ds] = "sunday";  continue; }
    if (HOLIDAYS[ds]) { map[ds] = "holiday"; continue; }
    map[ds] = rng() > 0.15 ? "present" : "absent";
  }
  return map;
}

function fullAttendance(seed) {
  const months = [
    "2026-01","2026-02","2026-03","2026-04","2026-05","2026-06",
    "2026-07","2026-08","2026-09","2026-10","2026-11","2026-12"
  ];
  let map = {};
  months.forEach(m => Object.assign(map, generateAttendance(m, seed)));
  return map;
}

/* ── Score sets (6 subjects each, out of 50) ── */
const SCORE_SETS = [
  [42, 38, 40, 35, 44, 45],
  [48, 46, 49, 44, 47, 50],
  [30, 27, 32, 28, 25, 33],
  [38, 40, 37, 42, 39, 36],
  [24, 22, 27, 23, 20, 28],
  [44, 46, 42, 45, 43, 47],
  [35, 33, 36, 31, 37, 34],
  [47, 48, 46, 44, 49, 50],
  [28, 26, 30, 27, 24, 31],
  [42, 44, 40, 43, 41, 45],
  [32, 35, 33, 30, 36, 34],
];

const FEE_SETS = [
  ["paid","paid","unpaid"],
  ["paid","paid","paid"],
  ["paid","unpaid","unpaid"],
  ["paid","paid","paid"],
  ["unpaid","unpaid","unpaid"],
  ["paid","paid","paid"],
  ["paid","paid","unpaid"],
  ["paid","paid","paid"],
  ["paid","unpaid","unpaid"],
  ["paid","paid","paid"],
  ["paid","paid","unpaid"],
];

const NAMES = [
  "Aayu","Sanvi","Ayan","Arifa","Anaya",
  "Nayyar","Nafisha","Abusad","Asad","Owais","Rabiya"
];

function buildStudents() {
  const obj = {};
  NAMES.forEach((name, i) => {
    const id   = String(i + 1).padStart(2, "0");
    const seed = (i + 1) * 7919;
    const fs   = FEE_SETS[i];
    obj[id] = {
      name,
      attendance: fullAttendance(seed),
      results: SUBJECTS.map((sub, j) => ({
        subject: sub,
        date:    "2026-09-" + String(5 + j * 2).padStart(2, "0"),
        score:   SCORE_SETS[i][j],
        total:   50,
      })),
      fees: [
        { month: "July 2026",      amount: 1500, status: fs[0], due: "2026-07-05" },
        { month: "August 2026",    amount: 1500, status: fs[1], due: "2026-08-05" },
        { month: "September 2026", amount: 1500, status: fs[2], due: "2026-09-05" },
      ],
    };
  });
  return obj;
}

const STUDENTS = buildStudents();

/* ── State — default to current real month/year ── */
let currentStudent = null;
const _now   = new Date();
let calYear  = _now.getFullYear();
let calMonth = _now.getMonth() + 1;

/* ── Helpers ── */
function $(id) { return document.getElementById(id); }
function initIcons() { if (window.lucide) lucide.createIcons(); }

/* ══════════════════════════════════════
   LOGIN
══════════════════════════════════════ */
$("login-btn").addEventListener("click", doLogin);
$("student-id-input").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });

function doLogin() {
  const raw = $("student-id-input").value.trim();
  const key = raw.padStart(2, "0");
  if (!STUDENTS[key]) { shake($("login-box")); return; }

  currentStudent = key;
  $("login-screen").style.display = "none";
  $("app").style.display          = "flex";

  $("sidebar-name").textContent      = STUDENTS[key].name;
  $("sidebar-id").textContent        = "#" + key;
  $("topbar-student-id").textContent = "#" + key;

  /* Reset to dashboard */
  setActiveNav("dashboard");
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = s.id === "section-dashboard" ? "block" : "none";
  });

  loadDashboard();
  showNotice();
  initIcons();
}

function shake(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 500);
}

/* ── Logout (both sidebar & mobile) ── */
function doLogout() {
  currentStudent = null;
  $("app").style.display          = "none";
  $("login-screen").style.display = "flex";
  $("student-id-input").value     = "";
  initIcons();
}
$("logout-btn").addEventListener("click", doLogout);
$("logout-btn-mobile").addEventListener("click", doLogout);

/* ══════════════════════════════════════
   NAV — sidebar + bottom nav synced
══════════════════════════════════════ */
function setActiveNav(section) {
  document.querySelectorAll(".nav-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.section === section));
  document.querySelectorAll(".bnav-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.section === section));
}

function switchSection(target) {
  setActiveNav(target);
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = s.id === "section-" + target ? "block" : "none";
  });
  if (target === "calendar")    renderCalendar();
  if (target === "results")     renderResults();
  if (target === "performance") renderPerformance();
  if (target === "leaderboard") renderLeaderboard();
  if (target === "fees")        renderFees();
  initIcons();
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => switchSection(btn.dataset.section));
});
document.querySelectorAll(".bnav-btn").forEach(btn => {
  btn.addEventListener("click", () => switchSection(btn.dataset.section));
});

/* ══════════════════════════════════════
   NOTICE POPUP
══════════════════════════════════════ */
function showNotice() {
  $("notice-overlay").style.display = "flex";
  initIcons();
}
$("notice-close").addEventListener("click", () => {
  $("notice-overlay").style.display = "none";
});
$("notice-overlay").addEventListener("click", e => {
  if (e.target === $("notice-overlay")) $("notice-overlay").style.display = "none";
});

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
function loadDashboard() {
  const s   = STUDENTS[currentStudent];
  const now = new Date();

  $("current-date-display").textContent =
    now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const vals     = Object.values(s.attendance);
  const present  = vals.filter(v => v === "present").length;
  const absent   = vals.filter(v => v === "absent").length;
  const workdays = vals.filter(v => v !== "sunday" && v !== "holiday").length;
  const pct      = workdays ? Math.round((present / workdays) * 100) : 0;

  $("stat-present").textContent = present;
  $("stat-absent").textContent  = absent;
  $("stat-percent").textContent = pct + "%";
  $("stat-rank").textContent    = "#" + computeRank(currentStudent);

  const lastFee = [...s.fees].reverse()[0];
  const badge   = $("dash-fee-badge");
  const desc    = $("dash-fee-desc");
  if (lastFee.status === "paid") {
    badge.className   = "fee-badge paid";
    badge.textContent = "Paid";
    desc.textContent  = lastFee.month + " — cleared.";
  } else {
    badge.className   = "fee-badge unpaid";
    badge.textContent = "Unpaid";
    desc.textContent  = lastFee.month + " — due " + lastFee.due + ".";
  }

  typeGreeting(s.name);
}

/* ── Typing animation for greeting ── */
function typeGreeting(name) {
  const el = $("greeting-name-typed");
  el.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += name[i];
    i++;
    if (i >= name.length) clearInterval(interval);
  }, 80);
}

function computeRank(sid) {
  return Object.entries(STUDENTS)
    .map(([id, s]) => ({
      id,
      avg: s.results.reduce((a, r) => a + r.score, 0) / s.results.length,
    }))
    .sort((a, b) => b.avg - a.avg)
    .findIndex(r => r.id === sid) + 1;
}

/* ══════════════════════════════════════
   CALENDAR
══════════════════════════════════════ */
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

$("prev-month").addEventListener("click", () => {
  calMonth--; if (calMonth < 1) { calMonth = 12; calYear--; }
  renderCalendar();
});
$("next-month").addEventListener("click", () => {
  calMonth++; if (calMonth > 12) { calMonth = 1; calYear++; }
  renderCalendar();
});

function renderCalendar() {
  const s = STUDENTS[currentStudent];
  $("cal-month-label").textContent = MONTH_NAMES[calMonth - 1] + " " + calYear;

  const grid = $("calendar-grid");
  grid.innerHTML = "";

  DAY_NAMES.forEach(d => {
    const h = document.createElement("div");
    h.className   = "cal-day-header";
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDay  = new Date(calYear, calMonth - 1, 1).getDay();
  const totalDays = new Date(calYear, calMonth, 0).getDate();
  const today     = new Date();

  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement("div");
    e.className = "cal-day empty";
    grid.appendChild(e);
  }

  let pres = 0, abs = 0, hol = 0, wd = 0;

  for (let d = 1; d <= totalDays; d++) {
    const ds     = calYear + "-" + String(calMonth).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    const status = s.attendance[ds] || "sunday";

    if (status === "present") { pres++; wd++; }
    if (status === "absent")  { abs++;  wd++; }
    if (status === "holiday")   hol++;

    const cell = document.createElement("div");
    cell.className = "cal-day " + status;

    const isToday =
      today.getFullYear() === calYear &&
      today.getMonth() + 1 === calMonth &&
      today.getDate() === d;
    if (isToday) cell.classList.add("today");

    cell.innerHTML = "<span class='day-num'>" + d + "</span><span class='day-dot'></span>";
    cell.addEventListener("click", () => openDayPopup(ds, status));
    grid.appendChild(cell);
  }

  const rate = wd ? Math.round((pres / wd) * 100) : 0;
  $("ms-present").textContent = pres;
  $("ms-absent").textContent  = abs;
  $("ms-holiday").textContent = hol;
  $("ms-percent").textContent = rate + "%";
}

/* ── Day popup ── */
function openDayPopup(ds, status) {
  const d = new Date(ds + "T00:00:00");
  $("popup-date-title").textContent = d.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const labels = { present:"Present", absent:"Absent", sunday:"Sunday", holiday:"Holiday" };
  const st = $("popup-status");
  st.textContent = labels[status] || status;
  st.className   = "popup-status " + status;
  const notes = {
    present: "Attendance recorded for this day.",
    absent:  "Marked absent. Contact admin if incorrect.",
    sunday:  "No classes — weekly off.",
    holiday: HOLIDAYS[ds] ? "Holiday: " + HOLIDAYS[ds] : "Public holiday.",
  };
  $("popup-note").textContent = notes[status] || "";
  $("popup-overlay").style.display = "flex";
  initIcons();
}

$("popup-close").addEventListener("click", () => { $("popup-overlay").style.display = "none"; });
$("popup-overlay").addEventListener("click", e => {
  if (e.target === $("popup-overlay")) $("popup-overlay").style.display = "none";
});

/* ══════════════════════════════════════
   TEST RESULTS
══════════════════════════════════════ */
function getGrade(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function renderResults() {
  const s    = STUDENTS[currentStudent];
  const list = $("results-list");
  list.innerHTML = "";
  s.results.forEach(r => {
    const grade = getGrade(r.score);
    const pct   = Math.round((r.score / r.total) * 100);
    const card  = document.createElement("div");
    card.className = "result-card";
    card.innerHTML =
      "<div class='result-info'>" +
        "<h4>" + r.subject + "</h4>" +
        "<p>" + new Date(r.date + "T00:00:00").toLocaleDateString("en-IN",
          { day:"numeric", month:"short", year:"numeric" }) + "</p>" +
      "</div>" +
      "<div class='result-score'>" +
        "<span class='score-num'>" + r.score + "<small>/" + r.total + "</small></span>" +
        "<span class='score-grade grade-" + grade + "'>" + grade + " \u2014 " + pct + "%</span>" +
      "</div>";
    list.appendChild(card);
  });
}

/* ══════════════════════════════════════
   PERFORMANCE
══════════════════════════════════════ */
function renderPerformance() {
  const s   = STUDENTS[currentStudent];
  const avg = s.results.reduce((a, r) => a + r.score, 0) / s.results.length;
  const pct = Math.round(avg);

  $("perf-ring-fill").style.strokeDashoffset = 314.16 - (pct / 100) * 314.16;
  $("perf-ring-percent").textContent = pct + "%";

  const gradeMap = {
    A: "Excellent — keep it up!",
    B: "Good work — room to grow.",
    C: "Average — needs more effort.",
    D: "Needs improvement.",
  };
  $("perf-grade").textContent = gradeMap[getGrade(pct)];

  const bars = $("subject-bars");
  bars.innerHTML = "";
  s.results.forEach(r => {
    const sp = Math.round((r.score / r.total) * 100);
    bars.innerHTML +=
      "<div class='subject-bar-item'>" +
        "<div class='subject-bar-head'><span>" + r.subject + "</span><span>" + r.score + "/" + r.total + "</span></div>" +
        "<div class='bar-track'><div class='bar-fill' style='width:" + sp + "%'></div></div>" +
      "</div>";
  });
}

/* ══════════════════════════════════════
   LEADERBOARD — no student IDs shown
══════════════════════════════════════ */
function renderLeaderboard() {
  const rows = Object.entries(STUDENTS).map(([id, s]) => {
    const avg  = s.results.reduce((a, r) => a + r.score, 0) / s.results.length;
    const vals = Object.values(s.attendance);
    const pres = vals.filter(v => v === "present").length;
    const wd   = vals.filter(v => v !== "sunday" && v !== "holiday").length;
    return { id, name: s.name, avg: Math.round(avg), att: wd ? Math.round((pres/wd)*100) : 0 };
  }).sort((a, b) => b.avg - a.avg);

  const wrap = $("leaderboard-wrap");
  wrap.innerHTML = "";

  rows.forEach((item, i) => {
    const rank    = i + 1;
    const rankCls = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";
    const isMe    = item.id === currentStudent;

    const row = document.createElement("div");
    row.className = "lb-row" + (isMe ? " current-student" : "");
    row.innerHTML =
      "<span class='lb-rank " + rankCls + "'>" + rank + "</span>" +
      "<div style='flex:1;min-width:0'>" +
        "<div class='lb-name'>" + item.name +
          (isMe ? " <small style='font-weight:400;color:#999'>(You)</small>" : "") +
        "</div>" +
        "<div class='lb-sub'>Att: " + item.att + "%</div>" +
      "</div>" +
      "<div class='lb-bar-mini'><div class='lb-bar-mini-fill' style='width:" + item.avg + "%'></div></div>" +
      "<span class='lb-score'>" + item.avg + "%</span>";
    wrap.appendChild(row);
  });
}

/* ══════════════════════════════════════
   FEES
══════════════════════════════════════ */
function renderFees() {
  const s    = STUDENTS[currentStudent];
  const grid = $("fees-grid");
  grid.innerHTML = "";
  s.fees.forEach(f => {
    const paid = f.status === "paid";
    const row  = document.createElement("div");
    row.className = "fee-row";
    row.innerHTML =
      "<div class='fee-info'>" +
        "<h4>" + f.month + "</h4>" +
        "<p>Due: " + f.due + "</p>" +
      "</div>" +
      "<div class='fee-right'>" +
        "<span class='fee-amount'>&#8377;" + f.amount.toLocaleString("en-IN") + "</span>" +
        "<span class='fee-badge " + (paid ? "paid" : "unpaid") + "'>" + (paid ? "Paid" : "Unpaid") + "</span>" +
      "</div>";
    grid.appendChild(row);
  });
}

/* ══════════════════════════════════════
   AI CHAT
══════════════════════════════════════ */
$("chat-send").addEventListener("click", sendChat);
$("chat-input").addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });

async function sendChat() {
  const input = $("chat-input");
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = "";
  appendMsg("user", msg);

  const s       = STUDENTS[currentStudent];
  const vals    = Object.values(s.attendance);
  const present = vals.filter(v => v === "present").length;
  const absent  = vals.filter(v => v === "absent").length;
  const wd      = vals.filter(v => v !== "sunday" && v !== "holiday").length;
  const att     = wd ? Math.round((present / wd) * 100) : 0;
  const avg     = Math.round(s.results.reduce((a,r) => a + r.score, 0) / s.results.length);
  const lastFee = [...s.fees].reverse()[0];

  const system =
    "You are SHIELDER AI — a friendly, brief academic assistant for " + s.name + " (Student #" + currentStudent + ").\n\n" +
    "Student snapshot:\n" +
    "- Attendance: " + present + " present, " + absent + " absent / " + wd + " school days (" + att + "%)\n" +
    "- Average score: " + avg + "%\n" +
    "- Rank: #" + computeRank(currentStudent) + " of " + Object.keys(STUDENTS).length + "\n" +
    "- Subjects: " + s.results.map(r => r.subject + " " + r.score + "/100").join(", ") + "\n" +
    "- Latest fee: " + lastFee.month + " — " + lastFee.status + " (Rs." + lastFee.amount + ")\n\n" +
    "Reply in 2-4 sentences max. Be warm and direct.";

  const typing = appendTyping();

  try {
    const res  = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: msg }],
      }),
    });
    const data = await res.json();
    typing.querySelector(".chat-bubble").textContent =
      data.content?.[0]?.text || "Couldn't get a response. Try again.";
  } catch {
    typing.querySelector(".chat-bubble").textContent = "Connection issue. Try again shortly.";
  }

  scrollChat();
  initIcons();
}

function appendMsg(role, text) {
  const wrap = document.createElement("div");
  wrap.className = "chat-msg " + role;
  const av = document.createElement("div");
  av.className = "chat-avatar";
  av.innerHTML = role === "bot" ? "<i data-lucide='shield'></i>" : "<i data-lucide='user-round'></i>";
  const bub = document.createElement("div");
  bub.className   = "chat-bubble";
  bub.textContent = text;
  wrap.appendChild(av);
  wrap.appendChild(bub);
  $("chat-messages").appendChild(wrap);
  initIcons();
  scrollChat();
  return wrap;
}

function appendTyping() {
  const wrap = document.createElement("div");
  wrap.className = "chat-msg bot";
  const av = document.createElement("div");
  av.className = "chat-avatar";
  av.innerHTML = "<i data-lucide='shield'></i>";
  const bub = document.createElement("div");
  bub.className   = "chat-bubble typing-indicator";
  bub.textContent = "Typing...";
  wrap.appendChild(av);
  wrap.appendChild(bub);
  $("chat-messages").appendChild(wrap);
  initIcons();
  scrollChat();
  return wrap;
}

function scrollChat() {
  const box = $("chat-messages");
  box.scrollTop = box.scrollHeight;
}

/* ── Boot ── */
initIcons();
