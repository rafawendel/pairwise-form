import { useState } from "react"

export default function WelcomeScreen({ canSubmit, setFormStart, setUserName }) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('Vamos Começar')

  const onFormStart = () => {
    if (canSubmit) {
      setUserName(name)
      setFormStart(true)
    } else {
      setTitle('Você já submeteu este formulário. Obrigado por participar.')
    }
  }

  const formSubmitHandler = event => {
    event.preventDefault()
    return name ? onFormStart() : alert('O nome não deve estar vazio') 
  }

  return (
    <>
        <h1 className="title">{title}</h1>
        <form className="grid starter" action="#" onSubmit={formSubmitHandler}>
            <input
              value={name}
              className={`${!!name || 'empty'}`}
              placeholder="Insira seu nome"
              onChange={e => { setName(e.target.value.trim()) }}
            />
            <button
              className="card"
              type="submit"
            >
              <h3>Iniciar</h3>
            </button>
        </form>
    </>
  )
}
