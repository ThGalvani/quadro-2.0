import React from 'react';

interface NavigationProps {
  currentView: 'board' | 'calendar' | 'table' | 'timeline';
  onViewChange: (view: 'board' | 'calendar' | 'table' | 'timeline') => void;
}

function Navigation({ currentView, onViewChange }: NavigationProps) {
  const views = [
    { id: 'board', label: 'Quadro' },
    { id: 'calendar', label: 'Calendário' },
    { id: 'table', label: 'Tabela' },
    { id: 'timeline', label: 'Linha do tempo' }
  ];

  return (
    <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id as any)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            currentView === view.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

export default Navigation;