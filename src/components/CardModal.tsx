import React, { useState } from 'react';
import { Card as CardType, ChecklistItem } from '../types';
import { updateCard, deleteCard } from '../services/firestore';
import { formatDate, calculateCobrarEm } from '../utils';

interface CardModalProps {
  card: CardType;
  onClose: () => void;
  users: any[]; // TODO: Replace with proper User type
}

function CardModal({ card, onClose, users }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [tipo, setTipo] = useState(card.tipo || '');
  const [projetoEvento, setProjetoEvento] = useState(card.projetoEvento || '');
  const [fornecedor, setFornecedor] = useState(card.fornecedor || '');
  const [start, setStart] = useState(card.start ? formatDate(card.start) : '');
  const [due, setDue] = useState(card.due ? formatDate(card.due) : '');
  const [prazoFornecedor, setPrazoFornecedor] = useState(card.prazoFornecedor ? formatDate(card.prazoFornecedor) : '');
  const [dataEvento, setDataEvento] = useState(card.dataEvento ? formatDate(card.dataEvento) : '');
  const [responsavelUserId, setResponsavelUserId] = useState(card.responsavelUserId || '');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(card.checklist || []);
  const [isEditing, setIsEditing] = useState(false);

  const cobrarEm = calculateCobrarEm(
    card.prazoFornecedor,
    card.dataEvento
  );

  const handleSave = async () => {
    try {
      await updateCard(card.id, {
        title,
        tipo,
        projetoEvento,
        fornecedor,
        start: start ? new Date(start) : undefined,
        due: due ? new Date(due) : undefined,
        prazoFornecedor: prazoFornecedor ? new Date(prazoFornecedor) : undefined,
        dataEvento: dataEvento ? new Date(dataEvento) : undefined,
        responsavelUserId,
        checklist
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await deleteCard(card.id);
        onClose();
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  const handleAddChecklistItem = () => {
    setChecklist([
      ...checklist,
      {
        id: Date.now().toString(),
        title: '',
        done: false
      }
    ]);
  };

  const handleChecklistItemChange = (id: string, field: keyof ChecklistItem, value: any) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const tipos = ['vídeo', 'banner', 'outro'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-700 text-white border-b border-gray-600 focus:outline-none focus:border-blue-500 w-full"
                />
              ) : (
                title
              )}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 mb-1">Tipo</label>
              {isEditing ? (
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um tipo</option>
                  {tipos.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white">{tipo || 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Projeto/Evento</label>
              {isEditing ? (
                <input
                  type="text"
                  value={projetoEvento}
                  onChange={(e) => setProjetoEvento(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-white">{projetoEvento || 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Fornecedor</label>
              {isEditing ? (
                <input
                  type="text"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-white">{fornecedor || 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Responsável</label>
              {isEditing ? (
                <select
                  value={responsavelUserId}
                  onChange={(e) => setResponsavelUserId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um responsável</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.displayName}</option>
                  ))}
                </select>
              ) : (
                <div className="text-white">
                  {users.find(u => u.id === responsavelUserId)?.displayName || 'Não definido'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Start</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-white">{card.start ? formatDate(card.start) : 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Due</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-white">{card.due ? formatDate(card.due) : 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Prazo do fornecedor</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={prazoFornecedor}
                  onChange={(e) => setPrazoFornecedor(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-white">{card.prazoFornecedor ? formatDate(card.prazoFornecedor) : 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Data do evento</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-white">{card.dataEvento ? formatDate(card.dataEvento) : 'Não definido'}</div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Cobrar em</label>
              <div className="text-white">{cobrarEm ? formatDate(cobrarEm) : 'Não calculado'}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Checklist</h3>
              {isEditing && (
                <button
                  onClick={handleAddChecklistItem}
                  className="text-blue-400 hover:text-blue-300"
                >
                  + Adicionar item
                </button>
              )}
            </div>
            
            {checklist.length > 0 ? (
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center bg-gray-700 rounded p-2">
                    {isEditing ? (
                      <>
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={(e) => handleChecklistItemChange(item.id, 'done', e.target.checked)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleChecklistItemChange(item.id, 'title', e.target.value)}
                          className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveChecklistItem(item.id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={item.done}
                          disabled
                          className="mr-2"
                        />
                        <span className={item.done ? 'line-through text-gray-400' : 'text-white'}>
                          {item.title}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Nenhum item na checklist</div>
            )}
          </div>

          <div className="flex justify-between">
            <div>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Editar
                </button>
              )}
            </div>
            
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;