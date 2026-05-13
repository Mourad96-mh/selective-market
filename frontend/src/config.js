export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '212663432716'

export const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
}

export const GENDER_LABELS = {
  homme: 'Homme',
  femme: 'Femme',
  unisexe: 'Unisexe',
}

export function cloudinaryAuto(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_auto,q_auto/')
}

export function formatPrice(amount) {
  return `${Number(amount).toLocaleString('fr-MA')} MAD`
}

export function discountPercent(price, discountPrice) {
  if (!discountPrice || discountPrice >= price) return 0
  return Math.round((1 - discountPrice / price) * 100)
}
