import React from 'react';
import { Card as CardType } from '../types';
import { getCardColor, formatDate, isOverdue } from '../utils';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

function Card({ card, onClick }: CardProps) {
  const cardColor = getCardColor(card.cobrarEm);
  const isOverduePrazo = isOverdue(card.prazoFornecedor);
  const isOverdueEvento = isOverdue(card.dataEvento);
  
  const getBorderColor = () => {
    if (isOverduePrazo || isOverdueEvento) return 'border-red-500';
    if (cardColor === 'red') return 'border-red-500';
    if (cardColor === 'yellow') return 'border-yellow-500';
    if (cardColor === 'green') return 'border-green-500';
    return 'border-gray-600';
  };
  
  const getHighlightClass = () => {
    if (cardColor === 'red' || isOverduePrazo || isOverdueEvento) return 'bg-red-900/30';
    if (cardColor === 'yellow') return 'bg-yellow-900/30';
    if (cardColor === 'green') return 'bg-green-900/30';
    return 'bg-gray-700';
  };

  return (
    <div 
      className={`bg-gray-700 rounded-lg p-3 cursor-pointer border-l-4 ${getBorderColor()} ${getHighlightClass()} hover:bg-gray-600 transition-colors`}
      onClick={onClick}
    >
      <div className="font-medium mb-1">{card.title}</div>
      
      {card.fornecedor && (
        <div className="text-sm text-gray-300 mb-1">
          <span className="font-semibold">Fornecedor:</span> {card.fornecedor}
        </div>
      )}
      
      {card.prazoFornecedor && (
        <div className="text-xs mb-1">
          <span className="font-semibold">Prazo:</span> {formatDate(card.prazoFornecedor)}
          {isOverduePrazo && <span className="ml-2 text-red-400">ATRASADO</span>}
        </div>
      )}
      
      {card.dataEvento && (
        <div className="text-xs mb-1">
          <span className="font-semibold">Evento:</span> {formatDate(card.dataEvento)}
          {isOverdueEvento && <span className="ml-2 text-red-400">ATRASADO</span>}
        </div>
      )}
      
      {card.cobrarEm && (
        <div className="text-xs">
          <span className="font-semibold">Cobrar em:</span> {formatDate(card.cobrarEm)}
        </div>
      )}
      
      {card.checklist && card.checklist.length > 0 && (
        <div className="mt-2 text-xs">
          <div className="flex items-center">
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${(card.checklist.filter(item => item.done).length / card.checklist.length) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2">
              {card.checklist.filter(item => item.done).length}/{card.checklist.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;