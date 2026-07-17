import { useEffect, useState } from 'react'

export type HardwareTelemetry = {
  capturedAt: string
  cpu: { percent: number | null; temperature: number | null }
  gpu: { percent: number | null; temperature: number | null; name: string | null }
  memory: { percent: number | null; used: number; total: number }
  storage: { percent: number | null; used: number; total: number }
  network: { receivedPerSecond: number; sentPerSecond: number; receivedTotal: number; sentTotal: number }
}

type TelemetryState = {
  metrics: HardwareTelemetry | null
  status: 'connecting' | 'ready' | 'offline'
}

const telemetryUrl = import.meta.env.VITE_TELEMETRY_URL ?? 'http://127.0.0.1:4317/metrics'

export function useHardwareTelemetry(): TelemetryState {
  const [state, setState] = useState<TelemetryState>({ metrics: null, status: 'connecting' })

  useEffect(() => {
    let active = true
    let timer = 0
    const controller = new AbortController()

    const read = async () => {
      try {
        const response = await fetch(telemetryUrl, { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) throw new Error(`telemetry_${response.status}`)
        const metrics = await response.json() as HardwareTelemetry
        if (active) setState({ metrics, status: 'ready' })
      } catch {
        if (active) setState((current) => ({ metrics: current.metrics, status: current.metrics ? 'ready' : 'offline' }))
      } finally {
        if (active) timer = window.setTimeout(read, 5_000)
      }
    }

    void read()
    return () => {
      active = false
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [])

  return state
}
