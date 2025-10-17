import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase';
import KanbanBoard from './components/KanbanBoard';
import CardModal from './components/CardModal';
import Navigation from './components/Navigation';
import AddCardForm from './components/AddCardForm';
import { Card } from './types';

function App() {
  const { currentUser, loading } = useAuth();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentUser ? (
        <Dashboard 
          onSignOut={() => signOut(auth)} 
          onCardClick={(card) => setSelectedCard(card)}
        />
      ) : (
        <LoginScreen />
      )}
      
      {selectedCard && (
        <CardModal 
          card={selectedCard} 
          onClose={() => setSelectedCard(null)}
          users={[]} // TODO: Fetch users
        />
      )}
    </div>
  );
}

function Dashboard({ onSignOut, onCardClick }: { onSignOut: () => void; onCardClick: (card: Card) => void }) {
  const [currentView, setCurrentView] = useState<'board' | 'calendar' | 'table' | 'timeline'>('board');
  const [cardsUpdated, setCardsUpdated] = useState(0);

  const handleCardCreated = () => {
    // Trigger a re-render of the board
    setCardsUpdated(prev => prev + 1);
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">O Quadro</h1>
        <button 
          onClick={onSignOut}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Sair
        </button>
      </header>
      
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'board' && (
        <AddCardForm onCardCreated={handleCardCreated} />
      )}
      
      <div className="mb-6">
        <h2 className="text-xl mb-4">
          {currentView === 'board' && 'Quadro Kanban'}
          {currentView === 'calendar' && 'Calendário'}
          {currentView === 'table' && 'Tabela'}
          {currentView === 'timeline' && 'Linha do tempo'}
        </h2>
        
        {currentView === 'board' && <KanbanBoard key={cardsUpdated} onCardClick={onCardClick} />}
        {currentView === 'calendar' && (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p>Visualização de calendário em desenvolvimento</p>
          </div>
        )}
        {currentView === 'table' && (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p>Visualização de tabela em desenvolvimento</p>
          </div>
        )}
        {currentView === 'timeline' && (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p>Visualização de linha do tempo em desenvolvimento</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Falha na autenticação. Verifique suas credenciais.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('Falha na autenticação com Google.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">O Quadro</h1>
          <p className="text-gray-400">Gerenciamento de tarefas e prazos</p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-800 text-white rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            Entrar
          </button>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Entrar com Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;