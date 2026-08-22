# TransLog — Sistema de Rastreamento de Entregas

## Problema original
Aplicativo web completo, moderno e responsivo para uma empresa de transportes e logística (TransLog), onde o cliente consulta o andamento da entrega por código de rastreio e o administrador alimenta manualmente todas as informações.

## Escolhas do usuário
- Autenticação: JWT (e-mail + senha), admin criado automaticamente
- Marca: TransLog
- Sem notificações por e-mail
- Idioma: Português do Brasil

## Arquitetura
- Backend: FastAPI (`/app/backend/server.py`), rotas com prefixo `/api`
- Banco: MongoDB (coleções `users`, `entregas` com movimentações embutidas)
- Frontend: React + Tailwind + shadcn/ui + framer-motion + sonner
- Auth: JWT (Bearer em localStorage + cookie httpOnly), rotas `/api/admin/*` protegidas
- Design: guidelines em `/app/design_guidelines.json` (tema "Industrial Precision", laranja #FF5A00, Outfit + IBM Plex Sans)

## Personas
- Cliente final: consulta pública por código, vê timeline e histórico
- Administrador da transportadora: cadastra entregas e registra movimentações manualmente

## Requisitos centrais (estáticos)
- Consulta pública por código único, sem exposição de dados internos do destinatário
- Timeline fixa de 6 etapas com destaque da etapa atual
- Histórico de movimentações (data, hora, local, status, observação)
- Painel admin com CRUD, busca, atualização de status e dashboard de métricas

## Implementado (Jun/2026)
- Páginas públicas: Início (hero de rastreio), Rastrear Pedido, Sobre Nós, Contato
- API pública `GET /api/track/{codigo}` com nome do destinatário mascarado
- Login admin `POST /api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- CRUD `/api/admin/entregas` (código único, validações, 409 em duplicado)
- `POST /api/admin/entregas/{id}/movimentacoes` atualiza status/localização/previsão
- Dashboard com 5 cards de métricas, tabela e ações Visualizar/Editar/Atualizar status/Excluir
- Dados de exemplo TL2026001BR..TL2026004BR (removíveis pelo painel)
- Testes: 15/15 backend (pytest) e fluxos frontend críticos aprovados

## Backlog priorizado
- P1: paginação e filtros por status na tabela admin
- P1: exportar entregas em CSV
- P2: seletor de data com Calendar shadcn (formato dd/mm/aaaa)
- P2: DialogDescription para acessibilidade nos diálogos admin
- P2: notificações por e-mail/WhatsApp ao mudar status
- P2: múltiplos usuários administradores com perfis

## Próximas tarefas
1. Filtro por status + paginação no painel
2. Exportação CSV das entregas
3. Comprovante de entrega em PDF
