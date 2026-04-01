const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "meuSegredoSuperSeguro123";

// 🔌 conexão com banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Erro ao conectar no banco");
  } else {
    console.log("✅ Conectado ao MySQL");
  }
});


// ======================
// 🔐 CADASTRO
// ======================
app.post('/signup', (req, res) => {

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const checkSql = "SELECT * FROM login WHERE email = ?";

  db.query(checkSql, [email], async (err, result) => {

    if (err) return res.status(500).json({ error: "Erro no servidor" });

    if (result.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    try {
      const hash = await bcrypt.hash(senha, 10);

      const sql = "INSERT INTO login (name, email, senha) VALUES (?, ?, ?)";

      db.query(sql, [nome, email, hash], (err) => {

        if (err) return res.status(500).json({ error: "Erro ao cadastrar" });

        res.json({ message: "Usuário cadastrado!" });
      });

    } catch {
      res.status(500).json({ error: "Erro ao criptografar senha" });
    }

  });

});

app.put('/task/edit/:id', verifyToken, (req, res) => {

  const { task } = req.body;

  const sql = "UPDATE lista SET task = ? WHERE id = ? AND user_id = ?";

  db.query(sql, [task, req.params.id, req.user.id], (err) => {

    if (err) {
      return res.status(500).json({ error: "Erro ao editar" });
    }

    res.json({ message: "Atualizado!" });
  });

});

app.put('/task/:id', verifyToken, (req, res) => {

  const sql = "UPDATE lista SET status = 'completa' WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, req.user.id], (err) => {

    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar" });
    }

    res.json({ message: "Atualizada!" });
  });

});

app.put('/task/:id', verifyToken, (req, res) => {

  const sql = "UPDATE lista SET status = 'completa' WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, req.user.id], (err) => {

    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar" });
    }

    res.json({ message: "Atualizada!" });
  });

});

// ======================
// 🔑 LOGIN
// ======================
app.post('/login', (req, res) => {

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha email e senha" });
  }

  const sql = "SELECT * FROM login WHERE email = ?";

  db.query(sql, [email], async (err, data) => {

    if (err) return res.status(500).json({ error: "Erro no servidor" });

    if (data.length === 0) {
      return res.status(401).json({ error: "Usuário não existe" });
    }

    const user = data[0];

    try {
      const match = await bcrypt.compare(senha, user.senha);

      if (!match) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login sucesso!",
        token
      });

    } catch (error) {
      return res.status(500).json({ error: "Erro ao validar senha" });
    }

  });

});


// ======================
// 🛡️ MIDDLEWARE
// ======================
function verifyToken(req, res, next) {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ error: "Token necessário" });
  }

  // 🔥 suporta "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token inválido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });

    req.user = decoded;
    next();
  });
}


// ======================
// 🆕 CRIAR TASK
// ======================
app.post('/new-task', verifyToken, (req, res) => {

  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task vazia" });
  }

  const sql = "INSERT INTO lista (task, user_id) VALUES (?, ?)";

  db.query(sql, [task, req.user.id], (err, result) => {

    if (err) {
      return res.status(500).json({ error: "Erro ao salvar task" });
    }

    res.json({
      message: "Task criada!",
      id: result.insertId
    });
  });

});


// ======================
// 📥 LISTAR TASKS
// ======================
app.get('/tasks', verifyToken, (req, res) => {

  const sql = "SELECT * FROM lista WHERE user_id = ? ORDER BY id DESC";

  db.query(sql, [req.user.id], (err, result) => {

    if (err) {
      return res.status(500).json({ error: "Erro ao buscar tarefas" });
    }

    res.json(result);
  });

});


// ======================
// ❌ DELETAR TASK
// ======================
app.delete('/task/:id', verifyToken, (req, res) => {

  const sql = "DELETE FROM lista WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, req.user.id], (err) => {

    if (err) {
      return res.status(500).json({ error: "Erro ao deletar" });
    }

    res.json({ message: "Deletado!" });
  });

});


// ======================
// 🚀 SERVER
// ======================
app.listen(8081, () => {
  console.log("🚀 Servidor rodando na porta 8081");
});