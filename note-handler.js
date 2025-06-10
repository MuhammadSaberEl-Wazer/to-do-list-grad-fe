function formatDateTime(isoString) {
  const date = new Date(isoString);
  // Format: YYYY-MM-DD HH:mm
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function updateNotesTable(noteId, noteTitle) {
  var table = document.getElementById("notes-table");
  var rowCount = table.rows.length;
  while (--rowCount) {
    table.deleteRow(rowCount);
  }

  getNotes(noteTitle)
    .then((data) => {
      data.forEach((note) => {
        var row = table.insertRow(1);
        var idAttribute = document.createAttribute("id");
        idAttribute.value = note["_id"];
        row.setAttributeNode(idAttribute);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = note["title"];
        cell2.innerHTML = note["content"];
        cell3.innerHTML = formatDateTime(note["updateDate"]);
        if (note["updateDate"] == undefined) {
          cell3.innerHTML = "--";
        }
        cell4.innerHTML = `<a onclick="event.stopPropagation();openEditModal('${note["_id"]}')" href="#"><img src="images/edit.png" style="width: 22px"></a>
        <a href="#" onclick="event.stopPropagation();confirmDeleteNote('${note["_id"]}')"><img src="images/delete.png" style="width: 22px"></a>
        `;

        // Make the row clickable to show details modal (except for the options column)
        row.style.cursor = "pointer";
        row.onclick = function (e) {
          // Prevent modal if clicking on the options (edit/delete)
          if (e.target.closest('a')) return;
          showViewNoteModal({
            title: note["title"],
            content: note["content"],
            updatedAt: note["updateDate"] || note["updatedAt"] || "",
          });
        };
      });
    })
    .then(() => {
      if (noteId) {
        var row = document.getElementById(noteId);
        row.setAttribute("style", "animation: new-row 5s;");
      }
    });
}

function searchNotes() {
  const searchTitle = document.getElementById("searchInput").value;
  updateNotesTable(undefined, searchTitle);
}

function confirmDeleteNote(noteId) {
  var action = confirm("Are you sure you want to delete this note?");
  if (action) {
    deleteNote(noteId).then(() => {
      updateNotesTable();
    });
  }
}

// Show modal with note details
function showViewNoteModal(note) {
  document.getElementById("viewTitle").value = note.title;
  document.getElementById("viewContent").value = note.content;
  document.getElementById("viewDate").value = formatDateTime(note.updatedAt);
  document.getElementById("viewNoteModal").style.display = "block";
}

// Close modal logic
document.getElementById("closeView").onclick = function () {
  document.getElementById("viewNoteModal").style.display = "none";
};
document.getElementById("closeViewBtn").onclick = function () {
  document.getElementById("viewNoteModal").style.display = "none";
};

// Optional: Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("viewNoteModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Example rendering logic for each note row:
function renderNoteRow(note) {
  const table = document.getElementById("notes-table");
  const row = table.insertRow(-1);
  row.innerHTML = `
    <td>${note.title}</td>
    <td>${note.content}</td>
    <td>${formatDateTime(note.updatedAt)}</td>
    <td><!-- options --></td>
  `;
  row.style.cursor = "pointer";
  row.onclick = function () {
    showViewNoteModal(note);
  };
}
