// Utility functions for date calculations and formatting

// Calculate Cobrar_em date
export function calculateCobrarEm(prazoFornecedor?: Date, dataEvento?: Date): Date | undefined {
  if (!prazoFornecedor && !dataEvento) return undefined;
  
  const prazoMinus2Days = prazoFornecedor ? new Date(prazoFornecedor.getTime() - 2 * 24 * 60 * 60 * 1000) : undefined;
  const eventoMinus5Days = dataEvento ? new Date(dataEvento.getTime() - 5 * 24 * 60 * 60 * 1000) : undefined;
  
  if (prazoMinus2Days && eventoMinus5Days) {
    return prazoMinus2Days < eventoMinus5Days ? prazoMinus2Days : eventoMinus5Days;
  }
  
  return prazoMinus2Days || eventoMinus5Days;
}

// Format date to DD/MM/AAAA HH:MM
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Get time difference in hours
export function getTimeDifferenceInHours(date1: Date, date2: Date): number {
  const diffInMs = Math.abs(date1.getTime() - date2.getTime());
  return diffInMs / (1000 * 60 * 60);
}

// Get card color based on time until Cobrar_em
export function getCardColor(cobrarEm?: Date): 'green' | 'yellow' | 'red' | 'default' {
  if (!cobrarEm) return 'default';
  
  const now = new Date();
  const hoursUntilCobrar = getTimeDifferenceInHours(now, cobrarEm);
  
  if (cobrarEm < now) return 'red'; // Past due
  if (hoursUntilCobrar > 72) return 'green'; // More than 72h
  if (hoursUntilCobrar >= 24) return 'yellow'; // 24-72h
  return 'red'; // Less than 24h
}

// Check if card is overdue
export function isOverdue(date?: Date): boolean {
  if (!date) return false;
  return date < new Date();
}