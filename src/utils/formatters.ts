export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `Há ${Math.max(1, diffInMinutes)} min`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Há ${diffInHours}h`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

export function generateWhatsAppLink(phoneWithCountry: string, message?: string): string {
  const cleanNumber = phoneWithCountry.replace(/\D/g, '');
  const encodedMsg = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}${encodedMsg}`;
}

export function generatePhoneCallLink(phone: string): string {
  const clean = phone.replace(/[^\d+]/g, '');
  return `tel:${clean}`;
}
