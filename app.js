/* ── SHIELDER — app.js ── */

/* ── Holidays ── */
const HOLIDAYS = {
  "2025-06-15": "Bakri Eid",
  "2025-06-21": "Summer Break",
  "2025-07-15": "Independence Day",
};

/* ── Attendance Generator ── */
function generateAttendance(monthStr) {
  const [yr, mo] = monthStr.split("-").map(Number);
  const days = new Date(yr, mo, 0).getDate();
  const map = {};
  for (let d = 1; d <= days; d++) {
    const ds  = `${yr}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const dow = new Date(ds).getDay();
    if (dow === 0)        { map[ds] = "sunday";  continue; }
    if (HOLIDAYS[ds])     { map[ds] = "holiday"; continue; }
    map[ds] = Math.random() > 0.18 ? "present" : "absent";
  }
  return map;
}

/* ── Student Data (defined after helper) ── */
const STUDENTS = {
  "01": {
    name: "Aryan Sharma",
    attendance: generateAttendance("2025-06"),
    results: [
      { subject: "Mathematics", date: "2025-06-10", score: 88, total: 100 },
      { subject: "Science",     date: "2025-06-12", score: 74, total: 100 },
      { subject: "English",     date: "2025-06-14", score: 91, total: 100 },
      { subject: "History",     date: "2025-06-17", score: 66, total: 100 },
      { subject: "Geography",   date: "2025-06-20", score: 79, total: 100 },
    ],
    fees: [
      { month: "April 2025", amount: 1500, status: "paid",   due: "2025-04-05" },
      { month: "May 2025",   amount: 1500, status: "paid",   due: "2025-05-05" },
      { month: "June 2025",  amount: 1500, status: "unpaid", due: "2025-06-05" },
    ],
  },
  "02": {
    name: "Priya Verma",
    attendance: generateAttendance("2025-06"),
    results: [
      { subject: "Mathematics", date: "2025-06-10", score: 95, total: 100 },
      { subject: "Science",     date: "2025-06-12", score: 89, total: 100 },
      { subject: "English",     date: "2025-06-14", score: 97, total: 100 },
      { subject: "History",     date: "2025-06-17", score: 82, total: 100 },
      { subject: "Geography",   date: "2025-06-20", score: 91, total: 100 },
    ],
    fees: [
      { month: "April 2025", amount: 1500, status: "paid", due: "2025-04-05" },
      { month: "May 2025",   amount: 1500, status: "paid", due: "2025-05-05" },
      { month: "June 2025",  amount: 1500, status: "paid", due: "2025-06-05" },
    ],
  },
  "03": {
    name: "Rohan Mishra",
    attendance: generateAttendance("2025-06"),
    results: [
      { subject: "Mathematics", date: "2025-06-10", score: 60, total: 100 },
      { subject: "Science",     date: "2025-06-12", score: 55, total: 100 },
      { subject: "English",     date: "2025-06-14", score: 70, total: 100 },
      { subject: "History",     date: "2025-06-17", score: 58, total: 100 },
      { subject: "Geography",   date: "2025-06-20", score: 62, total: 100 },
    ],
    fees: [
      { month: "April 2025", amount: 1500, status: "paid",   due: "2025-04-05" },
      { month: "May 2025",   amount: 1500, status: "unpaid", due: "2025-05-05" },
      { month: "June 2025",  amount: 1500, status: "unpaid", due: "2025-06-05" },
    ],
  },
  "04": {
    name: "Sneha Patel",
    attendance: generateAttendance("2025-06"),
    results: [
      { subject: "Mathematics", date: "2025-06-10", score: 77, total: 100 },
      { subject: "Science",     date: "2025-06-12", score: 81, total: 100 },
      { subject: "English",     date: "2025-06-14", score: 85, total: 100 },
      { subject: "History",     date: "2025-06-17", score: 74, total: 100 },
      { subject: "Geography",   date: "2025-06-20", score: 80, total: 100 },
    ],
    fees: [
      { month: "April 2025", amount: 1500, status: "paid", due: "2025-04-05" },
      { month: "May 2025",   amount: 1500, status: "paid", due: "2025-05-05" },
      { month: "June 2025",  amount: 1500, status: "paid", due: "2025-06-05" },
    ],
  },
  "05": {
    name: "Karan Singh",
    attendance: generateAttendance("2025-06"),
    results: [
      { subject: "Mathematics", date: "2025-06-10", score: 50, total: 100 },
      { subject: "Science",     date: "2025-06-12", score: 48, total: 100 },
      { subject: "English",     date: "2025-06-14", score: 55, total: 100 },
      { subject: "History",     date: "2025-06-17", score: 45, total: 100 },
      { subject: "Geography",   date: "2025-06-20", score: 52, total: 100 },
    ],
    fees: [
      { month: "April 2025", amount: 1500, status: "unpaid", due: "2025-04-05" },
      { month: "May 2025",   amount: 1500, status: "unpaid", due: "2025-05-05" },
      { month: "June 2025",  amount: 1500, status: "unpaid", due: "2025-06-05" },
    ],
  },
};

/* ── State ── */
let currentStudent = null;
let calYear  = 2025;
let calMonth = 6;

/* ── Helpers ── */
function $(id) { return document.getElementById(id); }

function show(el) {
  el.style.display = "";
  el.classList.remove("sh-hidden");
}
function hide(el) {
  el.style.display = "none";
  el.classList.add("sh-hidden");
}

function initIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ══════════════════════════════════════
   LOGIN
══════════════════════════════════════ */
$("login-btn").addEventListener("click", doLogin);
$("student-id-input").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });

function doLogin() {
  const raw = $("student-id-input").value.trim();
  const key = raw.padStart(2, "0");

  if (!STUDENTS[key]) {
    shake($("login-box"));
    return;
  }

  currentStudent = key;

  hide($("login-screen"));
  show($("app"));

  $("sidebar-name").textContent    = STUDENTS[key].name.split(" ")[0];
  $("sidebar-id").textContent      = `#${key}`;
  $("topbar-student-id").textContent = `#${key}`;

  /* reset to dashboard */
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-section="dashboard"]').classList.add("active");
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = s.id === "section-dashboard" ? "block" : "none";
  });

  loadDashboard();
  initIcons();
}

function shake(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 500);
}

/* ── Logout ── */
$("logout-btn").addEventListener("click", () => {
  currentStudent = null;
  hide($("app"));
  show($("login-screen"));
  $("student-id-input").value = "";
  initIcons();
});

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.section;

    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(s => {
      s.style.display = s.id === `section-${target}` ? "block" : "none";
    });

    if (target === "calendar")    renderCalendar();
    if (target === "results")     renderResults();
    if (target === "performance") renderPerformance();
    if (target === "leaderboard") renderLeaderboard();
    if (target === "fees")        renderFees();

    closeSidebar();
    initIcons();
  });
});

/* ── Mobile sidebar ── */
$("menu-toggle").addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
  $("sidebar-overlay").classList.toggle("active");
});
$("sidebar-overlay").addEventListener("click", closeSidebar);

function closeSidebar() {
  $("sidebar").classList.remove("open");
  $("sidebar-overlay").classList.remove("active");
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
function loadDashboard() {
  const s = STUDENTS[currentStudent];
  const now = new Date();

  $("current-date-display").textContent =
    now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const vals    = Object.values(s.attendance);
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
}

function computeRank(sid) {
  const sorted = Object.entries(STUDENTS)
    .map(([id, s]) => ({
      id,
      avg: s.results.reduce((a, r) => a + r.score, 0) / s.results.length,
    }))
    .sort((a, b) => b.avg - a.avg);
  return sorted.findIndex(r => r.id === sid) + 1;
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

  let present = 0, absent = 0, holiday = 0, workdays = 0;

  for (let d = 1; d <= totalDays; d++) {
    const ds     = calYear + "-" + String(calMonth).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    const status = s.attendance[ds] || "sunday";

    if (status === "present") { present++; workdays++; }
    if (status === "absent")  { absent++;  workdays++; }
    if (status === "holiday")   holiday++;

    const cell    = document.createElement("div");
    cell.className = "cal-day " + status;

    const isToday =
      today.getFullYear() === calYear &&
      today.getMonth() + 1 === calMonth &&
      today.getDate() === d;
    if (isToday) cell.classList.add("today");

    cell.innerHTML = `<span class="day-num">${d}</span><span class="day-dot"></span>`;
    cell.addEventListener("click", () => openDayPopup(ds, status));
    grid.appendChild(cell);
  }

  const pct = workdays ? Math.round((present / workdays) * 100) : 0;
  $("ms-present").textContent = present;
  $("ms-absent").textContent  = absent;
  $("ms-holiday").textContent = holiday;
  $("ms-percent").textContent = pct + "%";
}

/* ── Day Popup ── */
function openDayPopup(ds, status) {
  const d = new Date(ds + "T00:00:00");
  $("popup-date-title").textContent = d.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const labels = { present: "Present", absent: "Absent", sunday: "Sunday", holiday: "Holiday" };
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
    card.innerHTML = `
      <div class="result-info">
        <h4>${r.subject}</h4>
        <p>${new Date(r.date + "T00:00:00").toLocaleDateString("en-IN",
          { day: "numeric", month: "short", year: "numeric" })}</p>
      </div>
      <div class="result-score">
        <span class="score-num">${r.score}<small>/${r.total}</small></span>
        <span class="score-grade grade-${grade}">${grade} &mdash; ${pct}%</span>
      </div>
    `;
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

  const circumference = 314.16;
  const offset = circumference - (pct / 100) * circumference;
  $("perf-ring-fill").style.strokeDashoffset = offset;
  $("perf-ring-percent").textContent = pct + "%";

  const grade = getGrade(pct);
  const gradeMap = {
    A: "Excellent — keep it up!",
    B: "Good work — room to grow.",
    C: "Average — needs more effort.",
    D: "Needs improvement.",
  };
  $("perf-grade").textContent = gradeMap[grade];

  const bars = $("subject-bars");
  bars.innerHTML = "";
  s.results.forEach(r => {
    const sp = Math.round((r.score / r.total) * 100);
    bars.innerHTML += `
      <div class="subject-bar-item">
        <div class="subject-bar-head">
          <span>${r.subject}</span>
          <span>${r.score}/${r.total}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${sp}%"></div></div>
      </div>
    `;
  });
}

/* ══════════════════════════════════════
   LEADERBOARD
══════════════════════════════════════ */
function renderLeaderboard() {
  const scores = Object.entries(STUDENTS).map(([id, s]) => {
    const avg = s.results.reduce((a, r) => a + r.score, 0) / s.results.length;
    const vals = Object.values(s.attendance);
    const pres = vals.filter(v => v === "present").length;
    const wd   = vals.filter(v => v !== "sunday" && v !== "holiday").length;
    return { id, name: s.name, avg: Math.round(avg), att: wd ? Math.round((pres/wd)*100) : 0 };
  }).sort((a, b) => b.avg - a.avg);

  const wrap = $("leaderboard-wrap");
  wrap.innerHTML = "";

  scores.forEach((item, i) => {
    const rank    = i + 1;
    const rankCls = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";
    const isMe    = item.id === currentStudent;

    const row = document.createElement("div");
    row.className = "lb-row" + (isMe ? " current-student" : "");
    row.innerHTML = `
      <span class="lb-rank ${rankCls}">${rank}</span>
      <div style="flex:1;min-width:0">
        <div class="lb-name">${item.name}${isMe ? ' <small style="font-weight:400;color:#999">(You)</small>' : ""}</div>
        <div class="lb-id">#${item.id} &nbsp;&middot;&nbsp; Att: ${item.att}%</div>
      </div>
      <div class="lb-bar-mini"><div class="lb-bar-mini-fill" style="width:${item.avg}%"></div></div>
      <span class="lb-score">${item.avg}%</span>
    `;
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
    row.innerHTML = `
      <div class="fee-info">
        <h4>${f.month}</h4>
        <p>Due: ${f.due}</p>
      </div>
      <div class="fee-right">
        <span class="fee-amount">&#8377;${f.amount.toLocaleString("en-IN")}</span>
        <span class="fee-badge ${paid ? "paid" : "unpaid"}">${paid ? "Paid" : "Unpaid"}</span>
      </div>
    `;
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

  const system = `You are SHIELDER AI — a friendly, brief academic assistant for ${s.name} (Student #${currentStudent}).

Student snapshot:
- Attendance: ${present} present, ${absent} absent / ${wd} school days (${att}%)
- Average score: ${avg}%
- Rank: #${computeRank(currentStudent)} of ${Object.keys(STUDENTS).length}
- Subjects: ${s.results.map(r => r.subject + " " + r.score + "/" + r.total).join(", ")}
- Latest fee: ${lastFee.month} — ${lastFee.status} (Rs.${lastFee.amount})

Reply in 2–4 sentences max. Be warm and direct.`;

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
  const wrap   = document.createElement("div");
  wrap.className = "chat-msg " + role;

  const av = document.createElement("div");
  av.className = "chat-avatar";
  av.innerHTML = role === "bot"
    ? `<i data-lucide="shield"></i>`
    : `<i data-lucide="user-round"></i>`;

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
  const wrap   = document.createElement("div");
  wrap.className = "chat-msg bot";

  const av = document.createElement("div");
  av.className = "chat-avatar";
  av.innerHTML = `<i data-lucide="shield"></i>`;

  const bub = document.createElement("div");
  bub.className = "chat-bubble typing-indicator";
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
