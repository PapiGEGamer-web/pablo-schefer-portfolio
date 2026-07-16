import { useEffect, useState } from 'react'
import './EasterEggs.css'

export function EasterEggs() {
  const [message, setMessage] = useState<string | null>(null)
  const [konami, setKonami] = useState(false)

  useEffect(() => {
    let typed = ''
    let konamiIndex = 0
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        typed = `${typed}${event.key.toLowerCase()}`.slice(-4)
        if (typed === 'papi') {
          setMessage('Modo PapiGEGamer desbloqueado')
          window.setTimeout(() => setMessage(null), 2600)
        }
      }
      if (event.key === code[konamiIndex]) {
        konamiIndex += 1
        if (konamiIndex === code.length) {
          konamiIndex = 0
          setKonami(true)
          setMessage('Código secreto activado')
          window.setTimeout(() => setMessage(null), 2600)
        }
      } else if (event.key !== code[0]) konamiIndex = 0
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return <>{konami && <span className="easter-egg-field" aria-hidden="true" />}{message && <div className="easter-egg-toast" role="status">{message}</div>}</>
}
