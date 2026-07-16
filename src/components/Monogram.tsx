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
            <circle cx="260" cy="260" r="112" />
          </clipPath>
        </defs>
        <circle className="monogram__orbit monogram__orbit--outer" cx="260" cy="260" r="232" />
        <circle className="monogram__orbit monogram__orbit--inner" cx="260" cy="260" r="184" />
        <path className="monogram__arc" d="M96 260a164 164 0 0 1 328 0" />
        <circle className="monogram__portrait-backdrop" cx="260" cy="260" r="120" />
        <image className="monogram__portrait" href="/media/profile/pablo-schefer-avatar.webp" x="148" y="148" width="224" height="224" preserveAspectRatio="xMidYMid slice" clipPath="url(#portraitClip)" />
        <circle className="monogram__portrait-ring" cx="260" cy="260" r="112" />
        <circle className="monogram__node monogram__node--one" cx="96" cy="260" r="7" />
        <circle className="monogram__node monogram__node--two" cx="424" cy="260" r="7" />
        <circle className="monogram__node monogram__node--three" cx="260" cy="28" r="5" />
      </svg>
      <span className="monogram__code">PS/O · ONLINE</span>
    </div>
  )
}
