import React, { useState } from 'react';
import { createCard } from '../services/firestore';
import { CardFormData, CardColumn } from '../types';

interface AddCardFormProps {
  onCardCreated: () => void;
}

function AddCardForm({ onCardCreated }: AddCardFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<CardFormData>({
    title: '',
    tipo: '',
    fornecedor: '',
    prazoFornecedor: undefined,
    dataEvento: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Por favor, preencha o título');
      return;
    }
    
    try {
      // Default to "A fazer" column
      const cardData = {
        ...formData,
        coluna: 'A fazer' as CardColumn,
        checklist: [],
        attachments: []
      };
      
      await createCard(cardData);
      setFormData({
        title: '',
        tipo: '',
        fornecedor: '',
        prazoFornecedor: undefined,
        dataEvento: undefined
      });
      setIsExpanded(false);
      onCardCreated();
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Erro ao criar cartão');
    }
  };

  const handleChange = (field: keyof CardFormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <span className="mr-2">+</span> Adicionar cartão
      </button>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Título do cartão"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <select
              value={formData.tipo || ''}
              onChange={(e) => handleChange('tipo', e.target.value || undefined)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tipo</option>
              <option value="vídeo">Vídeo</option>
              <option value="banner">Banner</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <input
              type="text"
              value={formData.fornecedor || ''}
              onChange={(e) => handleChange('fornecedor', e.target.value || undefined)}
              placeholder="Fornecedor"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <input
              type="datetime-local"
              value={formData.prazoFornecedor ? formData.prazoFornecedor.toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('prazoFornecedor', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-400 mt-1">Prazo do fornecedor</div>
          </div>
          
          <div>
            <input
              type="datetime-local"
              value={formData.dataEvento ? formData.dataEvento.toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('dataEvento', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-400 mt-1">Data do evento</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCardForm;