export function Monogram() {
  return (
    <div className="monogram" aria-hidden="true">
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
        <circle className="monogram__node monogram__node--one" cx="96" cy="260" r="7" />
        <circle className="monogram__node monogram__node--two" cx="424" cy="260" r="7" />
        <circle className="monogram__node monogram__node--three" cx="260" cy="28" r="5" />
        <circle className="monogram__node monogram__node--four" cx="168" cy="88" r="4" />
        <circle className="monogram__node monogram__node--five" cx="356" cy="414" r="4" />
      </svg>
      <span className="monogram__code">PS/O · ONLINE</span>
    </div>
  )
}
