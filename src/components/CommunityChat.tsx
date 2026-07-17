import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, LockKeyhole, MessageCircle, Send, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { accountName, cleanCommunityText } from '../lib/community'
import { getSupabase } from '../lib/supabase'
import './CommunityChat.css'

type ChatMessage = {
  id: number
  user_id: string
  username: string
  body: string
  created_at: string
}

type CommunityChatProps = {
  locale: Locale
  mode?: 'widget' | 'page'
}

export function CommunityChat({ locale, mode = 'page' }: CommunityChatProps) {
  const auth = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [open, setOpen] = useState(mode === 'page')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const username = useMemo(() => accountName(auth.user), [auth.user])
  const labels = locale === 'es' ? {
    title: 'Chat de la comunidad',
    live: 'Entre cuentas',
    open: 'Abrir chat',
    close: 'Cerrar chat',
    page: 'Abrir página completa',
    locked: 'Inicia sesión para leer y participar.',
    signIn: 'Entrar o crear cuenta',
    placeholder: 'Escribe un mensaje público…',
    send: 'Enviar mensaje',
    empty: 'Todavía no hay mensajes. Estrena la conversación.',
    error: 'No se ha podido conectar con el chat.',
  } : {
    title: 'Community chat',
    live: 'Account members',
    open: 'Open chat',
    close: 'Close chat',
    page: 'Open full page',
    locked: 'Sign in to read and join the conversation.',
    signIn: 'Sign in or create account',
    placeholder: 'Write a public message…',
    send: 'Send message',
    empty: 'No messages yet. Start the conversation.',
    error: 'The chat could not connect.',
  }

  const loadMessages = useCallback(async () => {
    if (!auth.user) return
    setLoading(true)
    const client = await getSupabase()
    if (!client) {
      setError(labels.error)
      setLoading(false)
      return
    }
    const { data, error: queryError } = await client
      .from('chat_messages')
      .select('id,user_id,username,body,created_at')
      .order('created_at', { ascending: false })
      .limit(mode === 'widget' ? 28 : 100)
    if (queryError) setError(labels.error)
    else {
      setError('')
      setMessages(((data ?? []) as ChatMessage[]).reverse())
    }
    setLoading(false)
  }, [auth.user, labels.error, mode])

  useEffect(() => {
    if (!auth.user) return undefined
    let channel: { unsubscribe: () => Promise<unknown> } | undefined
    let disposed = false
    void getSupabase().then((client) => {
      if (!client || disposed) return
      void loadMessages()
      channel = client
        .channel(`portfolio-chat-${mode}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
          const incoming = payload.new as ChatMessage
          setMessages((current) => {
            if (current.some((message) => message.id === incoming.id)) return current
            return [...current, incoming].slice(mode === 'widget' ? -28 : -100)
          })
        })
        .subscribe()
    })
    return () => {
      disposed = true
      if (channel) void channel.unsubscribe()
    }
  }, [auth.user, loadMessages, mode])

  useEffect(() => {
    if (!open && mode === 'widget') return
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open, mode])

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    if (!auth.user || sending) return
    const message = cleanCommunityText(body, 600)
    if (!message) return
    setSending(true)
    setError('')
    const client = await getSupabase()
    const { error: insertError } = client
      ? await client.rpc('send_chat_message', {
        message_body: message,
        display_name: username,
      })
      : { error: new Error('not_configured') }
    if (insertError) setError(labels.error)
    else setBody('')
    setSending(false)
  }

  if (mode === 'widget' && !open) {
    return (
      <button className="chat-launcher" type="button" onClick={() => setOpen(true)} aria-label={labels.open}>
        <span><MessageCircle size={17} aria-hidden="true" /><i /></span>
        <span><strong>{labels.title}</strong><small>{labels.live}</small></span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    )
  }

  return (
    <AnimatePresence initial={false}>
      <m.section
        className={`community-chat community-chat--${mode}`}
        initial={mode === 'widget' ? { opacity: 0, y: 12, scale: 0.97 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="community-chat__header">
          <span><MessageCircle size={17} aria-hidden="true" /><i /></span>
          <div><strong>{labels.title}</strong><small>{labels.live}</small></div>
          {mode === 'widget' && <Link to="/chat" aria-label={labels.page}><ArrowUpRight size={15} aria-hidden="true" /></Link>}
          {mode === 'widget' && <button type="button" onClick={() => setOpen(false)} aria-label={labels.close}><X size={15} aria-hidden="true" /></button>}
        </header>

        {!auth.user ? (
          <div className="community-chat__locked">
            <span><LockKeyhole size={24} aria-hidden="true" /></span>
            <p>{labels.locked}</p>
            <Link to="/cuenta">{labels.signIn}<ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        ) : (
          <>
            <div className="community-chat__messages" ref={scrollRef} aria-live="polite">
              {loading && messages.length === 0 ? <span className="community-chat__loading" /> : null}
              {!loading && messages.length === 0 && !error ? <p className="community-chat__empty">{labels.empty}</p> : null}
              {messages.map((message) => {
                const own = message.user_id === auth.user?.id
                return (
                  <article className={own ? 'is-own' : ''} key={message.id}>
                    <span className="community-chat__avatar">{message.username.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <header><strong>{message.username}</strong><time dateTime={message.created_at}>{new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(message.created_at))}</time></header>
                      <p>{message.body}</p>
                    </div>
                  </article>
                )
              })}
            </div>
            <form className="community-chat__form" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor={`chat-message-${mode}`}>{labels.placeholder}</label>
              <textarea id={`chat-message-${mode}`} value={body} onChange={(event) => setBody(event.target.value)} maxLength={600} rows={mode === 'widget' ? 1 : 2} placeholder={labels.placeholder} />
              <button type="submit" disabled={sending || !body.trim()} aria-label={labels.send}><Send size={16} aria-hidden="true" /></button>
            </form>
          </>
        )}
        {error && <p className="community-chat__error">{error}</p>}
      </m.section>
    </AnimatePresence>
  )
}
