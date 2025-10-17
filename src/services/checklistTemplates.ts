import { ChecklistItem } from '../types';

// Checklist templates for different card types
const checklistTemplates: Record<string, Omit<ChecklistItem, 'id' | 'done'>[]> = {
  'vídeo': [
    { title: 'Briefing aprovado' },
    { title: 'Roteiro' },
    { title: '1ª versão' },
    { title: 'Feedback interno' },
    { title: '2ª versão' },
    { title: 'Aprovação final' },
    { title: 'Arquivo final' },
    { title: 'Upload' }
  ],
  'banner': [
    { title: 'Arte final' },
    { title: 'Ordem de produção' },
    { title: 'Confirmação fabricação' },
    { title: 'Confirmação envio (tracking)' },
    { title: 'Recebimento' }
  ]
};

export function getChecklistTemplate(tipo: string): Omit<ChecklistItem, 'id' | 'done'>[] {
  return checklistTemplates[tipo] || [];
}

export default checklistTemplates;