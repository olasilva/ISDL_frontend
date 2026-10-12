import { useEffect, useState } from 'react'
import { supabase, usingSupabase } from './db'

const LOCAL_PW = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || 'change-me'

export function useAdmin() {
  const [ok, setOk] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => { setOk(!!data.session); setReady(true) })
      const { data } = supabase.auth.onAuthStateChange((_e, s) => setOk(!!s))
      return () => data.subscription.unsubscribe()
    }
    setOk(sessionStorage.getItem('isdl:admin') === '1'); setReady(true)
  }, [])
  const login = async (email: string, pw: string): Promise<string | null> => {
    if (supabase) { const { error } = await supabase.auth.signInWithPassword({ email, password: pw }); return error ? error.message : null }
    if (pw === LOCAL_PW) { sessionStorage.setItem('isdl:admin', '1'); setOk(true); return null }
    return 'Wrong password.'
  }
  const logout = async () => { if (supabase) await supabase.auth.signOut(); sessionStorage.removeItem('isdl:admin'); setOk(false) }
  return { ok, ready, login, logout, usingSupabase }
}
