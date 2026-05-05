const homeworkTasks = {
  support: {
    title: "Simple Self-Introduction",
    instruction: "Write 3 simple sentences about yourself.",
    example: "My name is Aida. I am 12. I like English."
  },
  average: {
    title: "My School Day",
    instruction: "Write 5 sentences about your school day.",
    example: "I go to school at 8. I study English. I have lunch. I meet my friends. I go home at 3."
  },
  confident: {
    title: "Opinion Writing",
    instruction: "Write 7 sentences about why English is useful.",
    example: "English is useful because people use it around the world. It helps with travel, study, and future jobs."
  }
};

function loadHomework() {
  const student = getCurrentStudent();

  if (!student) {
    window.location.href = "index.html";
    return;
  }

  const task = homeworkTasks[student.level];

  document.getElementById("homeworkTitle").innerText = task.title;
  document.getElementById("homeworkInstruction").innerText = task.instruction;
  document.getElementById("homeworkExample").innerText = task.example;
}

function submitHomework() {
  const student = getCurrentStudent();
  const answer = document.getElementById("homeworkAnswer").value.trim();

  if (!answer) {
    alert("Write your answer first.");
    return;
  }

  const db = getDB();

  let score = 10;

  if (answer.split(" ").length >= 15) score += 5;
  if (/because/i.test(answer)) score += 5;
  if (answer.includes(".")) score += 5;

  const tips = grammarHelper(answer);

  student.homeworkDone++;
  student.points += score;

  if (student.homeworkDone >= 3 && !student.badges.includes("Homework Hero")) {
    student.badges.push("Homework Hero");
  }

  db.submissions.push({
    id: Date.now(),
    studentId: student.id,
    studentName: student.name,
    type: "homework",
    answer,
    score,
    date: new Date().toLocaleString()
  });

  db.students = db.students.map(s => s.id === student.id ? student : s);
  saveDB(db);

  document.getElementById("homeworkFeedback").innerHTML = `
    <h3>Score: ${score}</h3>
    ${tips.map(t => `<p>• ${t}</p>`).join("")}
  `;
}

loadHomework();
