import React, { useState } from 'react'
import axios from 'axios'
import './Novo_login.css'
import { useNavigate } from 'react-router-dom'
function Novo_login() {

  const [values, setValues] = useState({
    nome: '',
    email: '',
    senha: ''
  })
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function handleInput(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    axios.post('http://localhost:8081/signup', values)
      .then(res => {
        setMessage(res.data.message)
        setErrorMessage("")
      })
      .catch(err => {
        setMessage("")
        setErrorMessage(err.response?.data?.error || "Erro ao cadastrar")
      })
  }

  return (
    <div className="register-container">

      <form onSubmit={handleSubmit} className="register-box">

        <h3>Cadastro</h3>

        {message && <p className="msg-success">{message}</p>}
        {errorMessage && <p className="msg-error">{errorMessage}</p>}

        <div>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            onChange={handleInput}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleInput}
          />
        </div>

        <div>
          <label>Senha</label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              onChange={handleInput}
              style={{ paddingRight: "40px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.85}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                opacity: 0.85,
                display: "flex",
                alignItems: "center"
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#e0e0e000" viewBox="0 0 24 24">
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                  <circle cx="12" cy="12" r="2.5"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 24 24">
                  <path d="M2 5l17 17M10.58 10.58A2 2 0 0 0 13.42 13.42M9.88 5.09A11.77 11.77 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-5.17 5.87M6.1 6.1A21.85 21.85 0 0 0 1 12s4 7 11 7a11.68 11.68 0 0 0 5.23-1.17"/>
                </svg>
              )}
            </span>
          </div>
        </div>

       <button type="submit">
  Cadastrar
</button>

<button 
  type="button"
  className="btn-login"
  onClick={() => navigate('/')}
>
  Entrar
</button>
              
      </form>
    </div>
  )
}

export default Novo_login