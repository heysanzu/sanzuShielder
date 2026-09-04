const HOLIDAYS = {
  "2026-01-26": "Republic Day", "2026-03-25": "Holi", "2026-04-14": "Dr. Ambedkar Jayanti",
  "2026-05-01": "Labour Day", "2026-06-17": "Eid ul-Adha", "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti", "2026-10-20": "Dussehra", "2026-11-04": "Diwali",
  "2026-11-05": "Diwali Holiday", "2026-12-25": "Christmas",
};
const SUBJECTS = ["Math", "English", "Science", "Social Studies", "Hindi", "Computer"];
const UPCOMING_EVENTS = [
  { title: "Unit Test", date: "2026-10-12" },
  { title: "Holiday - Dussehra", date: "2026-10-20" },
  { title: "Diwali Holiday", date: "2026-11-05" },
  { title: "Annual Day", date: "2026-12-18" },
];
const ANNOUNCEMENT_MEDIA = [
  {
    type: "image",
    src: "https://raw.githubusercontent.com/heysanzu/sanzu/main/sanzu.png",
    alt: "SHIELDER announcement",
  },
  {
    type: "image",
    src: "https://raw.githubusercontent.com/heysanzu/sanzuFlappy/main/src/flappyUI.png",
    alt: "SHIELDER announcement video",
  },
];

function blankAttendance() {
  const attendance = {};
  for (let month = 1; month <= 12; month++) {
    const days = new Date(2026, month, 0).getDate();
    for (let day = 1; day <= days; day++) {
      const date = "2026-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
      const weekday = new Date(date).getDay();
      attendance[date] = weekday === 0 ? "sunday" : (HOLIDAYS[date] ? "holiday" : null);
    }
  }
  return attendance;
}

function makeResults(scores) {
  return SUBJECTS.map((subject, index) => ({
    subject,
    date: "2026-09-" + String(5 + index * 2).padStart(2, "0"),
    score: scores[index],
    total: 50,
  }));
}

function fee(month, status, due) {
  return { month, amount: 1500, status, due };
}

const STUDENT_01 = {
  name: "Aayu",
  attendance: blankAttendance(),
  results: makeResults([42, 38, 40, 35, 44, 45]),
  fees: [
    fee("January 2026", "paid", "2026-01-05"), fee("February 2026", "paid", "2026-02-05"), fee("March 2026", "paid", "2026-03-05"),
    fee("April 2026", "unpaid", "2026-04-05"), fee("May 2026", "unpaid", "2026-05-05"), fee("June 2026", "unpaid", "2026-06-05"),
    fee("July 2026", "unpaid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_02 = {
  name: "Sanvi",
  attendance: blankAttendance(),
  results: makeResults([40, 46, 45, 44, 43, 42]),
  fees: [
    fee("January 2026", "paid", "2026-01-10"), fee("February 2026", "paid", "2026-02-10"), fee("March 2026", "paid", "2026-03-10"),
    fee("April 2026", "unpaid", "2026-04-10"), fee("May 2026", "unpaid", "2026-05-10"), fee("June 2026", "unpaid", "2026-06-10"),
    fee("July 2026", "unpaid", "2026-07-10"), fee("August 2026", "paid", "2026-08-10"), fee("September 2026", "paid", "2026-09-10"),
    fee("October 2026", "unpaid", "2026-10-10"), fee("November 2026", "unpaid", "2026-11-10"), fee("December 2026", "unpaid", "2026-12-10"),
  ],
};

const STUDENT_03 = {
  name: "Ayan",
  attendance: blankAttendance(),
  results: makeResults([35, 12, 36, 40, 35, 33]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-12"), fee("February 2026", "paid", "2026-02-12"), fee("March 2026", "paid", "2026-03-12"),
    fee("April 2026", "paid", "2026-04-12"), fee("May 2026", "paid", "2026-05-12"), fee("June 2026", "paid", "2026-06-12"),
    fee("July 2026", "unpaid", "2026-07-12"), fee("August 2026", "unpaid", "2026-08-12"), fee("September 2026", "unpaid", "2026-09-12"),
    fee("October 2026", "unpaid", "2026-10-12"), fee("November 2026", "unpaid", "2026-11-12"), fee("December 2026", "unpaid", "2026-12-12"),
  ],
};

const STUDENT_04 = {
  name: "Arifa",
  attendance: blankAttendance(),
  results: makeResults([41, 44, 41, 42, 39, 46]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "paid", "2026-02-05"), fee("March 2026", "paid", "2026-03-05"),
    fee("April 2026", "paid", "2026-04-05"), fee("May 2026", "paid", "2026-05-05"), fee("June 2026", "paid", "2026-06-05"),
    fee("July 2026", "unpaid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_05 = {
  name: "Anaya",
  attendance: blankAttendance(),
  results: makeResults([44, 42, 37, 33, 40, 38]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-15"), fee("February 2026", "unpaid", "2026-02-15"), fee("March 2026", "unpaid", "2026-03-15"),
    fee("April 2026", "paid", "2026-04-15"), fee("May 2026", "paid", "2026-05-15"), fee("June 2026", "paid", "2026-06-15"),
    fee("July 2026", "unpaid", "2026-07-15"), fee("August 2026", "unpaid", "2026-08-15"), fee("September 2026", "unpaid", "2026-09-15"),
    fee("October 2026", "unpaid", "2026-10-15"), fee("November 2026", "unpaid", "2026-11-15"), fee("December 2026", "unpaid", "2026-12-15"),
  ],
};

const STUDENT_06 = {
  name: "Nayyar",
  attendance: blankAttendance(),
  results: makeResults([44, 36, 42, 35, 43, 38]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "paid", "2026-04-05"), fee("May 2026", "paid", "2026-05-05"), fee("June 2026", "paid", "2026-06-05"),
    fee("July 2026", "unpaid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_07 = {
  name: "Nafisha",
  attendance: blankAttendance(),
  results: makeResults([42, 40, 36, 39, 37, 38]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "paid", "2026-04-05"), fee("May 2026", "paid", "2026-05-05"), fee("June 2026", "paid", "2026-06-05"),
    fee("July 2026", "unpaid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_08 = {
  name: "Abusad",
  attendance: blankAttendance(),
  results: makeResults([47, 48, 46, 44, 49, 50]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "paid", "2026-04-05"), fee("May 2026", "paid", "2026-05-05"), fee("June 2026", "paid", "2026-06-05"),
    fee("July 2026", "paid", "2026-07-05"), fee("August 2026", "paid", "2026-08-05"), fee("September 2026", "paid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_09 = {
  name: "Asad",
  attendance: blankAttendance(),
  results: makeResults([28, 26, 30, 27, 24, 31]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "paid", "2026-04-05"), fee("May 2026", "paid", "2026-05-05"), fee("June 2026", "paid", "2026-06-05"),
    fee("July 2026", "paid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_10 = {
  name: "Owais",
  attendance: blankAttendance(),
  results: makeResults([35, 32, 40, 36, 33, 31]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "unpaid", "2026-04-05"), fee("May 2026", "unpaid", "2026-05-05"), fee("June 2026", "unpaid", "2026-06-05"),
    fee("July 2026", "unpaid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_11 = {
  name: "Rabiya",
  attendance: blankAttendance(),
  results: makeResults([32, 15, 33, 30, 36, 34]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "unpaid", "2026-04-05"), fee("May 2026", "unpaid", "2026-05-05"), fee("June 2026", "unpaid", "2026-06-05"),
    fee("July 2026", "unpaid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENT_12 = {
  name: "Hasan",
  attendance: blankAttendance(),
  results: makeResults([40, 36, 43, 39, 41, 38]),
  fees: [
    fee("January 2026", "unpaid", "2026-01-05"), fee("February 2026", "unpaid", "2026-02-05"), fee("March 2026", "unpaid", "2026-03-05"),
    fee("April 2026", "unpaid", "2026-04-05"), fee("May 2026", "paid", "2026-05-05"), fee("June 2026", "paid", "2026-06-05"),
    fee("July 2026", "paid", "2026-07-05"), fee("August 2026", "unpaid", "2026-08-05"), fee("September 2026", "unpaid", "2026-09-05"),
    fee("October 2026", "unpaid", "2026-10-05"), fee("November 2026", "unpaid", "2026-11-05"), fee("December 2026", "unpaid", "2026-12-05"),
  ],
};

const STUDENTS = {
  "01": STUDENT_01, "02": STUDENT_02, "03": STUDENT_03, "04": STUDENT_04,
  "05": STUDENT_05, "06": STUDENT_06, "07": STUDENT_07, "08": STUDENT_08,
  "09": STUDENT_09, "10": STUDENT_10, "11": STUDENT_11, "12": STUDENT_12,
};

//Month: September 2026

Object.values(STUDENTS).forEach(student => {
  student.attendance["2026-09-01"] = "present";
});

Object.values(STUDENTS).forEach(student => {
  student.attendance["2026-09-02"] = "present";
});


Object.values(STUDENTS).forEach(student => {
  student.attendance["2026-09-03"] = "present";
});

STUDENT_07.attendance["2026-09-03"] = "absent";
STUDENT_08.attendance["2026-09-03"] = "absent";
STUDENT_09.attendance["2026-09-03"] = "absent";
STUDENT_01.attendance["2026-09-03"] = "absent";
STUDENT_02.attendance["2026-09-03"] = "absent";
STUDENT_12.attendance["2026-09-03"] = "absent";

Object.values(STUDENTS).forEach(student => {
  student.attendance["2026-09-04"] = "present";
});

STUDENT_03.attendance["2026-09-04"] = "absent";
