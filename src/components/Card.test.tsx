import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './Card';
import { Card as CardType } from '../types';

const mockCard: CardType = {
  id: '1',
  title: 'Test Card',
  coluna: 'A fazer',
  checklist: [],
  attachments: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

test('renders card title', () => {
  render(<Card card={mockCard} onClick={jest.fn()} />);
  expect(screen.getByText('Test Card')).toBeInTheDocument();
});

test('renders fornecedor when provided', () => {
  const cardWithFornecedor = {
    ...mockCard,
    fornecedor: 'Test Fornecedor'
  };
  
  render(<Card card={cardWithFornecedor} onClick={jest.fn()} />);
  expect(screen.getByText('Test Fornecedor')).toBeInTheDocument();
});