function loadTeacherDashboard() {
  const db = getDB();

  const table = document.getElementById("studentsTable");
  const select = document.getElementById("studentSelect");
  const intervention = document.getElementById("interventionList");

  table.innerHTML = "";
  select.innerHTML = "";
  intervention.innerHTML = "";

  let supportCount = 0;
  let totalRecordings = 0;

  db.students.forEach(student => {
    totalRecordings += student.recordings;

    if (student.level === "support" || student.recordings === 0) {
      supportCount++;
      intervention.innerHTML += `
        <div class="alert">
          <b>${student.name}</b><br>
          Needs more individual support or speaking activation.
        </div>
      `;
    }

    select.innerHTML += `<option value="${student.id}">${student.name}</option>`;

    const statusClass =
      student.level === "support" || student.recordings === 0 ? "danger" : "success";

    table.innerHTML += `
      <tr>
        <td>${student.name}</td>
        <td>${student.grade}</td>
        <td>${student.level}</td>
        <td>${student.points}</td>
        <td>${student.recordings}</td>
        <td>${student.homeworkDone}</td>
        <td><span class="pill ${statusClass}">${student.status}</span></td>
      </tr>
    `;
  });

  document.getElementById("totalStudents").innerText = db.students.length;
  document.getElementById("needSupport").innerText = supportCount;
  document.getElementById("totalRecordings").innerText = totalRecordings;
}

function assignTask() {
  const id = Number(document.getElementById("studentSelect").value);
  const title = document.getElementById("customTitle").value.trim();
  const instruction = document.getElementById("customInstruction").value.trim();
  const example = document.getElementById("customExample").value.trim();
  const time = Number(document.getElementById("customTime").value);

  if (!title || !instruction) {
    alert("Write task title and instruction.");
    return;
  }

  const db = getDB();

  db.students = db.students.map(student => {
    if (student.id === id) {
      student.assignedTask = {
        id: "CUSTOM_" + Date.now(),
        type: "speaking",
        title,
        instruction,
        example,
        time,
        points: 20,
        sentenceStarters: [
          "I think...",
          "In my opinion...",
          "I can say that..."
        ]
      };
      student.status = "Custom task assigned";
    }

    return student;
  });

  saveDB(db);
  alert("Task assigned successfully.");
  loadTeacherDashboard();
}

loadTeacherDashboard();
