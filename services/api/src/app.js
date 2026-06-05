const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const tasksCreatedTotal = new client.Counter({
  name: 'tasks_created_total',
  help: 'Total tasks created',
  registers: [register]
});

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
    logger.info({ service: 'api', method: req.method, path: req.path, status: res.statusCode });
  });
  next();
});

let tasks = [];
let nextId = 1;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api', timestamp: new Date().toISOString() });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/tasks', (req, res) => {
  res.json({ tasks, count: tasks.length });
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = {
    id: nextId++,
    title,
    description: description || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  tasksCreatedTotal.inc();
  logger.info({ service: 'api', msg: 'task created', taskId: task.id });
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'task not found' });
  task.status = req.body.status || task.status;
  task.title = req.body.title || task.title;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'task not found' });
  tasks.splice(idx, 1);
  res.json({ message: 'deleted' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info({ service: 'api', msg: `listening on port ${PORT}` });
});

module.exports = app;
