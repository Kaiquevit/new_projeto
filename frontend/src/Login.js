import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

function Login() {

  const navigate = useNavigate()

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function validation(values) {
    let errors = {}

    if (!values.email) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email inválido"
    }

    if (!values.password) {
      errors.password = "Senha é obrigatória"
    } else if (values.password.length < 6) {
      errors.password = "Mínimo 6 caracteres"
    }

    return errors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validation(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {

      axios.post('http://localhost:8081/login', {
        email: values.email,
        senha: values.password 
      })
      .then(res => {

        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          setMessage(res.data.message)
          setErrorMessage("")

          navigate('/home')
        }

      })
      .catch(err => {
        setErrorMessage(err.response?.data?.error || "Erro no login")
        setMessage("")
      })
    }
  }

  function handleInput(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div className="login-container">

      <form onSubmit={handleSubmit} className="login-box">
        
        <h3>Login</h3>

        {message && <p className="msg-success">{message}</p>}
        {errorMessage && <p className="msg-error">{errorMessage}</p>}

        <div>
          <label>Email</label>
          <input 
            type='email'
            name='email'
            onChange={handleInput}
          />
          {errors.email && <small className="msg-error">{errors.email}</small>}
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Senha</label>

          <div style={{ position: "relative" }}>
            <input 
              type={showPassword ? "text" : "password"}
              name='password'
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
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 24 24">
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

          {errors.password && <small className="msg-error">{errors.password}</small>}
        </div>

        <button type="submit">
          Entrar
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Não tem conta?
        </p>

        <Link to='/novo_login'>
          Criar conta
        </Link>

      </form>
    </div>
  )
}

export default Login