import React, { useState, useEffect } from 'react'
import './HomeT.css'
import axios from 'axios'

function HomeT() {
  const [tab, setTab] = useState(1)
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const token = localStorage.getItem("token")

  const handleTabs = (tab) => {
    setTab(tab)
  }

  // ======================
  // ➕ ADD TASK
  // ======================
  const handleAddTask = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        'http://localhost:8081/new-task',
        { task },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTask('')
      fetchTasks()

    } catch (err) {
      console.log("ERRO ADD:", err.response?.data || err.message)
    }
  }

  // ======================
  // 📥 GET TASKS
  // ======================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8081/tasks',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks(res.data)

    } catch (err) {
      console.log("ERRO GET:", err.response?.data || err.message)
    }
  }

  // ======================
  // ❌ DELETE
  // ======================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchTasks()

    } catch (err) {
      console.log("ERRO DELETE:", err.response?.data || err.message)
    }
  }

  // ======================
  // 🔄 TOGGLE COMPLETE
  // ======================
  const handleToggleStatus = async (t) => {
    try {
      await axios.put(
        `http://localhost:8081/task/${t.id}`,
        { status: t.status === 'ativa' ? 'completa' : 'ativa' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchTasks()

    } catch (err) {
      console.log("ERRO STATUS:", err.response?.data || err.message)
    }
  }

  // ======================
  // ✏️ EDITAR
  // ======================
  const handleEdit = (t) => {
    setEditId(t.id)
    setEditText(t.task)
  }

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/task/edit/${id}`,
        { task: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setEditId(null)
      setEditText('')
      fetchTasks()

    } catch (err) {
      console.log("ERRO EDIT:", err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // ======================
  // 🔥 FILTRO
  // ======================
  const filteredTasks = tasks.filter((t) => {
    if (tab === 1) return true
    if (tab === 2) return t.status === 'ativa'
    if (tab === 3) return t.status === 'completa'
  })

  return (
    <div className="container">

      <div className="box">
        <h2>Listas de Tarefas</h2>

        <div className="input-group">
          <input 
            value={task} 
            onChange={e => setTask(e.target.value)} 
            type="text" 
            placeholder="Nova Tarefa" 
          />
          <button onClick={handleAddTask}>ADD</button>
        </div>
      </div>

      <div className="tabs">
        <p onClick={() => handleTabs(1)} className={tab === 1 ? 'active' : ''}>Todas</p>
        <p onClick={() => handleTabs(2)} className={tab === 2 ? 'active' : ''}>Ativas</p>
        <p onClick={() => handleTabs(3)} className={tab === 3 ? 'active' : ''}>Completas</p>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Nenhuma tarefa encontrada
        </p>
      ) : (
        filteredTasks.map((t) => (
          <div className="task" key={t.id}>

            <div className="task-info">

              {editId === t.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <p 
                  className="title"
                  style={{
                    textDecoration: t.status === 'completa' ? 'line-through' : 'none',
                    opacity: t.status === 'completa' ? 0.6 : 1
                  }}
                >
                  {t.task}
                </p>
              )}

              <p className="date">
                {t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}
              </p>

              <p className="status">
                Status: {t.status}
              </p>
            </div>

            <div className="actions">

              {editId === t.id ? (
                <button onClick={() => handleSaveEdit(t.id)}>
                  Salvar
                </button>
              ) : (
                <button onClick={() => handleEdit(t)}>
                  Editar
                </button>
              )}

              <button 
                className="delete" 
                onClick={() => handleDelete(t.id)}
              >
                Deletar
              </button>

              <button 
                className="complete" 
                onClick={() => handleToggleStatus(t)}
              >
                {t.status === 'ativa' ? 'Completar' : 'Ativar'}
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  )
}

export default HomeT