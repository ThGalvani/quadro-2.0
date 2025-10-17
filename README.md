# O Quadro

Aplicação web para rastrear tarefas com fornecedores e prazos de eventos.

## Tecnologias

- React + TypeScript
- Tailwind CSS (modo escuro)
- Firebase (Authentication, Firestore, Storage, Functions)
- GitHub Actions para CI/CD

## Funcionalidades

- Autenticação via email/senha ou Google
- Quadro Kanban com colunas fixas (A fazer, Aguardando Fornecedor, Em revisão, Concluído)
- Drag-and-drop entre colunas
- Edição inline e painel de detalhes
- Cálculo automático de "Cobrar_em"
- Notificações e alertas visuais
- Visualizações múltiplas (Quadro, Calendário, Tabela, Linha do tempo)
- Anexos e checklists
- Animação de confete ao concluir tarefas

## Scripts Disponíveis

### `npm start`

Inicia o servidor de desenvolvimento.

### `npm test`

Executa os testes.

### `npm run build`

Gera a versão de produção.

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── services/       # Serviços (Firebase, templates)
├── types/          # Definições de tipos TypeScript
└── utils/          # Funções utilitárias
```

## Deploy

O deploy é feito automaticamente via GitHub Actions para o Firebase Hosting.
