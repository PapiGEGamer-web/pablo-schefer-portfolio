import type { MouseEvent, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

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

  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" />
    </>
  )
  const classes = `magnetic-link magnetic-link--${variant} ${className}`

  if (!external && href.startsWith('/')) {
    return (
      <Link className={classes} to={href} onMouseMove={onMove} onMouseLeave={onLeave}>
        {content}
      </Link>
    )
  }

  return (
    <a className={classes} href={href} onMouseMove={onMove} onMouseLeave={onLeave} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {content}
    </a>
  )
}
