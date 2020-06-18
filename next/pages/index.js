import { useState, useRef } from 'react'
import { validateIp } from './api/form'
import Form from '../components/Form'
import WelcomeScreen from '../components/WelcomeScreen'
import NextProgress from '../components/NProgress'

export default function Home({ canSubmit, lastItemId, maxIterations }) {
  const [formDidStart, setFormStart] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const iterationCount = useRef(maxIterations)

  return (
    <main className="container">
        <NextProgress isLoading={isLoading} />
        {formDidStart
         ? <Form
            lastItemId={lastItemId}
            iterationCount={iterationCount}
            userName={userName}
            setLoading={setLoading}
          />
         : <WelcomeScreen 
            canSubmit={canSubmit}
            setFormStart={setFormStart}
            setUserName={setUserName}
          />}
    </main>
  )
}
// test

export async function getServerSideProps({ req }) {
  const canSubmit = await validateIp(req).catch(err => { console.error(err); return false }).then(res => res)

  return {
    props: {
      canSubmit,
      lastItemId: 5,
      maxIterations: 15
    }
  }
}
