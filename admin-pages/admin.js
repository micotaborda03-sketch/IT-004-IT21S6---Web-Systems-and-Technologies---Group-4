let currentPane = null;   
let editingRow = null;   

function get(id) {
  return document.getElementById(id);
}

function showModal() {
  bootstrap.Modal.getOrCreateInstance(get("addModal")).show();
}

function hideModal() {
  bootstrap.Modal.getOrCreateInstance(get("addModal")).hide();
}

function setStatus(row, status) {
  const tag = status.toLowerCase().replace(" ", "");
  row.cells[3].innerHTML = "<span class='book-status book-status-" + tag + "'>" + status + "</span>";
}

// Show "No titles in this genre yet" only when the table has no rows.
function updateEmptyMessage(pane) {
  const message = pane.querySelector(".book-empty-state");
  if (message === null) {
    return; 
  }
  const rows = pane.querySelectorAll("tbody tr");
  if (rows.length === 0) {
    message.style.display = "";
  } else {
    message.style.display = "none";
  }
}

function makeRow(title, author, year, status, callNo) {
  const row = document.createElement("tr");
  row.innerHTML =
    "<td></td><td></td><td></td><td></td><td></td>" +
    "<td><span class='book-borrower-empty'>-</span></td>" +
    "<td class='text-end book-actions'>" +
    "<i class='bi bi-eye'></i><i class='bi bi-pencil-square'></i><i class='bi bi-trash3'></i>" +
    "</td>";
  row.cells[0].textContent = title;
  row.cells[1].textContent = author;
  row.cells[2].textContent = year;
  row.cells[4].textContent = callNo;
  setStatus(row, status);
  return row;
}

function openAddForm(button) {
  currentPane = button.closest(".tab-pane");
  editingRow = null;
  get("addModalTitle").textContent = "Add book";
  get("addForm").reset();
  get("addGenre").value = currentPane.id;   // start on the tab you are in
  showModal();
}

function openEditForm(icon) {
  editingRow = icon.closest("tr");
  const cells = editingRow.cells;
  get("addTitle").value = cells[0].textContent;
  get("addAuthor").value = cells[1].textContent;
  get("addYear").value = cells[2].textContent;
  get("addStatus").value = cells[3].textContent.trim();
  get("addCall").value = cells[4].textContent;
  get("addGenre").value = icon.closest(".tab-pane").id;
  get("addModalTitle").textContent = "Edit book";
  showModal();
}

function toggleHide(icon) {
  const row = icon.closest("tr");
  row.classList.toggle("row-hidden");
  if (row.classList.contains("row-hidden")) {
    icon.className = "bi bi-eye-slash";   // crossed-out eye = hidden
  } else {
    icon.className = "bi bi-eye";
  }
}

function deleteRow(icon) {
  const row = icon.closest("tr");
  const pane = icon.closest(".tab-pane");
  const ok = confirm("Delete \"" + row.cells[0].textContent + "\"?");
  if (ok) {
    row.remove();
    updateEmptyMessage(pane);
  }
}

function saveBook(event) {
  event.preventDefault(); // stop the page from reloading

  const title = get("addTitle").value.trim();
  const author = get("addAuthor").value.trim();
  const year = get("addYear").value.trim();
  const callNo = get("addCall").value.trim();
  const status = get("addStatus").value;
  const genre = get("addGenre").value;   // same as the tab id, e.g. "fantasy"

  if (editingRow !== null) {
    // Editing: update the existing row
    editingRow.cells[0].textContent = title;
    editingRow.cells[1].textContent = author;
    editingRow.cells[2].textContent = year;
    editingRow.cells[4].textContent = callNo;
    setStatus(editingRow, status);

    // If the genre changed, move the row to the other tab
    const oldPane = editingRow.closest(".tab-pane");
    const newPane = get(genre);
    if (newPane !== oldPane) {
      newPane.querySelector("tbody").appendChild(editingRow);
      updateEmptyMessage(oldPane);
      updateEmptyMessage(newPane);
    }
    editingRow = null;
  } else {
    // Adding: add a new row to the current genre tab
    const pane = get(genre);
    pane.querySelector("tbody").appendChild(makeRow(title, author, year, status, callNo));
    updateEmptyMessage(pane);
  }
  hideModal();
  bootstrap.Tab.getOrCreateInstance(get(genre + "-tab")).show();   // switch to that tab
}

get("addForm").addEventListener("submit", saveBook);

document.addEventListener("click", function (event) {
  const clicked = event.target;

  if (clicked.classList.contains("add-btn")) {
    openAddForm(clicked);
  } else if (clicked.classList.contains("bi-pencil-square")) {
    openEditForm(clicked);
  } else if (clicked.classList.contains("bi-eye") || clicked.classList.contains("bi-eye-slash")) {
    toggleHide(clicked);
  } else if (clicked.classList.contains("bi-trash3")) {
    deleteRow(clicked);
  }
});
