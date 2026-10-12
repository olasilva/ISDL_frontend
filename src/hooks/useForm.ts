import { useState, type ChangeEvent } from 'react'
type El = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
export function useForm<T extends Record<string, string>>(init: T) {
  const [f, setF] = useState(init)
  const bind = (k: keyof T) => ({ value: f[k], onChange: (e: ChangeEvent<El>) => setF(p => ({ ...p, [k]: e.target.value })) })
  return { f, bind, setF, reset: () => setF(init) }
}
