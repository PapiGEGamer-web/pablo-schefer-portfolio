import { Link } from 'react-router-dom'
import type { SiteCopy } from '../content'

export function SiteFooter({ content }: { content: SiteCopy }) {
  return (
    <footer className="site-footer">
      <Link className="brand" to="/" aria-label={content.common.homeLabel}>
        <span className="brand__mark">P</span>
        <span className="brand__name">Pablo Schefer</span>
      </Link>
      <p>© {new Date().getFullYear()} · {content.footer}</p>
      <Link to="/" aria-label={content.common.backToTopLabel}>↑ Top</Link>
    </footer>
  )
}
