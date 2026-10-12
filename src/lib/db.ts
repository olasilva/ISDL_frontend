// src/lib/db.ts
import api from './api';

// ---------- Types ----------
export interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface OutreachRow {
  id: number;
  name: string;
  email: string;
  company: string | null;
  status: string;
  created_at: string;
}

export interface ReviewRow {
  id: number;
  author: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface UpdateRow {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

// ---------- Messages / Inbox ----------
export const messagesApi = {
  create: async (payload: { name: string; email: string; message: string }) => {
    const res = await api.post('/inbox', payload);
    return res.data;
  },
  list: async (): Promise<MessageRow[]> => {
    const res = await api.get('/inbox');
    return res.data.data;
  },
  markRead: async (id: number) => {
    const res = await api.patch(`/inbox/${id}/read`);
    return res.data;
  },
  remove: async (id: number) => {
    const res = await api.delete(`/inbox/${id}`);
    return res.data;
  },
};

// ---------- Outreach ----------
export const outreachApi = {
  create: async (payload: { name: string; email: string; company?: string }) => {
    const res = await api.post('/outreach', payload);
    return res.data;
  },
  list: async (): Promise<OutreachRow[]> => {
    const res = await api.get('/outreach');
    return res.data.data;
  },
  updateStatus: async (id: number, status: string) => {
    const res = await api.patch(`/outreach/${id}`, { status });
    return res.data;
  },
  remove: async (id: number) => {
    const res = await api.delete(`/outreach/${id}`);
    return res.data;
  },
};

// ---------- Reviews ----------
export const reviewsApi = {
  listApproved: async (): Promise<ReviewRow[]> => {
    const res = await api.get('/reviews/approved');
    return res.data.data;
  },
  create: async (payload: { author: string; rating: number; comment?: string }) => {
    const res = await api.post('/reviews', payload);
    return res.data;
  },
  listAll: async (): Promise<ReviewRow[]> => {
    const res = await api.get('/reviews');
    return res.data.data;
  },
  approve: async (id: number, is_approved: boolean) => {
    const res = await api.patch(`/reviews/${id}/approve`, { is_approved });
    return res.data;
  },
  remove: async (id: number) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};

// ---------- Site Updates ----------
export const updatesApi = {
  listPublished: async (): Promise<UpdateRow[]> => {
    const res = await api.get('/updates/published');
    return res.data.data;
  },
  listAll: async (): Promise<UpdateRow[]> => {
    const res = await api.get('/updates');
    return res.data.data;
  },
  create: async (formData: FormData) => {
    const res = await api.post('/updates', formData);
    return res.data;
  },
  remove: async (id: number) => {
    const res = await api.delete(`/updates/${id}`);
    return res.data;
  },
};

// ---------- Backward-compatible add() ----------
export const add = async (collection: string, data: Record<string, any>) => {
  switch (collection) {
    case 'messages':
      return messagesApi.create({
        name: data.name,
        email: data.email,
        message: data.message || data.body || '',
      });
    case 'reviews':
      return reviewsApi.create(data as { author: string; rating: number; comment?: string });
    case 'outreach':
      return outreachApi.create(data as { name: string; email: string; company?: string });
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
};

// ---------- Polling subscriptions ----------
type Unsubscribe = () => void;
type Callback = (data: any[]) => void;

const POLL_INTERVAL = 5000;

const fetchers: Record<string, () => Promise<any[]>> = {
  messages: () => messagesApi.list(),
  reviews: () => reviewsApi.listAll(),
  'reviews:approved': () => reviewsApi.listApproved(),
  outreach: () => outreachApi.list(),
  updates: () => updatesApi.listAll(),
  'updates:published': () => updatesApi.listPublished(),
};

export function subscribe(collection: string, callback: Callback): Unsubscribe {
  const fetcher = fetchers[collection];

  if (!fetcher) {
    console.warn(`[subscribe] Unknown collection: ${collection}`);
    return () => {};
  }

  let active = true;

  const tick = async () => {
    try {
      const data = await fetcher();
      if (active) callback(data);
    } catch (err) {
      console.error(`[subscribe] Fetch failed for "${collection}":`, err);
    }
  };

  tick();
  const id = setInterval(tick, POLL_INTERVAL);

  return () => {
    active = false;
    clearInterval(id);
  };
}