<div align="center">

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Telescope.png" alt="Telescope" width="80" />

# DevOps Observability Platform

**Real-time DevOps observability platform — live metrics charts, log aggregation, and threshold alerting with Socket.IO.**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

</div>

---

## What is this?

A lightweight observability platform that gives engineering teams real-time visibility into their systems — the same pillars used by Datadog, Grafana, and New Relic.

Any service can push metrics and logs to the platform via HTTP. The dashboard updates instantly via WebSockets, and alerts fire automatically when metrics cross configured thresholds.

---

## Features

- 📊 **Live metrics charts** — real-time line charts powered by Recharts, updated via Socket.IO
- 📋 **Log aggregation** — color-coded log stream with level and service filtering
- 🚨 **Threshold alerting** — configure alerts that fire and auto-resolve based on metric values
- 🟢 **Service health** — track uptime, request counts, error rates, and response times
- ⚡ **Push-based updates** — dashboard updates instantly via WebSockets, no polling
- 🗄️ **Redis time series** — metrics stored as Redis lists with automatic expiry

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Recharts |
| Backend | Node.js, Express, TypeScript |
| Real-time | Socket.IO |
| Metrics Store | Redis (time series lists) |
| Log Store | In-memory with search |

---

## Architecture

```
Any Service
      │
      ▼
POST /metrics  →  Redis time series
POST /logs     →  In-memory log store
POST /alerts   →  Alert engine
      │
      ▼
Socket.IO broadcast
      │
      ▼
React Dashboard
(live charts, logs, alerts)
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/metrics` | Ingest a metric data point |
| GET | `/metrics/:name` | Get recent data points |
| POST | `/logs` | Ingest a log entry |
| GET | `/logs` | Query logs with filters |
| POST | `/alerts` | Create a threshold alert |
| GET | `/alerts` | List all alerts |
| POST | `/health/:service` | Report service health |
| GET | `/health/services` | Get all service health |

---

## Getting Started

```bash
git clone https://github.com/L4L4a/devops-observability.git
cd devops-observability
```

**Server:**
```bash
cd server && npm install && npm run dev
```

**Client:**
```bash
cd client && npm install && npm run dev
```

Open `http://localhost:5173` to see the dashboard.

**Send a metric:**
```bash
curl -X POST http://localhost:3001/metrics \
  -H "Content-Type: application/json" \
  -d '{"name": "cpu_usage", "value": 85, "type": "gauge"}'
```

**Create an alert:**
```bash
curl -X POST http://localhost:3001/alerts \
  -H "Content-Type: application/json" \
  -d '{"name": "High CPU", "metric": "cpu_usage", "threshold": 80, "condition": "above"}'
```

---

<div align="center">

Built by [Elvis Kenneth](https://github.com/L4L4a)

</div>