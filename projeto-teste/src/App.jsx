import { useState } from 'react'
import './App.css'
 
function App() {
  const [aba, setAba] = useState('novo')
  const [grupoSel, setGrupoSel] = useState('')
  const [exercicios, setExercicios] = useState([])
  const [nomeEx, setNomeEx] = useState('')
  const [obs, setObs] = useState('')
  const [series, setSeries] = useState([{ peso: '', reps: '' }])
 
  const grupos = [
    { label: 'Peito',     icon: '💪' },
    { label: 'Costas',    icon: '🔙' },
    { label: 'Ombro',     icon: '🏋️' },
    { label: 'Bíceps',    icon: '💪' },
    { label: 'Tríceps',   icon: '💪' },
    { label: 'Perna',     icon: '🔥' },
    { label: 'Abdômen',   icon: '🔥' },
    { label: 'Glúteo',    icon: '🍑' },
    { label: 'Full Body', icon: '⚡' },
  ]
 
  function addSerie() {
    setSeries(prev => [...prev, { peso: '', reps: '' }])
  }
 
  function updateSerie(index, campo, valor) {
    setSeries(prev => prev.map((s, i) => i === index ? { ...s, [campo]: valor } : s))
  }

  function removeSerie(index) {
    setSeries(prev => prev.filter((_, i) => i !== index))
  }
 
  function addExercicio() {
    if (!grupoSel) return alert('Selecione o grupo muscular!')
    if (!nomeEx.trim()) return alert('Digite o nome do exercicio')
    const validas = series.filter(s => s.peso || s.reps)
    if (!validas.length) return alert('Preencha pelo menos uma série!')
 
    setExercicios(prev => [...prev, { nome: nomeEx, grupo: grupoSel, series: validas, obs }])
    setNomeEx('')
    setObs('')
    setSeries([{ peso: '', reps: '' }])
  }
 
  function salvarTreino() {
    if (!exercicios.length) return alert('Adicione pelo menos um exercicio!')
    const salvos = JSON.parse(localStorage.getItem('gymlog') || '[]')
    const novoTreino = {
      id: Date.now(),
      data: new Date().toDateString(),
      grupos: [...new Set(exercicios.map(e => e.grupo))],
      exercicios
    }
    localStorage.setItem('gymlog', JSON.stringify([novoTreino, ...salvos]))
    setExercicios([])
    setGrupoSel('')
    setSeries([{ peso: '', reps: '' }])
    setAba('historico')
    alert('Treino salvo!')
  }

  function deletarTreino(id) {
    const novos = historico.filter(t => t.id !== id)
    localStorage.setItem('gymlog', JSON.stringify(novos))
    
    window.location.reload()
  }
 
  const hoje = new Date()
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const historico = JSON.parse(localStorage.getItem('gymlog') || '[]')
 
  return (
    <>
      <section id="center">

        <div className="k1">

          <div id="text">
            <h1>GYM LOG</h1>
            <p>seu diario de treino</p>
          </div>
  
          <div className="data">
            <p><span>{hoje.getDate()}</span> {meses[hoje.getMonth()]}</p>
          </div>

        </div>
        
        <div id="btn">
          <button className={aba === 'novo' ? 'ativo' : ''} onClick={() => setAba('novo')}>Novo treino</button>
          <button className={aba === 'historico' ? 'ativo' : ''} onClick={() => setAba('historico')}>Historico</button>
        </div>
 
        {aba === 'novo' && (
          <>
            <p className="label">Grupo muscular</p>
            <div className="cards">
              {grupos.map(g => (
                <div
                  key={g.label}
                  className={`card ${grupoSel === g.label ? 'card-ativo' : ''}`}
                  onClick={() => setGrupoSel(g.label)}
                >
                  <span>{g.icon}</span>
                  <p>{g.label}</p>
                </div>
              ))}
            </div>
 
            <div id="form">
              <p className="label">Nome do exercício</p>
              <input
                placeholder="ex: Remada curvada, Rosca direta..."
                value={nomeEx}
                onChange={e => setNomeEx(e.target.value)}
              />
 
              <p className="label">Séries</p>
              {series.map((s, i) => (
                <div key={i} className="form-series">
                  <div>
                    <input
                      type="number"
                      placeholder="Peso (Kg)"
                      value={s.peso}
                      onChange={e => updateSerie(i, 'peso', e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                       placeholder="Reps"
                      value={s.reps}
                      onChange={e => updateSerie(i, 'reps', e.target.value)}
                    />
                  </div>
                  {series.length > 1 && (
                    <button className='btn-del-serie' onClick={() => removeSerie(i)}>x</button>
                  )}
                </div>
              ))}

              <button id="btn-add" onClick={addSerie}>+ adicionar série</button>

              <p className="label">Observações (opcional)</p>
              <input
                placeholder="ex: senti no bíceps, aumentar peso..."
                value={obs}
                onChange={e => setObs(e.target.value)}
              />
 
              <button id="btn-add" onClick={addExercicio}>+ adicionar exercício</button>
            </div>

            {exercicios.length > 0 && (
              <div id="lista-exercicios">
                <p className="label">Exercícios de hoje</p>
                {exercicios.map((ex, i) => (
                  <div key={i} className="exercicio-card">
                    <h3>{ex.nome}</h3>
                    <p className="grupo-tag">{ex.grupo}</p>
                    {ex.series.map((s, j) => (
                      <p key={j}>Série {j + 1}: {s.peso}kg x {s.reps} reps</p>
                    ))}
                    {ex.obs && <p className="obs">📝 {ex.obs}</p>}
                  </div>
                ))}
                <button id="btn-salvar" onClick={salvarTreino}>Salvar treino</button>
              </div>
            )}
          </>
        )}

        {aba === 'historico' && (
          <div className="historico">
            {historico.length === 0 ? (
              <p className="vazio">Nenhum treino encontrado. Bora começar!</p>
            ) : (
              historico.map(t => (
                <div key={t.id} className="treino-card">
                  <h3>{t.grupos.join(' + ')}</h3>
                  <p className="treino-data">{t.data}</p>
                  
                  {t.exercicios.map((ex, i) => (
                      <div key={i} className="historico-exercicio">
                        <p className="historico-nome">{ex.nome}</p>
                        {ex.series.map((s, j) => (
                          <p key={j} className="historico-serie">
                            Série {j + 1}: {s.peso}kg × {s.reps} reps
                          </p>
                        ))}
                      </div>
                    ))}
                    <button className="btn-deletar" onClick={() => deletarTreino(t.id)}>
                      Deletar treino
                    </button>
                </div>
              ))
            )}
          </div>
        )}

      </section>
    </>
  )
}
 
export default App