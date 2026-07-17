import { MessageCircle } from 'lucide-react'
import type { Locale } from '../content'
import { CommunityChat } from '../components/CommunityChat'
import './ChatPage.css'

export function ChatPage({ locale }: { locale: Locale }) {
  const labels = locale === 'es' ? {
    eyebrow: 'Cuentas · Conversación pública',
    title: 'Un chat para la gente que vuelve.',
    intro: 'Los mensajes solo son visibles para personas con una cuenta. La conversación se actualiza en directo y mantiene el mismo diseño sobrio del portfolio.',
  } : {
    eyebrow: 'Accounts · Public conversation',
    title: 'A chat for people who come back.',
    intro: 'Messages are only visible to people with an account. The conversation updates live and follows the same restrained visual system as the portfolio.',
  }
  return (
    <div className="chat-page">
      <section className="page-hero chat-page__hero">
        <div className="page-hero__copy">
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
        </div>
        <div className="chat-page__signal" aria-hidden="true"><MessageCircle size={62} /><i /><i /><i /></div>
      </section>
      <section className="section chat-page__room"><CommunityChat locale={locale} /></section>
    </div>
  )
}
