/* ── SHIELDER — app.js ── */

/* ── Student Data ── */
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

/* Holidays for June 2025 */
const HOLIDAYS = {
  "2025-06-15": "Bakri Eid",
  "2025-06-21": "Summer Break",
};

/* ── Attendance Generator ── */
function generateAttendance(monthStr) {
  const [yr, mo] = monthStr.split("-").map(Number);
  const days = new Date(yr, mo, 0).getDate();
  const map = {};
  for (let d = 1; d <= days; d++) {
    const dateStr = `${yr}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const dow = new Date(dateStr).getDay();
    if (dow === 0) { map[dateStr] = "sunday"; continue; }
    if (HOLIDAYS[dateStr]) { map[dateStr] = "holiday"; continue; }
    map[dateStr] = Math.random() > 0.18 ? "present" : "absent";
  }
  return map;
}

/* ── State ── */
let currentStudent = null;
let calYear  = 2025;
let calMonth = 6; // 1-indexed

/* ── Init Lucide ── */
function initIcons() { lucide.createIcons(); }

/* ── Login ── */
document.getElementById("login-btn").addEventListener("click", doLogin);
document.getElementById("student-id-input").addEventListener("keydown", e => {
  if (e.key === "Enter") doLogin();
});

function doLogin() {
  const raw = document.getElementById("student-id-input").value.trim().padStart(2,"0");
  if (!STUDENTS[raw]) {
    shakeFeedback();
    return;
  }
  currentStudent = raw;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("sidebar-name").textContent = STUDENTS[raw].name.split(" ")[0];
  document.getElementById("sidebar-id").textContent   = `#${raw}`;
  document.getElementById("topbar-student-id").textContent = `#${raw}`;
  loadDashboard();
  initIcons();
}

function shakeFeedback() {
  const box = document.querySelector(".login-box");
  box.style.transition = "transform 0.07s";
  const shifts = ["-6px","6px","-5px","5px","-3px","3px","0px"];
  let i = 0;
  const id = setInterval(() => {
    box.style.transform = `translateX(${shifts[i]})`;
    i++;
    if (i >= shifts.length) { clearInterval(id); box.style.transform = ""; }
  }, 60);
}

/* ── Logout ── */
document.getElementById("logout-btn").addEventListener("click", () => {
  currentStudent = null;
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("student-id-input").value = "";
  initIcons();
});

/* ── Nav ── */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.section;
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".section").forEach(s => {
      s.classList.toggle("active", s.id === `section-${target}`);
      s.classList.toggle("hidden", s.id !== `section-${target}`);
    });
    if (target === "calendar")    renderCalendar();
    if (target === "results")     renderResults();
    if (target === "performance") renderPerformance();
    if (target === "leaderboard") renderLeaderboard();
    if (target === "fees")        renderFees();
    closeSidebar();
  });
});

/* ── Mobile Sidebar ── */
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebar-overlay").classList.toggle("active");
});

document.getElementById("sidebar-overlay").addEventListener("click", closeSidebar);

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("active");
}

/* ── Dashboard ── */
function loadDashboard() {
  const s = STUDENTS[currentStudent];

  // Date
  const now = new Date();
  document.getElementById("current-date-display").textContent =
    now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  // Attendance stats
  const atDays = Object.values(s.attendance);
  const present  = atDays.filter(v => v === "present").length;
  const absent   = atDays.filter(v => v === "absent").length;
  const workdays = atDays.filter(v => v !== "sunday" && v !== "holiday").length;
  const pct = workdays ? Math.round((present / workdays) * 100) : 0;

  document.getElementById("stat-present").textContent = present;
  document.getElementById("stat-absent").textContent  = absent;
  document.getElementById("stat-percent").textContent = `${pct}%`;

  // Rank
  const rank = computeRank(currentStudent);
  document.getElementById("stat-rank").textContent = `#${rank}`;

  // Fee
  const latestFee = [...s.fees].reverse()[0];
  const badge = document.getElementById("dash-fee-badge");
  const desc  = document.getElementById("dash-fee-desc");
  if (latestFee.status === "paid") {
    badge.className = "fee-badge paid";
    badge.textContent = "Paid";
    desc.textContent = `${latestFee.month} — cleared.`;
  } else {
    badge.className = "fee-badge unpaid";
    badge.textContent = "Unpaid";
    desc.textContent = `${latestFee.month} — due ${latestFee.due}.`;
  }

  initIcons();
}

function computeRank(sid) {
  const scores = Object.entries(STUDENTS).map(([id, s]) => {
    const avg = s.results.reduce((a, r) => a + r.score, 0) / s.results.length;
    return { id, avg };
  }).sort((a, b) => b.avg - a.avg);
  return scores.findIndex(r => r.id === sid) + 1;
}

/* ── Calendar ── */
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

document.getElementById("prev-month").addEventListener("click", () => {
  calMonth--; if (calMonth < 1) { calMonth = 12; calYear--; } renderCalendar();
});
document.getElementById("next-month").addEventListener("click", () => {
  calMonth++; if (calMonth > 12) { calMonth = 1; calYear++; } renderCalendar();
});

function renderCalendar() {
  const s = STUDENTS[currentStudent];
  document.getElementById("cal-month-label").textContent = `${MONTHS[calMonth-1]} ${calYear}`;

  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  // Day headers
  DAYS.forEach(d => {
    const h = document.createElement("div");
    h.className = "cal-day-header";
    h.textContent = d;
    grid.appendChild(h);
  });

  const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
  const totalDays = new Date(calYear, calMonth, 0).getDate();
  const today = new Date();

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement("div");
    e.className = "cal-day empty";
    grid.appendChild(e);
  }

  let present = 0, absent = 0, holiday = 0, workdays = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${calYear}-${String(calMonth).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const status  = s.attendance[dateStr] || "sunday";

    if (status === "present") { present++; workdays++; }
    if (status === "absent")  { absent++;  workdays++; }
    if (status === "holiday") { holiday++; }

    const cell = document.createElement("div");
    cell.className = `cal-day ${status}`;

    const isToday = today.getFullYear() === calYear &&
                    today.getMonth() + 1 === calMonth &&
                    today.getDate() === d;
    if (isToday) cell.classList.add("today");

    cell.innerHTML = `<span class="day-num">${d}</span><span class="day-dot"></span>`;

    cell.addEventListener("click", () => openDayPopup(dateStr, status, d));
    grid.appendChild(cell);
  }

  // Month summary
  const pct = workdays ? Math.round((present / workdays) * 100) : 0;
  document.getElementById("ms-present").textContent = present;
  document.getElementById("ms-absent").textContent  = absent;
  document.getElementById("ms-holiday").textContent = holiday;
  document.getElementById("ms-percent").textContent = `${pct}%`;
}

/* ── Day Popup ── */
function openDayPopup(dateStr, status, day) {
  const overlay = document.getElementById("popup-overlay");
  const title   = document.getElementById("popup-date-title");
  const st      = document.getElementById("popup-status");
  const note    = document.getElementById("popup-note");

  const d = new Date(dateStr);
  title.textContent = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const labels = { present: "Present", absent: "Absent", sunday: "Sunday", holiday: "Holiday" };
  st.textContent = labels[status] || status;
  st.className   = `popup-status ${status}`;

  const notes = {
    present: "Attendance recorded for this day.",
    absent:  "Marked absent. Contact admin if incorrect.",
    sunday:  "No classes — weekly off.",
    holiday: HOLIDAYS[dateStr] ? `Holiday: ${HOLIDAYS[dateStr]}` : "Public holiday.",
  };
  note.textContent = notes[status] || "";

  overlay.classList.remove("hidden");
  initIcons();
}

document.getElementById("popup-close").addEventListener("click", () => {
  document.getElementById("popup-overlay").classList.add("hidden");
});
document.getElementById("popup-overlay").addEventListener("click", e => {
  if (e.target === document.getElementById("popup-overlay")) {
    document.getElementById("popup-overlay").classList.add("hidden");
  }
});

/* ── Test Results ── */
function getGrade(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function renderResults() {
  const s = STUDENTS[currentStudent];
  const list = document.getElementById("results-list");
  list.innerHTML = "";

  s.results.forEach(r => {
    const grade = getGrade(r.score);
    const pct   = Math.round((r.score / r.total) * 100);
    const card  = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-info">
        <h4>${r.subject}</h4>
        <p>${new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
      </div>
      <div class="result-score">
        <span class="score-num">${r.score}<small>/${r.total}</small></span>
        <span class="score-grade grade-${grade}">${grade} — ${pct}%</span>
      </div>
    `;
    list.appendChild(card);
  });
  initIcons();
}

/* ── Performance ── */
function renderPerformance() {
  const s = STUDENTS[currentStudent];
  const avg = s.results.reduce((a, r) => a + r.score, 0) / s.results.length;
  const pct = Math.round(avg);

  // Ring
  const circumference = 314.16;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById("perf-ring-fill");
  ring.style.strokeDashoffset = offset;

  document.getElementById("perf-ring-percent").textContent = `${pct}%`;

  const grade = getGrade(pct);
  const gradeLabels = { A: "Excellent — keep it up!", B: "Good work — room to grow.", C: "Average — needs effort.", D: "Needs improvement." };
  document.getElementById("perf-grade").textContent = gradeLabels[grade];

  // Subject bars
  const bars = document.getElementById("subject-bars");
  bars.innerHTML = "";
  s.results.forEach(r => {
    const subPct = Math.round((r.score / r.total) * 100);
    bars.innerHTML += `
      <div class="subject-bar-item">
        <div class="subject-bar-head">
          <span>${r.subject}</span>
          <span>${r.score}/${r.total}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${subPct}%"></div>
        </div>
      </div>
    `;
  });
}

/* ── Leaderboard ── */
function renderLeaderboard() {
  const scores = Object.entries(STUDENTS).map(([id, s]) => {
    const avg = s.results.reduce((a, r) => a + r.score, 0) / s.results.length;
    const atDays  = Object.values(s.attendance);
    const present  = atDays.filter(v => v === "present").length;
    const workdays = atDays.filter(v => v !== "sunday" && v !== "holiday").length;
    const attPct = workdays ? Math.round((present / workdays) * 100) : 0;
    return { id, name: s.name, avg: Math.round(avg), attPct };
  }).sort((a, b) => b.avg - a.avg);

  const wrap = document.getElementById("leaderboard-wrap");
  wrap.innerHTML = "";

  scores.forEach((item, i) => {
    const rank    = i + 1;
    const rankCls = rank === 1 ? "top-1" : rank === 2 ? "top-2" : rank === 3 ? "top-3" : "";
    const isMe    = item.id === currentStudent;

    wrap.innerHTML += `
      <div class="lb-row ${isMe ? "current-student" : ""}">
        <span class="lb-rank ${rankCls}">${rank}</span>
        <div style="flex:1">
          <div class="lb-name">${item.name} ${isMe ? "<small>(You)</small>" : ""}</div>
          <div class="lb-id">#${item.id} &nbsp;·&nbsp; Att: ${item.attPct}%</div>
        </div>
        <div class="lb-bar-mini"><div class="lb-bar-mini-fill" style="width:${item.avg}%"></div></div>
        <span class="lb-score">${item.avg}%</span>
      </div>
    `;
  });
}

/* ── Fees ── */
function renderFees() {
  const s = STUDENTS[currentStudent];
  const grid = document.getElementById("fees-grid");
  grid.innerHTML = "";

  s.fees.forEach(f => {
    const isPaid = f.status === "paid";
    grid.innerHTML += `
      <div class="fee-row">
        <div class="fee-info">
          <h4>${f.month}</h4>
          <p>Due date: ${f.due}</p>
        </div>
        <div class="fee-right">
          <span class="fee-amount">₹${f.amount.toLocaleString("en-IN")}</span>
          <span class="fee-badge ${isPaid ? "paid" : "unpaid"}">${isPaid ? "Paid" : "Unpaid"}</span>
        </div>
      </div>
    `;
  });
  initIcons();
}

/* ── AI Chat ── */
document.getElementById("chat-send").addEventListener("click", sendChat);
document.getElementById("chat-input").addEventListener("keydown", e => {
  if (e.key === "Enter") sendChat();
});

async function sendChat() {
  const input = document.getElementById("chat-input");
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = "";

  appendMsg("user", msg);
  const typing = appendMsg("bot", '<span class="typing-indicator">Typing...</span>', true);

  const s = STUDENTS[currentStudent];
  const atDays  = Object.values(s.attendance);
  const present  = atDays.filter(v => v === "present").length;
  const absent   = atDays.filter(v => v === "absent").length;
  const workdays = atDays.filter(v => v !== "sunday" && v !== "holiday").length;
  const attPct  = workdays ? Math.round((present / workdays) * 100) : 0;
  const avgScore = Math.round(s.results.reduce((a, r) => a + r.score, 0) / s.results.length);
  const lastFee  = [...s.fees].reverse()[0];

  const systemContext = `You are SHIELDER AI, a friendly academic assistant for ${s.name} (Student #${currentStudent}).

Student Data:
- Attendance: ${present} present, ${absent} absent out of ${workdays} school days (${attPct}% rate)
- Test average score: ${avgScore}%
- Latest fee: ${lastFee.month} — ${lastFee.status} (₹${lastFee.amount})
- Subjects & scores: ${s.results.map(r => `${r.subject}: ${r.score}/${r.total}`).join(", ")}
- Rank in class: #${computeRank(currentStudent)} out of ${Object.keys(STUDENTS).length}

Answer questions about attendance, test results, fees, schedule, or academic advice. Be concise, warm, and direct.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemContext,
        messages: [{ role: "user", content: msg }],
      }),
    });

    const data = await resp.json();
    const text = data.content?.[0]?.text || "Sorry, I couldn't respond right now.";
    typing.querySelector(".chat-bubble").textContent = text;
  } catch {
    typing.querySelector(".chat-bubble").textContent = "Connection issue. Try again shortly.";
  }

  initIcons();
  scrollChat();
}

function appendMsg(role, html, raw = false) {
  const wrap   = document.createElement("div");
  wrap.className = `chat-msg ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "chat-avatar";
  avatar.innerHTML = role === "bot"
    ? `<i data-lucide="shield"></i>`
    : `<i data-lucide="user-round"></i>`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  if (raw) bubble.innerHTML = html;
  else bubble.textContent = html;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);

  document.getElementById("chat-messages").appendChild(wrap);
  initIcons();
  scrollChat();
  return wrap;
}

function scrollChat() {
  const box = document.getElementById("chat-messages");
  box.scrollTop = box.scrollHeight;
}

/* ── Boot ── */
initIcons();
