const DB_KEY = "silent_classroom_final_db";

function getDB() {
  return JSON.parse(localStorage.getItem(DB_KEY)) || {
    students: [],
    submissions: [],
    recordings: [],
    customTasks: []
  };
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getCurrentStudent() {
  const id = localStorage.getItem("currentStudentId");
  const db = getDB();
  return db.students.find(s => String(s.id) === String(id));
}

function updateStudent(updatedStudent) {
  const db = getDB();
  db.students = db.students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
  saveDB(db);
}

function addSubmission(submission) {
  const db = getDB();
  db.submissions.push(submission);
  saveDB(db);
}

function getLevelKey(level) {
  if (level === "support") return "easy";
  if (level === "average") return "medium";
  return "hard";
}

function grammarHelper(text) {
  const tips = [];

  if (!text || text.trim().length < 10) {
    tips.push("Write a longer answer.");
  }

  if (text && !text.includes(".")) {
    tips.push("Add full stops to separate sentences.");
  }

  if (/\bi\b/.test(text)) {
    tips.push("Use capital I, not small i.");
  }

  if (text && text.split(" ").length < 8) {
    tips.push("Add more details: who, what, where, when, why.");
  }

  if (text && !/\bbecause\b/i.test(text)) {
    tips.push("Try to use 'because' to explain your idea.");
  }

  if (tips.length === 0) {
    tips.push("Good job. Your answer is clear and complete.");
  }

  return tips;
}
