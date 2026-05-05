const db = getDB();
const box = document.getElementById("leaderboard");

const sorted = db.students.sort((a, b) => b.points - a.points);

if (sorted.length === 0) {
  box.innerHTML = "<p>No students yet.</p>";
} else {
  sorted.forEach((student, index) => {
    box.innerHTML += `
      <div class="rank-card">
        <div>
          <b>#${index + 1}</b>
          <span>${student.name}</span>
        </div>
        <strong>${student.points} pts</strong>
      </div>
    `;
  });
}
