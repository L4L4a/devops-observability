import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectRedis, recordMetric, getMetric, getMetricNames, updateServiceHealth, getServiceHealth } from './metrics';
import { addLog, getLogs, getServices } from './logs';
import { createAlert, getAlerts, deleteAlert, checkAlerts } from './alerts';
import { LogLevel } from './types';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ingest a metric from any service
app.post('/metrics', async (req, res) => {
  const { name, value, type = 'gauge', labels = {} } = req.body;
  if (!name || value === undefined) {
    res.status(400).json({ error: 'name and value are required' });
    return;
  }

  const metric = { name, value, type, labels, timestamp: new Date().toISOString() };
  await recordMetric(metric);

  // check if any alerts should fire
  const triggered = checkAlerts(metric);

  // push to dashboard in real time via socket
  io.emit('metric', metric);
  if (triggered.length > 0) {
    io.emit('alerts', triggered);
  }

  res.status(201).json({ metric, triggeredAlerts: triggered });
});

// get recent data points for a metric
app.get('/metrics/:name', async (req, res) => {
  const data = await getMetric(req.params.name, parseInt(req.query.limit as string) || 50);
  res.json(data);
});

// list all metric names
app.get('/metrics', async (req, res) => {
  const names = await getMetricNames();
  res.json(names);
});

// ingest a log entry
app.post('/logs', (req, res) => {
  const { level, message, service, metadata } = req.body;
  if (!level || !message || !service) {
    res.status(400).json({ error: 'level, message, and service are required' });
    return;
  }

  const entry = addLog(level as LogLevel, message, service, metadata);
  io.emit('log', entry);
  res.status(201).json(entry);
});

// query logs with filters
app.get('/logs', (req, res) => {
  const { level, service, search, limit } = req.query;
  const logs = getLogs({
    level: level as LogLevel,
    service: service as string,
    search: search as string,
    limit: limit ? parseInt(limit as string) : 100,
  });
  res.json(logs);
});

app.get('/logs/services', (req, res) => {
  res.json(getServices());
});

// service health
app.post('/health/:service', async (req, res) => {
  const { status, requestCount, errorCount, avgResponseTime } = req.body;
  const health = {
    name: req.params.service,
    status,
    lastSeen: new Date().toISOString(),
    requestCount,
    errorCount,
    avgResponseTime,
  };
  await updateServiceHealth(health);
  io.emit('health', health);
  res.status(201).json(health);
});

app.get('/health/services', async (req, res) => {
  const services = await getServiceHealth();
  res.json(services);
});

// alerts
app.post('/alerts', (req, res) => {
  const { name, metric, threshold, condition } = req.body;
  if (!name || !metric || threshold === undefined || !condition) {
    res.status(400).json({ error: 'name, metric, threshold, and condition are required' });
    return;
  }
  const alert = createAlert(name, metric, threshold, condition);
  res.status(201).json(alert);
});

app.get('/alerts', (req, res) => {
  res.json(getAlerts());
});

app.delete('/alerts/:id', (req, res) => {
  const deleted = deleteAlert(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'alert not found' });
    return;
  }
  res.json({ message: 'alert deleted' });
});

const PORT = process.env.PORT || 3001;

async function start() {
  await connectRedis();
  httpServer.listen(PORT, () => {
    console.log(`observability platform running on port ${PORT}`);
  });
}

start();