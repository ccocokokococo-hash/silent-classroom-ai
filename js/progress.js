const student = getCurrentStudent();

if (!student) {
  window.location.href = "index.html";
}

document.getElementById("points").innerText = student.points;
document.getElementById("recordings").innerText = student.recordings;
document.getElementById("homework").innerText = student.homeworkDone;
document.getElementById("confidence").innerText = student.confidence + "%";

const badgeBox = document.getElementById("badges");

if (student.badges.length === 0) {
  badgeBox.innerHTML = "<p>No badges yet. Complete speaking tasks to unlock badges.</p>";
} else {
  badgeBox.innerHTML = student.badges
    .map(badge => `<span class="badge big-badge">${badge}</span>`)
    .join("");
}
