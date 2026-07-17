import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

export function Monogram() {
  const monogramRef = useRef<HTMLDivElement>(null)

  const updatePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    const style = monogramRef.current?.style
    const factors = [[0.75, 0.38], [-0.62, -0.44], [0.26, 0.88], [-0.48, 0.7], [0.56, -0.62]]
    factors.forEach(([factorX, factorY], index) => {
      style?.setProperty(`--orbit-node-${index + 1}-x`, `${x * 18 * factorX}px`)
      style?.setProperty(`--orbit-node-${index + 1}-y`, `${y * 18 * factorY}px`)
    })
  }

  const resetPointer = () => {
    for (let index = 1; index <= 5; index += 1) {
      monogramRef.current?.style.setProperty(`--orbit-node-${index}-x`, '0px')
      monogramRef.current?.style.setProperty(`--orbit-node-${index}-y`, '0px')
    }
  }

  return (
    <div className="monogram" ref={monogramRef} onPointerMove={updatePointer} onPointerLeave={resetPointer} aria-hidden="true">
      <svg viewBox="0 0 520 520" role="img">
        <defs>
          <linearGradient id="orbit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0a24a" />
            <stop offset="0.52" stopColor="#f0a24a" stopOpacity="0.08" />
            <stop offset="1" stopColor="#81d8cc" />
          </linearGradient>
          <clipPath id="portraitClip">
            <circle cx="260" cy="260" r="132" />
          </clipPath>
        </defs>
        <circle className="monogram__orbit monogram__orbit--outer" cx="260" cy="260" r="232" />
        <circle className="monogram__orbit monogram__orbit--wide" cx="260" cy="260" r="210" />
        <circle className="monogram__orbit monogram__orbit--inner" cx="260" cy="260" r="184" />
        <circle className="monogram__orbit monogram__orbit--tight" cx="260" cy="260" r="152" />
        <path className="monogram__arc" d="M96 260a164 164 0 0 1 328 0" />
        <path className="monogram__arc monogram__arc--lower" d="M108 306a170 170 0 0 0 304 0" />
        <circle className="monogram__portrait-backdrop" cx="260" cy="260" r="140" />
        <image className="monogram__portrait" href="/media/profile/pablo-schefer-avatar.webp" x="128" y="128" width="264" height="264" preserveAspectRatio="xMidYMid slice" clipPath="url(#portraitClip)" />
        <circle className="monogram__portrait-ring" cx="260" cy="260" r="132" />
        <g className="monogram__node-shift monogram__node-shift--one"><circle className="monogram__node monogram__node--one" cx="96" cy="260" r="7" /></g>
        <g className="monogram__node-shift monogram__node-shift--two"><circle className="monogram__node monogram__node--two" cx="424" cy="260" r="7" /></g>
        <g className="monogram__node-shift monogram__node-shift--three"><circle className="monogram__node monogram__node--three" cx="260" cy="28" r="5" /></g>
        <g className="monogram__node-shift monogram__node-shift--four"><circle className="monogram__node monogram__node--four" cx="168" cy="88" r="4" /></g>
        <g className="monogram__node-shift monogram__node-shift--five"><circle className="monogram__node monogram__node--five" cx="356" cy="414" r="4" /></g>
      </svg>
      <span className="monogram__code">PS/O · ONLINE</span>
    </div>
  )
}
