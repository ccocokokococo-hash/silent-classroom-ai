let currentTask = null;
let recorder = null;
let audioChunks = [];
let timerInterval = null;
let timeLeft = 0;

async function loadTaskBank() {
  const response = await fetch("data/tasks.json");
  return await response.json();
}

async function chooseTask(student) {
  const db = getDB();

  if (student.assignedTask) {
    return student.assignedTask;
  }

  const bank = await loadTaskBank();
  const gradeKey = student.grade === "6" ? "grade6" : "grade7";
  const levelKey = getLevelKey(student.level);
  const tasks = bank[gradeKey][levelKey];

  return tasks[Math.floor(Math.random() * tasks.length)];
}

async function initStudentPage() {
  const student = getCurrentStudent();

  if (!student) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("studentName").innerText = student.name;

  currentTask = await chooseTask(student);

  document.getElementById("taskBadge").innerText = currentTask.type.toUpperCase();
  document.getElementById("taskTitle").innerText = currentTask.title;
  document.getElementById("taskInstruction").innerText = currentTask.instruction;
  document.getElementById("taskExample").innerText = currentTask.example || "No example available.";
  document.getElementById("timer").innerText = currentTask.time || 30;

  const list = document.getElementById("sentenceStarters");
  list.innerHTML = "";

  currentTask.sentenceStarters.forEach(item => {
    list.innerHTML += `<li>${item}</li>`;
  });
}

async function startSpeaking() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    recorder = new MediaRecorder(stream);
    audioChunks = [];

    recorder.ondataavailable = e => audioChunks.push(e.data);

    recorder.onstop = saveRecording;

    recorder.start();

    timeLeft = currentTask.time || 30;
    document.getElementById("recordStatus").innerText = "Recording started.";

    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").innerText = timeLeft;

      if (timeLeft <= 0) {
        stopSpeaking();
      }
    }, 1000);

  } catch (error) {
    alert("Microphone access is required.");
  }
}

function stopSpeaking() {
  clearInterval(timerInterval);

  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
  }
}

function saveRecording() {
  const student = getCurrentStudent();
  const db = getDB();

  const blob = new Blob(audioChunks, { type: "audio/webm" });
  const audioURL = URL.createObjectURL(blob);

  document.getElementById("audioPlayer").src = audioURL;

  db.recordings.push({
    id: Date.now(),
    studentId: student.id,
    studentName: student.name,
    taskTitle: currentTask.title,
    audioURL,
    date: new Date().toLocaleString()
  });

  student.recordings++;
  student.speakingDone++;
  student.points += currentTask.points || 10;
  student.confidence += 5;
  student.status = "Active speaker";

  if (student.speakingDone >= 1 && !student.badges.includes("First Voice")) {
    student.badges.push("First Voice");
  }

  if (student.speakingDone >= 5 && !student.badges.includes("Brave Speaker")) {
    student.badges.push("Brave Speaker");
  }

  db.students = db.students.map(s => s.id === student.id ? student : s);
  saveDB(db);

  document.getElementById("recordStatus").innerText =
    `Recording saved. +${currentTask.points || 10} points.`;
}

function checkGrammar() {
  const text = document.getElementById("grammarText").value;
  const tips = grammarHelper(text);

  document.getElementById("grammarResult").innerHTML =
    tips.map(tip => `<p>• ${tip}</p>`).join("");
}

initStudentPage();
