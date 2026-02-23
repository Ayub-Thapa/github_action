const form = document.getElementById('item-form');
const itemIdInput = document.getElementById('item-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const list = document.getElementById('items-list');

async function fetchItems() {
  const res = await fetch('/api/items');
  const items = await res.json();
  renderItems(items);
}

function renderItems(items) {
  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = '<li>No items yet.</li>';
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || '')}</p>
      <div class="item-actions">
        <button data-edit="${item.id}">Edit</button>
        <button data-delete="${item.id}" class="danger">Delete</button>
      </div>
    `;
    list.appendChild(li);
  }
}

function setEditMode(item) {
  itemIdInput.value = item.id;
  titleInput.value = item.title;
  descriptionInput.value = item.description || '';
  saveBtn.textContent = 'Update';
  cancelBtn.hidden = false;
}

function resetForm() {
  itemIdInput.value = '';
  form.reset();
  saveBtn.textContent = 'Create';
  cancelBtn.hidden = true;
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value,
    description: descriptionInput.value
  };

  const id = itemIdInput.value;
  const url = id ? `/api/items/${id}` : '/api/items';
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const body = await res.json();
    alert(body.message || 'Request failed');
    return;
  }

  resetForm();
  fetchItems();
});

cancelBtn.addEventListener('click', resetForm);

list.addEventListener('click', async (event) => {
  const editId = event.target.getAttribute('data-edit');
  const deleteId = event.target.getAttribute('data-delete');

  if (editId) {
    const res = await fetch(`/api/items/${editId}`);
    const item = await res.json();
    setEditMode(item);
    return;
  }

  if (deleteId) {
    const ok = confirm('Delete this item?');
    if (!ok) return;

    await fetch(`/api/items/${deleteId}`, { method: 'DELETE' });
    fetchItems();
  }
});

fetchItems();
