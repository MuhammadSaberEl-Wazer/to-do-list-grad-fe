// const { log } = require("console");

let selectedTagsArray = [];
let editSelectedTagsArray = [];

function fillTagsDropdown(selectId = "tagSelect") {
  const tagSelect = document.getElementById(selectId);
  tagSelect.innerHTML = "";

  cachedTags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag._id;
    option.textContent = tag.name;
    tagSelect.appendChild(option);
  });
}

function openAddModal() {
  var modal = document.getElementById("addNoteModal");
  var closeSpan = document.getElementById("closeAdd");
  var cancelButton = document.getElementById("cancelAddNoteBtn");

  fillTagsDropdown("tagSelect"); // لمودال الإضافة
  clearAddModal();
  modal.style.display = "block";

  closeSpan.onclick = () => {
    modal.style.display = "none";
  };

  cancelButton.onclick = () => {
    modal.style.display = "none";
  };
}

function clearAddModal() {
  document.getElementById("addTitle").value = "";
  document.getElementById("addContent").value = "";
  document.getElementById("addError").innerHTML = "";
}

function saveNewNote() {
  var titleStr = document.getElementById("addTitle").value;
  var contentStr = document.getElementById("addContent").value;
  const selectedTags = getSelectedTagIds(); // <-- هنا الاستخدام

  const noteData = {
    title: titleStr,
    content: contentStr,
    tags: selectedTagsArray,
  };
  addNote(noteData)
    .then((response) => {
      if (response.ok) {
        var modal = document.getElementById("addNoteModal");
        modal.style.display = "none";
        response.json().then((json) => {
          var newNodeId = json["_id"];
          updateNotesTable(newNodeId);
        });
      } else {
        response.text().then((error) => {
          document.getElementById("addError").innerHTML = error;
        });
      }
    })
    .catch((error) => {
      document.getElementById("addError").innerHTML = error;
    });
}

function fillTagsDropdownEdit(selectId) {
  const tagSelect = document.getElementById(selectId);
  tagSelect.innerHTML = "";
  cachedTags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag._id;
    option.textContent = tag.name;
    tagSelect.appendChild(option);
  });
}

function openEditModal(noteId) {
  var modal = document.getElementById("editNoteModal");
  modal.style.display = "block"; // أظهر المودال أولاً

  if (cachedTags.length === 0) {
    getAllTags().then((tags) => {
      cachedTags = tags;
      fillTagsDropdown("editTagSelect");
      setupEditModal(noteId);
    });
  } else {
    fillTagsDropdownEdit("editTagSelect");
    setupEditModal(noteId);
  }
}

async function setupEditModal(noteId) {
  var modal = document.getElementById("editNoteModal");
  await getNoteById(noteId).then((note) => {
    editSelectedTagsArray = (note.tags || []).map(
      (tagId) => tagId._id || tagId
    );
    updateEditSelectedTagsBox();
    const tagSelect = document.getElementById("editTagSelect");
    Array.from(tagSelect.options).forEach((option) => {
      option.selected = editSelectedTagsArray.includes(option.value);
    });
    document.getElementById("editTitle").value = note["title"];
    document.getElementById("editContent").value = note["content"];
    modal.setAttribute("noteid", note._id);
  });
  modal.style.display = "block";

  // ربط زر الإغلاق
  var closeSpan = document.getElementById("closeEdit");
  if (closeSpan) {
    closeSpan.onclick = function () {
      modal.style.display = "none";
    };
  }
  // ربط زر الإلغاء
  var cancelButton = document.getElementById("cancelEditNoteBtn");
  if (cancelButton) {
    cancelButton.onclick = function () {
      modal.style.display = "none";
    };
  }
}

function saveEditNote() {
  var modal = document.getElementById("editNoteModal");
  const noteId = modal.getAttribute("noteid");
  const titleStr = document.getElementById("editTitle").value;
  const contentStr = document.getElementById("editContent").value;
  const selectedTags = getSelectedTagIds(); // <-- هنا الاستخدام

  const noteData = {
    _id: noteId,
    title: titleStr,
    content: contentStr,
    tags: editSelectedTagsArray,
  };
  updateNote(noteData)
    .then((response) => {
      if (response.ok) {
        var modal = document.getElementById("editNoteModal");
        modal.style.display = "none";
        updateNotesTable(noteId);
      } else {
        response.text().then((error) => {
          document.getElementById("editError").innerHTML = error;
        });
      }
    })
    .catch((error) => {
      document.getElementById("editError").innerHTML = error;
    });
}

function updateSelectedTagsBox() {
  const selectedTagsDiv = document.getElementById("selectedTags");
  selectedTagsDiv.innerHTML = "";

  selectedTagsArray.forEach((tagId) => {
    const tag = cachedTags.find((t) => t._id === tagId);
    if (tag) {
      const tagDiv = document.createElement("div");
      tagDiv.className = "tag-chip";
      tagDiv.textContent = tag.name;

      // تطبيق الألوان حسب لون التاج
      tagDiv.style.border = `1.5px solid ${tag.color}`;
      tagDiv.style.color = tag.color;
      tagDiv.style.background = hexToRgba(tag.color, 0.15);

      // زر حذف
      const removeBtn = document.createElement("span");
      removeBtn.textContent = " ×";
      removeBtn.style.cursor = "pointer";
      removeBtn.style.color = tag.color;
      removeBtn.onclick = () => {
        if (confirm("هل أنت متأكد أنك تريد حذف هذا الوسم؟")) {
          selectedTagsArray = selectedTagsArray.filter((id) => id !== tagId);
          updateSelectedTagsBox();
        }
      };

      tagDiv.appendChild(removeBtn);
      selectedTagsDiv.appendChild(tagDiv);
    }
  });
}

// دالة لتحويل HEX إلى RGBA مع شفافية
function hexToRgba(hex, alpha) {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ضع الدالة هنا
function getSelectedTagIds() {
  const tagSelect = document.getElementById("tagSelect");
  return Array.from(tagSelect.selectedOptions).map((opt) => opt.value);
}

// حدث عند تغيير الاختيار
document.getElementById("tagSelect").onchange = updateSelectedTagsBox;

const tagSelect = document.getElementById("tagSelect");

tagSelect.onchange = function () {
  const selectedId = tagSelect.value;
  if (!selectedId) return;
  if (selectedTagsArray.includes(selectedId)) {
    selectedTagsArray = selectedTagsArray.filter((id) => id !== selectedId);
    tagSelect.value =
      selectedTagsArray.length > 0
        ? selectedTagsArray[selectedTagsArray.length - 1]
        : "";
  } else {
    selectedTagsArray.push(selectedId);
    tagSelect.value = selectedId;
  }
  updateSelectedTagsBox();
};

function updateEditSelectedTagsBox() {
  const selectedTagsDiv = document.getElementById("editSelectedTags");
  selectedTagsDiv.innerHTML = "";

  editSelectedTagsArray.forEach((tagId) => {
    const tag = cachedTags.find((t) => t._id === tagId);
    if (tag) {
      const tagDiv = document.createElement("div");
      tagDiv.className = "tag-chip";
      tagDiv.textContent = tag.name;
      tagDiv.style.border = `1.5px solid ${tag.color}`;
      tagDiv.style.color = tag.color;
      tagDiv.style.background = hexToRgba(tag.color, 0.15);

      // زر حذف
      const removeBtn = document.createElement("span");
      removeBtn.textContent = " ×";
      removeBtn.style.cursor = "pointer";
      removeBtn.style.color = tag.color;
      removeBtn.onclick = () => {
        if (confirm("هل أنت متأكد أنك تريد حذف هذا الوسم؟")) {
          editSelectedTagsArray = editSelectedTagsArray.filter(
            (id) => id !== tagId
          );
          updateEditSelectedTagsBox();
          // حدث الـ select أيضاً
          const tagSelect = document.getElementById("editTagSelect");
          Array.from(tagSelect.options).forEach((option) => {
            if (option.value === tagId) option.selected = false;
          });
        }
      };

      tagDiv.appendChild(removeBtn);
      selectedTagsDiv.appendChild(tagDiv);
    }
  });
}

document.getElementById("editTagSelect").onchange = function () {
  const tagSelect = document.getElementById("editTagSelect");
  const selectedId = tagSelect.value;
  if (!selectedId) return;
  if (editSelectedTagsArray.includes(selectedId)) {
    editSelectedTagsArray = editSelectedTagsArray.filter(
      (id) => id !== selectedId
    );
    tagSelect.value =
      editSelectedTagsArray.length > 0
        ? editSelectedTagsArray[editSelectedTagsArray.length - 1]
        : "";
  } else {
    editSelectedTagsArray.push(selectedId);
    tagSelect.value = selectedId;
  }
  updateEditSelectedTagsBox();
};

/**
 * عرض الوسوم الملونة في أي عنصر
 * @param {Array} tagIds - مصفوفة IDs أو كائنات tags
 * @param {string} containerId - الـ id الخاص بالعنصر الذي سيتم عرض الوسوم فيه
 * @param {Array} tagsArray - مصفوفة جميع الوسوم (عادة cachedTags)
 */
function renderTags(tagIds, containerId, tagsArray) {
  const tagsDiv = document.getElementById(containerId);

  console.log("tagsArray", tagsArray, "IDS", tagIds);

  if (!tagsDiv) return;
  tagsDiv.innerHTML = "";
  tagIds.forEach((tagId) => {
    // يدعم أن يكون tagId كائن أو ID فقط
    const id = tagId._id || tagId;
    const tag = tagsArray.find((t) => t._id === id);
    if (tag) {
      const tagDiv = document.createElement("div");
      tagDiv.className = "tag-chip";
      tagDiv.textContent = tag.name;
      tagDiv.style.border = `1.5px solid ${tag.color}`;
      tagDiv.style.color = tag.color;
      tagDiv.style.background = hexToRgba(tag.color, 0.15);
      tagDiv.style.display = "inline-block";
      tagDiv.style.margin = "2px";
      tagDiv.style.pointerEvents = "none"; // يمنع التفاعل
      tagDiv.style.display = "flex"; // يمنع التفاعل
      tagsDiv.appendChild(tagDiv);
    }
  });
}

function showViewTags(tagIds) {
  const tagsDiv = document.getElementById("viewTags");
  tagsDiv.innerHTML = "";
  tagIds.forEach((tagId) => {
    const tag = cachedTags.find((t) => t._id === (tagId._id || tagId));
    if (tag) {
      const tagDiv = document.createElement("div");
      tagDiv.className = "tag-chip";
      tagDiv.textContent = tag.name;
      tagDiv.style.border = `1.5px solid ${tag.color}`;
      tagDiv.style.color = tag.color;
      tagDiv.style.background = hexToRgba(tag.color, 0.15);
      tagDiv.style.display = "inline-block";
      tagDiv.style.margin = "2px";
      tagDiv.style.pointerEvents = "none"; // يمنع التفاعل
      tagsDiv.appendChild(tagDiv);
    }
  });
}

// دالة تحويل HEX إلى RGBA
function hexToRgba(hex, alpha) {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// if (cachedTags.length === 0) {
//   getAllTags().then((tags) => {
//     cachedTags = tags;
//     fillTagsDropdown("tagSelect"); // لمودال الإضافة
//   });
// }

function openViewModal(noteId) {
  console.log("noteId", noteId);

  var modal = document.getElementById("viewNoteModal");

  function showNote() {
    getNoteById(noteId).then((note) => {
      document.getElementById("viewTitle").value = note.title;
      document.getElementById("viewContent").value = note.content;
      document.getElementById("viewDate").value = formatDateTime(
        note.updateDate
      );
      // استخدم الدالة الموحدة هنا
      console.log("note.tags", note.tags);

      renderTags(note.tags || [], "viewTags", cachedTags);
    });
    modal.style.display = "block";
  }

  if (cachedTags.length === 0) {
    getAllTags().then((tags) => {
      cachedTags = tags;
      showNote();
    });
  } else {
    showNote();
  }
}

// عند تحميل الصفحة أو بعد جلب الوسوم:
if (cachedTags.length === 0) {
  getAllTags().then((tags) => {
    cachedTags = tags;
  });
}

function searchNotes() {
  const searchTitle = document.getElementById("searchInput").value;
  updateNotesTable(undefined, searchTitle, filterTagId);
}

window.onload = function () {
  updateNotesTable();
  // جلب الوسوم وملء فلتر التاجز
  getAllTags().then((tags) => {
    cachedTags = tags;
  });
};
