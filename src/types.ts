export interface User {
  id: string;
  displayName: string;
  colorHex?: string;
  email: string;
  createdAt: Date;
}

export interface Board {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  title: string;
  due?: Date;
  assigneeUserId?: string;
  done: boolean;
}

export interface Attachment {
  id: string;
  url: string;
  title: string;
}

export type CardColumn = 'A fazer' | 'Aguardando Fornecedor' | 'Em revisão' | 'Concluído';

export interface Card {
  id: string;
  title: string;
  tipo?: string;
  projetoEvento?: string;
  fornecedor?: string;
  start?: Date;
  due?: Date;
  prazoFornecedor?: Date;
  dataEvento?: Date;
  responsavelUserId?: string;
  cobrarEm?: Date; // Computed field
  coluna: CardColumn;
  checklist: ChecklistItem[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CardFormData {
  title: string;
  tipo?: string;
  projetoEvento?: string;
  fornecedor?: string;
  start?: Date;
  due?: Date;
  prazoFornecedor?: Date;
  dataEvento?: Date;
  responsavelUserId?: string;
}