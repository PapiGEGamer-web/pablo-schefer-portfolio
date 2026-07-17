/**
 * Local telemetry agent. Run on the PC whose metrics should appear in the portfolio:
 *   pnpm telemetry:start
 *
 * It deliberately binds to loopback only and keeps a rolling SQLite history locally.
 */
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import si from 'systeminformation'

const host = process.env.TELEMETRY_HOST ?? '127.0.0.1'
const port = Number(process.env.TELEMETRY_PORT ?? 4317)
const dataDir = path.resolve(process.cwd(), '.telemetry')
mkdirSync(dataDir, { recursive: true })
const database = new DatabaseSync(path.join(dataDir, 'metrics.sqlite'))
database.exec(`
  CREATE TABLE IF NOT EXISTS samples (
    captured_at TEXT NOT NULL,
    cpu_percent REAL,
    cpu_temperature REAL,
    gpu_percent REAL,
    gpu_temperature REAL,
    memory_percent REAL,
    memory_used INTEGER,
    memory_total INTEGER,
    storage_percent REAL,
    storage_used INTEGER,
    storage_total INTEGER,
    received_per_second REAL,
    sent_per_second REAL,
    received_total INTEGER,
    sent_total INTEGER
  );
  CREATE INDEX IF NOT EXISTS samples_captured_at_idx ON samples(captured_at);
`)
const insert = database.prepare(`INSERT INTO samples VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

let latest = null
let sampling = false

const asNumber = (value) => Number.isFinite(value) ? Number(value) : null
const sum = (values, key) => values.reduce((total, value) => total + (Number(value[key]) || 0), 0)

async function sample() {
  if (sampling) return latest
  sampling = true
  try {
    const [load, temperature, graphics, memory, filesystems, networks] = await Promise.all([
      si.currentLoad(), si.cpuTemperature(), si.graphics(), si.mem(), si.fsSize(), si.networkStats(),
    ])
    const drives = filesystems.filter((entry) => entry.size > 0 && !entry.fs.startsWith('tmpfs'))
    const storageTotal = sum(drives, 'size')
    const storageUsed = sum(drives, 'used')
    const gpu = graphics.controllers.find((controller) => controller.utilizationGpu != null) ?? graphics.controllers[0]
    const receivedPerSecond = sum(networks, 'rx_sec')
    const sentPerSecond = sum(networks, 'tx_sec')
    const receivedTotal = sum(networks, 'rx_bytes')
    const sentTotal = sum(networks, 'tx_bytes')
    latest = {
      capturedAt: new Date().toISOString(),
      cpu: { percent: asNumber(load.currentLoad), temperature: asNumber(temperature.main) },
      gpu: { percent: asNumber(gpu?.utilizationGpu), temperature: asNumber(gpu?.temperatureGpu), name: gpu?.model ?? null },
      memory: { percent: memory.total ? (memory.used / memory.total) * 100 : null, used: memory.used, total: memory.total },
      storage: { percent: storageTotal ? (storageUsed / storageTotal) * 100 : null, used: storageUsed, total: storageTotal },
      network: { receivedPerSecond, sentPerSecond, receivedTotal, sentTotal },
    }
    insert.run(
      latest.capturedAt, latest.cpu.percent, latest.cpu.temperature, latest.gpu.percent, latest.gpu.temperature,
      latest.memory.percent, latest.memory.used, latest.memory.total, latest.storage.percent, latest.storage.used, latest.storage.total,
      receivedPerSecond, sentPerSecond, receivedTotal, sentTotal,
    )
    // Keep the local database bounded to roughly one month at five-second sampling.
    database.prepare("DELETE FROM samples WHERE captured_at < datetime('now', '-31 days')").run()
    return latest
  } catch (error) {
    console.error('Telemetry sample failed:', error instanceof Error ? error.message : error)
    return latest
  } finally {
    sampling = false
  }
}

await sample()
setInterval(() => { void sample() }, 5_000).unref()

http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'https://pablo-schefer.vercel.app')
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Access-Control-Allow-Private-Network', 'true')
  response.setHeader('Cache-Control', 'no-store')
  if (request.method === 'OPTIONS') return response.writeHead(204).end()
  if (request.method !== 'GET' || request.url !== '/metrics') return response.writeHead(404).end()
  const metrics = await sample()
  response.writeHead(metrics ? 200 : 503, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(metrics ?? { error: 'unavailable' }))
}).listen(port, host, () => console.log(`Portfolio telemetry agent listening at http://${host}:${port}/metrics on ${os.hostname()}`))
