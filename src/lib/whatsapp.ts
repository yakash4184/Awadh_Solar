const WHATSAPP_NUMBER = '918318084697'

export function getWhatsAppUrl(message?: string): string {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${url}?text=${encodeURIComponent(message)}` : url
}
