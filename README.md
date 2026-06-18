# SGM - Frontend

Interface web do Sistema de Gerenciamento de Mercearia, desenvolvida em React + Tailwind CSS.

## Acesso em produção

| Serviço | Link |
|---------|------|
| Frontend | https://sgm-gestao.web.app |

## Requisitos

- Node.js 18+
- Backend SGM rodando na porta 5001 (para desenvolvimento local)

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse **http://localhost:5173** no navegador.

> O backend precisa estar rodando antes de abrir o frontend. Veja o README do backend para instruções.

## Login padrão

| Usuário | Senha |
|---------|-------|
| adm     | adm   |

## Páginas

| Página | Descrição |
|--------|-----------|
| Dashboard | KPIs e resumo financeiro |
| Clientes | Cadastro e extrato por cliente |
| Dívidas | Registro, pagamento e renegociação |
| Extrato | Consulta de extrato por cliente |
| Usuários | Gerenciamento de usuários (apenas Admin) |

## Tecnologias e serviços

- [React](https://react.dev/) — biblioteca de interface
- [Vite](https://vite.dev/) — bundler e servidor de desenvolvimento
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [React Router](https://reactrouter.com/) — navegação entre páginas
- [Axios](https://axios-http.com/) — requisições HTTP para a API
- [Firebase Hosting](https://firebase.google.com/products/hosting) — hospedagem do frontend
