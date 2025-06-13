function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function addNote(noteData) {
  const response = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      // Token expired or invalid
      logout();
    }
    throw new Error(error.message);
  }

  return response;
}

async function updateNote(noteData) {
  const response = await fetch(`${baseUrl}/notes`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      logout();
    }
    throw new Error(error.message);
  }

  return response;
}

async function deleteNote(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      logout();
    }
    throw new Error(error.message);
  }

  return response;
}

async function getNoteById(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      logout();
    }
    throw new Error(error.message);
  }

  return response.json();
}

async function getNotes(title) {
  let url = `${baseUrl}/notes?`;
  if (title) url += `title=${encodeURIComponent(title)}`;
  return fetch(url, { headers: getAuthHeaders() }).then((res) => res.json());
}

async function getAllTags() {
  const response = await fetch(`${baseUrl}/tags`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      logout();
    }
    throw new Error(error.message);
  }

  return response.json();
}
