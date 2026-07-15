import type { MouseEvent, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type MagneticLinkProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
  external?: boolean
  className?: string
}

export function MagneticLink({ href, children, variant = 'solid', external = false, className = '' }: MagneticLinkProps) {
  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const element = event.currentTarget
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.18
    element.style.setProperty('--magnetic-x', `${x}px`)
    element.style.setProperty('--magnetic-y', `${y}px`)
  }

  const onLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--magnetic-x', '0px')
    event.currentTarget.style.setProperty('--magnetic-y', '0px')
  }

  return (
    <a
      className={`magnetic-link magnetic-link--${variant} ${className}`}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span>{children}</span>
      <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" />
    </a>
  )
}
