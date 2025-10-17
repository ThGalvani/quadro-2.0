import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Card, User, Board, CardColumn } from '../types';
import { calculateCobrarEm } from '../utils';
import { getChecklistTemplate } from './checklistTemplates';

// Convert Firestore timestamp to Date
function timestampToDate(timestamp: any): Date | undefined {
  if (!timestamp) return undefined;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}

// Convert Date to Firestore timestamp
function dateToTimestamp(date: Date | undefined): any {
  if (!date) return undefined;
  return Timestamp.fromDate(date);
}

// Users
export async function createUser(userId: string, userData: Omit<User, 'id' | 'createdAt'>) {
  const userRef = doc(collection(db, 'users'), userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(collection(db, 'users'), userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      id: userSnap.id,
      displayName: data.displayName,
      colorHex: data.colorHex,
      email: data.email,
      createdAt: timestampToDate(data.createdAt) || new Date()
    };
  }
  
  return null;
}

// Boards
export async function getBoard(boardId: string = 'main'): Promise<Board | null> {
  const boardRef = doc(collection(db, 'boards'), boardId);
  const boardSnap = await getDoc(boardRef);
  
  if (boardSnap.exists()) {
    const data = boardSnap.data();
    return {
      id: boardSnap.id,
      name: data.name,
      createdAt: timestampToDate(data.createdAt) || new Date(),
      updatedAt: timestampToDate(data.updatedAt) || new Date()
    };
  }
  
  return null;
}

// Cards
export async function createCard(cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'cobrarEm'>) {
  const cardsRef = collection(db, 'cards');
  const newCardRef = doc(cardsRef);
  
  // Calculate Cobrar_em
  const cobrarEm = calculateCobrarEm(cardData.prazoFornecedor, cardData.dataEvento);
  
  // Determine column based on fornecedor
  let coluna: CardColumn = cardData.coluna;
  if (cardData.fornecedor && coluna === 'A fazer') {
    coluna = 'Aguardando Fornecedor';
  }
  
  // Generate checklist based on tipo
  let checklist = cardData.checklist || [];
  if (cardData.tipo && checklist.length === 0) {
    const template = getChecklistTemplate(cardData.tipo);
    checklist = template.map((item, index) => ({
      ...item,
      id: `item-${Date.now()}-${index}`,
      done: false
    }));
  }
  
  await setDoc(newCardRef, {
    ...cardData,
    id: newCardRef.id,
    coluna,
    checklist,
    cobrarEm: dateToTimestamp(cobrarEm),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return newCardRef.id;
}

export async function updateCard(cardId: string, cardData: Partial<Card>) {
  const cardRef = doc(collection(db, 'cards'), cardId);
  
  // Recalculate Cobrar_em if needed
  let updateData = { ...cardData };
  if (cardData.prazoFornecedor || cardData.dataEvento) {
    const cobrarEm = calculateCobrarEm(
      cardData.prazoFornecedor || undefined,
      cardData.dataEvento || undefined
    );
    updateData.cobrarEm = dateToTimestamp(cobrarEm);
  }
  
  await updateDoc(cardRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteCard(cardId: string) {
  const cardRef = doc(collection(db, 'cards'), cardId);
  await deleteDoc(cardRef);
}

export async function getCards(): Promise<Card[]> {
  const cardsRef = collection(db, 'cards');
  const q = query(cardsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      tipo: data.tipo,
      projetoEvento: data.projetoEvento,
      fornecedor: data.fornecedor,
      start: timestampToDate(data.start),
      due: timestampToDate(data.due),
      prazoFornecedor: timestampToDate(data.prazoFornecedor),
      dataEvento: timestampToDate(data.dataEvento),
      responsavelUserId: data.responsavelUserId,
      cobrarEm: timestampToDate(data.cobrarEm),
      coluna: data.coluna,
      checklist: data.checklist || [],
      attachments: data.attachments || [],
      createdAt: timestampToDate(data.createdAt) || new Date(),
      updatedAt: timestampToDate(data.updatedAt) || new Date()
    };
  });
}

export function subscribeToCards(callback: (cards: Card[]) => void) {
  const cardsRef = collection(db, 'cards');
  const q = query(cardsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const cards = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        tipo: data.tipo,
        projetoEvento: data.projetoEvento,
        fornecedor: data.fornecedor,
        start: timestampToDate(data.start),
        due: timestampToDate(data.due),
        prazoFornecedor: timestampToDate(data.prazoFornecedor),
        dataEvento: timestampToDate(data.dataEvento),
        responsavelUserId: data.responsavelUserId,
        cobrarEm: timestampToDate(data.cobrarEm),
        coluna: data.coluna,
        checklist: data.checklist || [],
        attachments: data.attachments || [],
        createdAt: timestampToDate(data.createdAt) || new Date(),
        updatedAt: timestampToDate(data.updatedAt) || new Date()
      };
    });
    
    callback(cards);
  });
}

export async function moveCardToColumn(cardId: string, column: CardColumn) {
  await updateCard(cardId, { coluna: column });
}