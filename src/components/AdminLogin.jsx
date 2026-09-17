import { useEffect, useState } from 'react'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js'
import { navigate } from '../utils/navigation.js'

async function isAdmin(userId) {
  const { data, error } = await getSupabaseClient().from('profiles').select('role').eq('id', userId).maybeSingle()
  return !error && data?.role === 'admin'
}

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (data.session && await isAdmin(data.session.user.id)) navigate('/admin')
      setLoading(false)
    })
  }, [])

  const signIn = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const client = getSupabaseClient()
    const { data, error: signInError } = await client.auth.signInWithPassword({ email, password })
    if (signInError || !data.user) {
      setError('No pudimos iniciar sesión. Revisa tu correo y contraseña.')
      setSubmitting(false)
      return
    }

    if (!await isAdmin(data.user.id)) {
      await client.auth.signOut()
      setError('No tienes acceso al panel de administración.')
      setSubmitting(false)
      return
    }

    navigate('/admin')
  }

  return <main className="admin-shell"><section className="admin-login" aria-labelledby="admin-login-title"><p className="admin-kicker">KREA ONE</p><h1 id="admin-login-title">ADMIN</h1>{!isSupabaseConfigured ? <p className="admin-error">Falta configurar Supabase para acceder al panel.</p> : loading ? <p>Cargando…</p> : <form onSubmit={signIn}><label>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="admin-error" role="alert">{error}</p>}<button type="submit" disabled={submitting}>{submitting ? 'INGRESANDO…' : 'INGRESAR'}</button></form>}</section></main>
}
