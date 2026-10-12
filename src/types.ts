export interface Message { id: string; ts: number; name: string; email: string; phone: string; type: string; body: string; read: boolean }
export interface Review { id: string; ts: number; name: string; rating: number; text: string; approved: boolean }
export interface Update { id: string; ts: number; title: string; body: string }
export type Col = 'messages' | 'reviews' | 'updates'
export interface Compose { to: string; ch: 'email' | 'wa'; subject: string; body: string }
