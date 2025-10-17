import { useState, useEffect } from 'react';
import { Card, CardColumn } from '../types';
import { subscribeToCards, moveCardToColumn } from '../services/firestore';
import CardComponent from './Card';
import Confetti from './Confetti';

const columns: { id: CardColumn; title: string }[] = [
  { id: 'A fazer', title: 'A fazer' },
  { id: 'Aguardando Fornecedor', title: 'Aguardando Fornecedor' },
  { id: 'Em revisão', title: 'Em revisão' },
  { id: 'Concluído', title: 'Concluído' }
];

interface KanbanBoardProps {
  onCardClick: (card: Card) => void;
}

function KanbanBoard({ onCardClick }: KanbanBoardProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCards((newCards) => {
      setCards(newCards);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, columnId: CardColumn) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      // Check if card is being moved to "Concluído"
      const card = cards.find(c => c.id === cardId);
      if (card && card.coluna !== 'Concluído' && columnId === 'Concluído') {
        setShowConfetti(true);
      }
      
      await moveCardToColumn(cardId, columnId);
    }
  };

  const getCardsForColumn = (columnId: CardColumn) => {
    return cards.filter(card => card.coluna === columnId);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Carregando quadro...</div>
      </div>
    );
  }

  return (
    <>
      <Confetti active={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <div 
            key={column.id}
            className="flex-1 min-w-[250px] bg-gray-800 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-semibold">{column.title}</h3>
            </div>
            <div className="p-2 space-y-3 min-h-[100px]">
              {getCardsForColumn(column.id).map(card => (
                <div 
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                >
                  <CardComponent 
                    card={card} 
                    onClick={() => onCardClick(card)}
                  />
                </div>
              ))}
              {getCardsForColumn(column.id).length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  Nenhum cartão
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default KanbanBoard;