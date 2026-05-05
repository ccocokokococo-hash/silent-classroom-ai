function studentLogin() {
  const name = document.getElementById("studentName").value.trim();
  const grade = document.getElementById("studentGrade").value;
  const level = document.getElementById("studentLevel").value;

  if (!name) {
    alert("Enter your name.");
    return;
  }

  const db = getDB();
  let student = db.students.find(s => s.name.toLowerCase() === name.toLowerCase());

  if (!student) {
    student = {
      id: Date.now(),
      name,
      grade,
      level,
      points: 0,
      recordings: 0,
      homeworkDone: 0,
      speakingDone: 0,
      streak: 0,
      confidence: 20,
      status: level === "support" ? "Needs support" : "Active",
      assignedTask: null,
      badges: [],
      createdAt: new Date().toLocaleString()
    };

    db.students.push(student);
  } else {
    student.grade = grade;
    student.level = level;
  }

  saveDB(db);
  localStorage.setItem("currentStudentId", student.id);
  window.location.href = "student.html";
}

function teacherLogin() {
  const password = document.getElementById("teacherPassword").value;

  if (password !== "1234") {
    alert("Teacher password is 1234.");
    return;
  }

  localStorage.setItem("teacherMode", "true");
  window.location.href = "teacher.html";
}
