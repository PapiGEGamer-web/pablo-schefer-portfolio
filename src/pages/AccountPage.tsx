import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, KeyRound, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import './AccountPage.css'

type Mode = 'login' | 'register' | 'verify'
const ownerEmail = 'pablopme41@gmail.com'

function cleanUsername(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').slice(0, 32)
}

function displayNameFor(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  const metadata = user.user_metadata as Record<string, unknown>
  const username = typeof metadata.username === 'string' ? cleanUsername(metadata.username) : ''
  const displayName = typeof metadata.display_name === 'string' ? cleanUsername(metadata.display_name) : ''
  if (username) return username
  if (displayName) return displayName
  if (user.email?.toLowerCase() === ownerEmail) return 'Owner'
  return ''
}

function messageFor(error: unknown, locale: Locale) {
  const text = error instanceof Error ? error.message : ''
  if (text === 'auth_not_configured') return locale === 'es' ? 'El servicio de cuentas todavía no está conectado.' : 'The account service is not connected yet.'
  if (/invalid login credentials/i.test(text)) return locale === 'es' ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.'
  if (/invalid_email/i.test(text)) return locale === 'es' ? 'Introduce un correo válido.' : 'Enter a valid email address.'
  if (/weak_password/i.test(text)) return locale === 'es' ? 'La contraseña debe tener al menos 12 caracteres.' : 'Password must be at least 12 characters.'
  if (/token.*expired|expired.*token|invalid.*token/i.test(text)) return locale === 'es' ? 'El código es incorrecto o ha caducado.' : 'The code is invalid or has expired.'
  if (/rate limit/i.test(text)) return locale === 'es' ? 'Demasiados intentos. Espera un momento.' : 'Too many attempts. Please wait a moment.'
  return text || (locale === 'es' ? 'No se ha podido completar la operación.' : 'The operation could not be completed.')
}

export function AccountPage({ locale }: { locale: Locale }) {
  const auth = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const labels = locale === 'es' ? {
    eyebrow: 'Cuenta · Acceso seguro', title: 'Tu espacio dentro de la web.', intro: 'Regístrate con correo y contraseña. Antes de crear la cuenta tendrás que introducir el código de ocho dígitos que recibirás por email.',
    login: 'Iniciar sesión', register: 'Crear cuenta', verify: 'Verificar correo', email: 'Correo electrónico', username: 'Nombre de usuario', password: 'Contraseña', code: 'Código de ocho dígitos',
    send: 'Enviar código', enter: 'Entrar', confirm: 'Verificar y crear cuenta', resend: 'Reenviar código', logout: 'Cerrar sesión', account: 'Sesión iniciada',
    verified: 'Correo verificado', security: 'Sesión protegida y persistente', switchRegister: '¿No tienes cuenta? Regístrate', switchLogin: '¿Ya tienes cuenta? Inicia sesión',
    sent: 'Código enviado. Revisa también la carpeta de spam.', missing: 'Autenticación pendiente de configuración', missingBody: 'La interfaz ya está preparada, pero faltan las variables públicas del proyecto Supabase en Vercel para enviar códigos y guardar cuentas reales.',
    usernamePlaceholder: 'Owner, PapiGEGamer, Pablo...', usernameRequired: 'El nombre de usuario debe tener al menos 3 caracteres.', saveUsername: 'Guardar nombre', profileReady: 'Perfil actualizado.',
  } : {
    eyebrow: 'Account · Secure access', title: 'Your space inside the website.', intro: 'Register with email and password. Before the account is created, enter the eight-digit code sent to your inbox.',
    login: 'Sign in', register: 'Create account', verify: 'Verify email', email: 'Email address', username: 'Username', password: 'Password', code: 'Eight-digit code',
    send: 'Send code', enter: 'Sign in', confirm: 'Verify and create account', resend: 'Resend code', logout: 'Sign out', account: 'Signed in',
    verified: 'Email verified', security: 'Protected persistent session', switchRegister: 'No account yet? Register', switchLogin: 'Already registered? Sign in',
    sent: 'Code sent. Check your spam folder too.', missing: 'Authentication configuration pending', missingBody: 'The interface is ready, but the public Supabase project variables still need to be added in Vercel before codes can be sent and real accounts stored.',
    usernamePlaceholder: 'Owner, PapiGEGamer, Pablo...', usernameRequired: 'Username must be at least 3 characters.', saveUsername: 'Save username', profileReady: 'Profile updated.',
  }
  const displayName = auth.user ? displayNameFor(auth.user) : ''
  const needsUsername = Boolean(auth.user && !displayName)

  useEffect(() => {
    if (!auth.user || auth.user.email?.toLowerCase() !== ownerEmail || displayName !== 'Owner') return
    const metadata = auth.user.user_metadata as Record<string, unknown>
    if (metadata.username === 'Owner' && metadata.display_name === 'Owner') return
    void auth.updateProfile('Owner').catch(() => undefined)
  }, [auth, auth.user, displayName])

  const run = async (operation: () => Promise<void>) => {
    setBusy(true); setError(null); setNotice(null)
    try { await operation() } catch (caught) { setError(messageFor(caught, locale)) } finally { setBusy(false) }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (mode === 'login') void run(() => auth.signIn(email.trim(), password))
    if (mode === 'register') void run(async () => {
      if (password.length < 12) throw new Error(locale === 'es' ? 'La contraseña debe tener al menos 12 caracteres.' : 'Password must be at least 12 characters.')
      if (cleanUsername(username).length < 3) throw new Error(labels.usernameRequired)
      await auth.sendRegistrationCode(email.trim())
      setMode('verify'); setNotice(labels.sent)
    })
    if (mode === 'verify') void run(() => auth.completeRegistration(email.trim(), code, password, cleanUsername(username)))
  }

  const saveUsername = (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      if (cleanUsername(username).length < 3) throw new Error(labels.usernameRequired)
      await auth.updateProfile(cleanUsername(username))
      setNotice(labels.profileReady)
    })
  }

  return (
    <div className="account-page">
      <section className="account-hero">
        <motion.div className="account-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eyebrow">{labels.eyebrow}</p><h1>{labels.title}</h1><p>{labels.intro}</p>
        </motion.div>
        <motion.div className="account-panel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          {!auth.configured ? (
            <div className="account-panel__missing"><ShieldCheck size={36} /><h2>{labels.missing}</h2><p>{labels.missingBody}</p></div>
          ) : auth.loading ? (
            <div className="account-panel__missing"><span className="account-loader" /><p>{locale === 'es' ? 'Comprobando sesión…' : 'Checking session…'}</p></div>
          ) : auth.user ? (
            <div className="account-panel__profile">
              <span className="account-avatar"><UserRound size={34} /></span><p className="eyebrow">{labels.account}</p><h2>{displayName || labels.username}</h2>
              <p className="account-panel__email">{auth.user.email}</p>
              {needsUsername && (
                <form className="account-username-form" onSubmit={saveUsername}>
                  <label><span><UserRound size={15} />{labels.username}</span><input autoComplete="nickname" minLength={3} maxLength={32} required value={username} onChange={(event) => setUsername(event.target.value)} placeholder={labels.usernamePlaceholder} /></label>
                  {notice && <p className="account-notice">{notice}</p>}{error && <p className="account-error">{error}</p>}
                  <button className="account-submit" type="submit" disabled={busy}>{busy ? '…' : labels.saveUsername}<ArrowRight size={17} /></button>
                </form>
              )}
              <div className="account-panel__facts"><span><CheckCircle2 size={16} />{labels.verified}</span><span><ShieldCheck size={16} />{labels.security}</span></div>
              <button type="button" onClick={() => void run(auth.signOut)} disabled={busy}><LogOut size={17} />{labels.logout}</button>
            </div>
          ) : (
            <>
              <div className="account-tabs" role="tablist">
                <button type="button" className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}>{labels.login}</button>
                <button type="button" className={mode !== 'login' ? 'is-active' : ''} onClick={() => setMode('register')}>{labels.register}</button>
              </div>
              <form onSubmit={submit}>
                <h2>{mode === 'login' ? labels.login : mode === 'register' ? labels.register : labels.verify}</h2>
                {mode !== 'login' && <label><span><UserRound size={15} />{labels.username}</span><input autoComplete="nickname" minLength={3} maxLength={32} required value={username} onChange={(event) => setUsername(event.target.value)} placeholder={labels.usernamePlaceholder} readOnly={mode === 'verify'} /></label>}
                <label><span><Mail size={15} />{labels.email}</span><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} readOnly={mode === 'verify'} /></label>
                {mode !== 'verify' && <label><span><KeyRound size={15} />{labels.password}</span><input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 12 : 8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
                {mode === 'verify' && <label><span><ShieldCheck size={15} />{labels.code}</span><input className="account-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" minLength={8} maxLength={8} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 8))} /></label>}
                {notice && <p className="account-notice">{notice}</p>}{error && <p className="account-error">{error}</p>}
                <button className="account-submit" type="submit" disabled={busy}>{busy ? '…' : mode === 'login' ? labels.enter : mode === 'register' ? labels.send : labels.confirm}<ArrowRight size={17} /></button>
                {mode === 'verify' && <button className="account-resend" type="button" disabled={busy} onClick={() => void run(async () => { await auth.sendRegistrationCode(email.trim()); setNotice(labels.sent) })}>{labels.resend}</button>}
                <button className="account-switch" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? labels.switchRegister : labels.switchLogin}</button>
              </form>
            </>
          )}
        </motion.div>
      </section>
    </div>
  )
}
