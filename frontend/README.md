# 📋 Sistema de Lista de Tarefas

Projeto full stack desenvolvido com **React + Node.js + MySQL**, com autenticação de usuários e gerenciamento de tarefas.

---

## 🚀 Funcionalidades

- 🔐 Cadastro de usuário
- 🔑 Login com autenticação JWT
- ➕ Adicionar tarefas
- 📋 Listar tarefas
- ✏️ Editar tarefas
- ❌ Deletar tarefas
- ✅ Marcar como completa
- 🔎 Filtro por:
  - Todas
  - Ativas
  - Completas

---

## 🛠️ Tecnologias utilizadas

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express
- MySQL
- JWT (jsonwebtoken)
- bcrypt

---

## 📁 Estrutura do banco de dados

CREATE TABLE login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);

CREATE TABLE lista (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ativa',
  user_id INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

