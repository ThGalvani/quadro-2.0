// Service to parse email content and create cards

export interface ParsedEmailData {
  tipo?: string;
  fornecedor?: string;
  prazoFornecedor?: Date;
  dataEvento?: Date;
  titulo: string;
}

export function parseEmailContent(emailBody: string): ParsedEmailData {
  // Try to parse structured data first
  const tipoMatch = emailBody.match(/Tipo:\s*([^\n\r|]+)/i);
  const fornecedorMatch = emailBody.match(/Fornecedor:\s*([^\n\r|]+)/i);
  const prazoMatch = emailBody.match(/Prazo forn(?:ecedor)?:\s*([^\n\r|]+)/i);
  const eventoMatch = emailBody.match(/Evento:\s*([^\n\r|]+)/i);
  
  if (tipoMatch || fornecedorMatch || prazoMatch || eventoMatch) {
    return {
      tipo: tipoMatch ? tipoMatch[1].trim() : undefined,
      fornecedor: fornecedorMatch ? fornecedorMatch[1].trim() : undefined,
      prazoFornecedor: prazoMatch ? parseDate(prazoMatch[1].trim()) : undefined,
      dataEvento: eventoMatch ? parseDate(eventoMatch[1].trim()) : undefined,
      titulo: 'Tarefa por email' // Default title
    };
  }
  
  // Fallback: use email subject as title
  return {
    titulo: emailBody.substring(0, 100) // Use first 100 chars as title
  };
}

function parseDate(dateString: string): Date | undefined {
  // Try to parse DD/MM/YYYY HH:MM format
  const regex = /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/;
  const match = dateString.match(regex);
  
  if (match) {
    const [, day, month, year, hours, minutes] = match;
    return new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
  }
  
  return undefined;
}