import { Star } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { accountName, cleanCommunityText } from '../lib/community'
import { getSupabase } from '../lib/supabase'
import './ReviewsSection.css'

type Review = {
  id: string
  user_id: string
  username: string
  rating: 4 | 5
  body: string
  created_at: string
}

export function ReviewsSection({ locale }: { locale: Locale }) {
  const auth = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [body, setBody] = useState('')
  const [rating, setRating] = useState<4 | 5>(5)
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const username = useMemo(() => accountName(auth.user), [auth.user])
  const labels = locale === 'es' ? {
    eyebrow: 'Reseñas de la comunidad',
    title: 'Opiniones de personas que ya tienen cuenta.',
    intro: 'Un espacio breve para compartir qué te ha gustado del portfolio. Cada cuenta puede mantener una reseña.',
    great: 'Me gusta',
    excellent: 'Me encanta',
    placeholder: '¿Qué parte del portfolio te ha gustado?',
    submit: 'Publicar reseña',
    login: 'Inicia sesión para dejar tu reseña.',
    saved: 'Tu reseña se ha publicado.',
    error: 'No se ha podido guardar la reseña.',
    empty: 'Las primeras reseñas aparecerán aquí.',
  } : {
    eyebrow: 'Community reviews',
    title: 'Feedback from people with an account.',
    intro: 'A short space to share what you liked about the portfolio. Each account can keep one review.',
    great: 'I like it',
    excellent: 'I love it',
    placeholder: 'What did you enjoy about the portfolio?',
    submit: 'Publish review',
    login: 'Sign in to leave your review.',
    saved: 'Your review is now live.',
    error: 'The review could not be saved.',
    empty: 'The first reviews will appear here.',
  }

  const loadReviews = useCallback(async () => {
    const client = await getSupabase()
    if (!client) return
    const { data } = await client.from('reviews').select('id,user_id,username,rating,body,created_at').order('updated_at', { ascending: false }).limit(12)
    setReviews((data ?? []) as Review[])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadReviews() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadReviews])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!auth.user || sending) return
    const text = cleanCommunityText(body, 800)
    if (text.length < 8) return
    setSending(true)
    setNotice('')
    const client = await getSupabase()
    const { error } = client
      ? await client.from('reviews').upsert({
        user_id: auth.user.id,
        username,
        rating,
        body: text,
      }, { onConflict: 'user_id' })
      : { error: new Error('not_configured') }
    setNotice(error ? labels.error : labels.saved)
    if (!error) {
      setBody('')
      await loadReviews()
    }
    setSending(false)
  }

  return (
    <section className="section reviews-section">
      <div className="section-heading section-heading--split">
        <div><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.title}</h2></div>
        <p className="section-heading__intro">{labels.intro}</p>
      </div>
      <div className="reviews-layout">
        <div className="reviews-grid">
          {reviews.length === 0 && <p className="reviews-empty">{labels.empty}</p>}
          {reviews.map((review) => (
            <article key={review.id}>
              <header><span>{review.username.slice(0, 1).toUpperCase()}</span><strong>{review.username}</strong><span className="reviews-stars">{Array.from({ length: review.rating }, (_, index) => <Star key={index} size={12} fill="currentColor" aria-hidden="true" />)}</span></header>
              <p>{review.body}</p>
            </article>
          ))}
        </div>
        <form className="review-form" onSubmit={submit}>
          <span className="review-form__label">{auth.user ? username : labels.login}</span>
          <div className="review-form__rating">
            <button type="button" className={rating === 4 ? 'is-active' : ''} onClick={() => setRating(4)}>{labels.great}<span>★★★★</span></button>
            <button type="button" className={rating === 5 ? 'is-active' : ''} onClick={() => setRating(5)}>{labels.excellent}<span>★★★★★</span></button>
          </div>
          <label className="sr-only" htmlFor="review-body">{labels.placeholder}</label>
          <textarea id="review-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={800} rows={5} placeholder={labels.placeholder} disabled={!auth.user} />
          <button className="review-form__submit" type="submit" disabled={!auth.user || sending || body.trim().length < 8}>{labels.submit}</button>
          {notice && <p>{notice}</p>}
        </form>
      </div>
    </section>
  )
}
