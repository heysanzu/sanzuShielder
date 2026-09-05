let currentStudent = null;
const _now   = new Date();
let calYear  = _now.getFullYear();
let calMonth = _now.getMonth() + 1;
let upcomingTimer = null;
let announcementTimer = null;

function $(id) { return document.getElementById(id); }
function initIcons() { if (window.lucide) lucide.createIcons(); }

$("login-btn").addEventListener("click", doLogin);
$("student-id-input").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });

function doLogin() {
  const raw = $("student-id-input").value.trim();
  const key = raw.padStart(2, "0");
  if (!STUDENTS[key]) { shake($("login-box")); return; }

  currentStudent = key;
  $("login-screen").style.display = "none";
  $("app").style.display          = "flex";

  $("sidebar-name").textContent      = STUDENTS[currentStudent].name;
  $("sidebar-id").textContent        = "#" + currentStudent;
  $("topbar-student-id").textContent = "#" + currentStudent;

  setActiveNav("dashboard");
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = s.id === "section-dashboard" ? "block" : "none";
  });

  loadDashboard();
  showNotice();
  renderNotes();
  initIcons();
}

function shake(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 500);
}

function doLogout() {
  currentStudent = null;
  $("app").style.display          = "none";
  $("login-screen").style.display = "flex";
  $("student-id-input").value     = "";
  initIcons();
}
$("logout-btn").addEventListener("click", doLogout);
$("logout-btn-mobile").addEventListener("click", doLogout);

function showNotice() {
  $("notice-student-name").textContent = STUDENTS[currentStudent].name;
  $("notice-overlay").style.display = "flex";
  initIcons();
}
$("notice-close").addEventListener("click", () => {
  $("notice-overlay").style.display = "none";
});
$("notice-overlay").addEventListener("click", e => {
  if (e.target === $("notice-overlay")) $("notice-overlay").style.display = "none";
});

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

  const statsGrid = $("stats-grid");
  statsGrid.classList.remove("stats-animate");
  void statsGrid.offsetWidth;
  statsGrid.classList.add("stats-animate");

  const currentMonthKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
  const currentFee = s.fees.find(fee => fee.due.startsWith(currentMonthKey));
  const badge   = $("dash-fee-badge");
  const desc    = $("dash-fee-desc");
  if (!currentFee) {
    badge.className = "fee-badge unpaid";
    badge.textContent = "Unavailable";
    desc.textContent = "No fee record for this month.";
  } else if (currentFee.status === "paid") {
    badge.className   = "fee-badge paid";
    badge.textContent = "Paid";
    desc.textContent  = currentFee.month + " — cleared.";
  } else {
    badge.className   = "fee-badge unpaid";
    badge.textContent = "Unpaid";
    desc.textContent  = currentFee.month + " — due " + currentFee.due + ".";
  }

  typeGreeting(s.name);
  renderAnnouncement();
  startUpcomingEvents();
}

function renderNotes() {
  const list = $("notes-list");
  const notes = NOTES;
  list.innerHTML = "";

  if (!notes.length) {
    list.innerHTML = "<p class='notes-empty'>No notes uploaded yet.</p>";
    return;
  }

  notes.forEach(note => {
    const item = document.createElement("div");
    item.className = "note-item";
    item.innerHTML =
      "<div class='note-info'><i data-lucide='file-text'></i>" +
        "<div><h4></h4><p>PDF note</p></div>" +
      "</div>" +
      "<div class='note-actions'><a class='download-btn note-view' target='_blank' rel='noopener'>View</a>" +
        "<a class='download-btn note-download' download><i data-lucide='download'></i><span>Download</span></a>" +
      "</div>";
    item.querySelector("h4").textContent = note.title;
    const view = item.querySelector(".note-view");
    view.href = note.data;
    const download = item.querySelector(".note-download");
    download.href = note.data;
    download.download = note.fileName;
    list.appendChild(item);
  });
  initIcons();
}

function renderAnnouncement() {
  const banner = $("announcement-banner");
  const mediaItems = Array.isArray(ANNOUNCEMENT_MEDIA) ? ANNOUNCEMENT_MEDIA : [ANNOUNCEMENT_MEDIA];
  let mediaIndex = 0;
  clearInterval(announcementTimer);

  function showMedia() {
    const media = mediaItems[mediaIndex];
    if (!media) return;
    banner.classList.remove("announcement-changing");
    void banner.offsetWidth;
    banner.innerHTML = "";
    let element;
    if (media.type === "video") {
      element = document.createElement("video");
      element.autoplay = true;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
    } else {
      element = document.createElement("img");
    }
    element.src = media.src;
    element.alt = media.alt || "Announcement";
    element.className = "announcement-media";
    element.addEventListener("error", () => { banner.style.display = "none"; });
    banner.appendChild(element);
    banner.style.display = "block";
    banner.classList.add("announcement-changing");
    initIcons();
    mediaIndex = (mediaIndex + 1) % mediaItems.length;
  }

  if (!mediaItems.length) {
    banner.style.display = "none";
    return;
  }
  showMedia();
  if (mediaItems.length > 1) announcementTimer = setInterval(showMedia, 6000);
}

function startUpcomingEvents() {
  clearInterval(upcomingTimer);
  const events = UPCOMING_EVENTS
    .filter(event => new Date(event.date + "T23:59:59") >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date));
  const list = $("upcoming-list");
  let eventIndex = 0;

  function showEvent() {
    list.classList.remove("event-changing");
    void list.offsetWidth;
    list.innerHTML = "";
    if (!events.length) {
      list.innerHTML = "<li>No upcoming events.</li>";
      return;
    }
    const event = events[eventIndex];
    const date = new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
    list.innerHTML = "<li><i data-lucide='calendar'></i><span>" + event.title + " &mdash; " + date + "</span></li>";
    list.classList.add("event-changing");
    initIcons();
    eventIndex = (eventIndex + 1) % events.length;
  }

  showEvent();
  if (events.length > 1) upcomingTimer = setInterval(showEvent, 5000);
}

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
    const status = s.attendance[ds] || "";

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

function openDayPopup(ds, status) {
  const d = new Date(ds + "T00:00:00");
  $("popup-date-title").textContent = d.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const labels = { present:"Present", absent:"Absent", sunday:"Sunday", holiday:"Holiday" };
  const st = $("popup-status");
  st.textContent = labels[status] || status;
  st.className   = "popup-status " + (status || "blank");
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
    const pct   = Math.round((r.score / r.total) * 100);
    const grade = getGrade(pct);
    const card  = document.createElement("div");
    card.className = "result-card";
    card.innerHTML =
      "<div class='result-info'>" +
        "<h4>" + r.subject + "</h4>" +
      "</div>" +
      "<div class='result-score'>" +
        "<span class='score-num'>" + r.score + "<small>/" + r.total + "</small></span>" +
        "<span class='score-grade grade-" + grade + "'>" + grade + " \u2014 " + pct + "%</span>" +
      "</div>";
    list.appendChild(card);
  });
}

async function downloadMarksheet() {
  await document.fonts.ready;
  const student = STUDENTS[currentStudent];
  let totalScore = 0;
  let totalMarks = 0;
  student.results.forEach(result => {
    totalScore += result.score;
    totalMarks += result.total;
  });
  const overallPercentage = Math.round((totalScore / totalMarks) * 100);
  const attendanceValues = Object.values(student.attendance);
  const presentDays = attendanceValues.filter(status => status === "present").length;
  const absentDays = attendanceValues.filter(status => status === "absent").length;
  const schoolDays = presentDays + absentDays;
  const attendancePercentage = schoolDays ? Math.round((presentDays / schoolDays) * 100) : 0;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 760 + student.results.length * 54;
  const context = canvas.getContext("2d");
  const logo = new Image();
  logo.crossOrigin = "anonymous";
  const logoLoaded = await new Promise(resolve => {
    const timeout = setTimeout(() => resolve(false), 3000);
    logo.onload = () => { clearTimeout(timeout); resolve(true); };
    logo.onerror = () => { clearTimeout(timeout); resolve(false); };
    logo.src = "https://raw.githubusercontent.com/heysanzu/sanzu/main/sanzu.png";
  });
  context.fillStyle = "#f5f5f5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111111";
  context.beginPath();
  context.roundRect(50, 45, canvas.width - 100, 92, 14);
  context.fill();
  context.fillStyle = "#ffffff";
  context.font = "700 34px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillText("SHIELDER", 82, 101);
  context.font = "700 26px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillText("2026", 1025, 101);
  context.fillStyle = "#808080";
  context.beginPath();
  context.roundRect(70, 160, 1060, 106, 12);
  context.fill();
  context.strokeStyle = "#909090";
  context.stroke();
  context.fillStyle = "#ffffff";
  context.font = "600 18px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillText("Student Information", 95, 192);
  context.fillStyle = "#ffffff";
  context.fillRect(70, 212, 1060, 54);
  context.strokeStyle = "#a0a0a0";
  context.strokeRect(70, 212, 1060, 54);
  context.fillStyle = "#111111";
  context.font = "600 18px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillText("Name: " + student.name, 95, 247);
  context.fillText("Roll Number: " + currentStudent, 390, 247);
  context.fillText("Attendance: " + presentDays + " present, " + absentDays + " absent (" + attendancePercentage + "%)", 700, 247);
  const tableX = 70;
  const tableY = 290;
  const tableWidth = 1060;
  const tableHeight = 144 + student.results.length * 54;
  context.save();
  context.beginPath();
  context.roundRect(tableX, tableY, tableWidth, tableHeight, 12);
  context.clip();
  context.fillStyle = "#808080";
  context.fillRect(tableX, tableY, tableWidth, 54);
  context.strokeStyle = "#909090";
  context.strokeRect(tableX, tableY, tableWidth, 54);
  context.fillStyle = "#ffffff";
  context.font = "600 18px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillText("Subject", 95, 324);
  context.fillText("Marks", 510, 324);
  context.fillText("Maximum", 670, 324);
  context.fillText("Percentage", 835, 324);
  context.fillText("Grade", 1030, 324);
  student.results.forEach((result, index) => {
    const y = 344 + index * 54;
    const percentage = Math.round((result.score / result.total) * 100);
    context.fillStyle = "#ffffff";
    context.fillRect(70, y, 1060, 54);
    context.strokeStyle = "#c0c0c0";
    context.strokeRect(70, y, 1060, 54);
    context.fillStyle = "#111111";
    context.font = "18px 'SanzuComic', 'Segoe UI', sans-serif";
    context.fillText(result.subject, 95, y + 34);
    context.fillText(String(result.score), 530, y + 34);
    context.fillText(String(result.total), 700, y + 34);
    context.fillText(percentage + "%", 855, y + 34);
    context.font = "700 18px 'SanzuComic', 'Segoe UI', sans-serif";
    context.fillText(getGrade(percentage), 1045, y + 34);
  });
  const totalY = 370 + student.results.length * 54;
  context.fillStyle = "#808080";
  context.fillRect(70, totalY, 1060, 64);
  context.strokeStyle = "#909090";
  context.strokeRect(70, totalY, 1060, 64);
  context.restore();
  if (logoLoaded) context.drawImage(logo, canvas.width - 142, canvas.height - 122, 72, 72);
  context.fillStyle = "#111111";
  context.font = "700 20px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillText("Total", 95, totalY + 40);
  context.fillText(totalScore + " / " + totalMarks, 490, totalY + 40);
  context.fillText(overallPercentage + "%", 855, totalY + 40);
  context.fillText(getGrade(overallPercentage), 1045, totalY + 40);
  context.font = "14px 'SanzuComic', 'Segoe UI', sans-serif";
  context.fillStyle = "#666666";
  context.fillText("by Shahnewaz", 70, canvas.height - 40);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "SHIELDER-" + currentStudent + "-marksheet.png";
  link.click();
}

$("download-marksheet").addEventListener("click", downloadMarksheet);

function renderLeaderboard() {
  const rows = Object.entries(STUDENTS).map(([id, s]) => {
    const avg  = s.results.reduce((total, result) => total + (result.score / result.total) * 100, 0) / s.results.length;
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
    row.className = "lb-row" + (rank === 1 ? " topper-row" : "") + (isMe ? " current-student" : "");
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
        "<span class='fee-badge " + (paid ? "paid" : "unpaid") + "'>" + (paid ? "Paid" : "Unpaid") + "</span>" +
      "</div>";
    grid.appendChild(row);
  });
}

initIcons();
