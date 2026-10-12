import api from './api';

export const messagesApi = {
  create: async (payload) => {
    const res = await api.post('/inbox', payload);
    return res.data;
  },
  list: async () => {
    const res = await api.get('/inbox');
    return res.data.data;
  },
  markRead: async (id) => {
    const res = await api.patch(`/inbox/${id}/read`);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/inbox/${id}`);
    return res.data;
  },
};

export const outreachApi = {
  create: async (payload) => {
    const res = await api.post('/outreach', payload);
    return res.data;
  },
  list: async () => {
    const res = await api.get('/outreach');
    return res.data.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/outreach/${id}`, { status });
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/outreach/${id}`);
    return res.data;
  },
};

export const reviewsApi = {
  listApproved: async () => {
    const res = await api.get('/reviews/approved');
    return res.data.data;
  },
  create: async (payload) => {
    const res = await api.post('/reviews', payload);
    return res.data;
  },
  listAll: async () => {
    const res = await api.get('/reviews');
    return res.data.data;
  },
  approve: async (id, is_approved) => {
    const res = await api.patch(`/reviews/${id}/approve`, { is_approved });
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};

export const updatesApi = {
  listPublished: async () => {
    const res = await api.get('/updates/published');
    return res.data.data;
  },
  listAll: async () => {
    const res = await api.get('/updates');
    return res.data.data;
  },
  create: async (formData) => {
    const res = await api.post('/updates', formData);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/updates/${id}`);
    return res.data;
  },
};

export const add = async (collection, data) => {
  switch (collection) {
    case 'messages':
      return messagesApi.create({
        name: data.name,
        email: data.email,
        message: data.message || data.body || '',
      });
    case 'reviews':
      return reviewsApi.create(data);
    case 'outreach':
      return outreachApi.create(data);
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
};

const POLL_INTERVAL = 5000;

const fetchers = {
  messages: () => messagesApi.list(),
  reviews: () => reviewsApi.listAll(),
  'reviews:approved': () => reviewsApi.listApproved(),
  outreach: () => outreachApi.list(),
  updates: () => updatesApi.listAll(),
  'updates:published': () => updatesApi.listPublished(),
};

export function subscribe(collection, callback) {
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