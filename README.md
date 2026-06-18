# SGM - Frontend

Interface web do Sistema de Gerenciamento de Mercearia, desenvolvida em React + Tailwind CSS.

## Requisitos

- Node.js 18+
- Backend SGM rodando na porta 5001

## Instalação

```bash
npm install
```

## Como rodar

```bash
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

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
