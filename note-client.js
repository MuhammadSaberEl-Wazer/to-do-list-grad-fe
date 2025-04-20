// const baseUrl = "http://localhost:3000";
const baseUrl = "https://to-do-list-grad-be-production.up.railway.app";

async function addNote(noteData) {
  const response = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  return response;
}

async function updateNote(noteData) {
  console.log("11111111111111111",noteData);
  
  const response = await fetch(`${baseUrl}/notes`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  return response;
}

async function deleteNote(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "DELETE",
  });

  return response;
}

async function getNoteById(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "GET",
  });

  return response.json();
}

async function getNotes(noteTitle) {
  var url = `${baseUrl}/notes`;

  if (noteTitle) {
    url += `/?title=${noteTitle}`;
  }
  const response = await fetch(url);
  return response.json();
}
