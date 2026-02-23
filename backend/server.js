const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const dataFile = path.join(__dirname, 'data.json');

app.use(express.json());

function readData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ items: [] }, null, 2));
  }
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/items', (_req, res) => {
  const data = readData();
  res.json(data.items);
});

app.get('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readData();
  const item = data.items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json(item);
});

app.post('/api/items', (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'Title is required' });
  }

  const data = readData();
  const nextId = data.items.length ? Math.max(...data.items.map((i) => i.id)) + 1 : 1;

  const newItem = {
    id: nextId,
    title: title.trim(),
    description: (description || '').toString().trim(),
    createdAt: new Date().toISOString()
  };

  data.items.push(newItem);
  writeData(data);

  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'Title is required' });
  }

  const data = readData();
  const index = data.items.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  data.items[index] = {
    ...data.items[index],
    title: title.trim(),
    description: (description || '').toString().trim(),
    updatedAt: new Date().toISOString()
  };

  writeData(data);
  res.json(data.items[index]);
});

app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readData();
  const index = data.items.findIndex((i) => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const [deleted] = data.items.splice(index, 1);
  writeData(data);

  res.json({ message: 'Item deleted', item: deleted });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
