import { useState, useEffect, useRef } from 'react'
import Router from 'next/router'
import { post } from '../utils/requests'
import { genRndIntBetween, getCountIndices, useUpdate, genRndIntAmong } from '../utils/form'

export default function Form({ lastItemId, iterationCount, userName, setLoading }) {
  const [title, setTitle] = useState('Vamos Começar')
  const [didFormFinish, setFormFinish] = useState(false)
  const timers = useRef([])

  const [selectedOptions, setSelectedOptions] = useState([])
  const [options, setOptions] = useState([])
  const [seenCount, setSeenCount] = useState({ ...Array(lastItemId + 1).fill(0) })  // { index: count }
  const [seenPairs, setSeenPairs] = useState([])

  useEffect(() => {
    setTitle('Escolha uma paleta')

    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (didFormFinish) return

    const [lowestCountIndices] = getCountIndices(seenCount)
    const leftIndex = genRndIntAmong(lowestCountIndices)
    const previousPairingsWithLeftId = seenPairs.reduce((pairsFeaturingLeftId, pair) =>
      pair.includes(leftIndex) ? pairsFeaturingLeftId.concat(pair) : pairsFeaturingLeftId,
    [leftIndex])
    const rightIndex = genRndIntBetween(0, lastItemId, previousPairingsWithLeftId)
    
    setSeenPairs([...seenPairs, [leftIndex, rightIndex].sort()])
    setSeenCount({
      ...seenCount,
      [leftIndex]: (seenCount[leftIndex] || 0) + 1,
      [rightIndex]: (seenCount[rightIndex] || 0) + 1
    })
    setOptions([leftIndex, rightIndex])
    
  },
    [selectedOptions]
  )

  const onSelected = event => {
    setSelectedOptions([...selectedOptions, +event.currentTarget.id])
    iterationCount.current--
    if (iterationCount.current === 0) setFormFinish(true)
  }

  useUpdate(() => {
    const postToApi = async () => (
      await post('/api/form', {
        name: userName,
        pairs: seenPairs,
        selected: selectedOptions
      })
    )

    const onError = (error) => {
      console.error(error)
      setTitle('Infelizmente houve um erro. Você poderia tentar novamente?')
      timers.current.push(setTimeout(() => { setTitle('Recarregando...') }, 2000))
      timers.current.push(setTimeout(() => { Router.reload() }, 4000))
    }

    setTitle('...enviando respostas')
    setLoading(true)
    postToApi().then(response => {
      setLoading(false)

      if (response.error) {
        onError(response.error)
      } else {
        setTitle('Obrigado por participar!')
      }
    }).catch(onError)

  }, [didFormFinish])

  return (
    <>
      {!didFormFinish && <div className="grid">
        {options.map((optionId, i) => (
          <button 
            className="card"
            key={optionId}
            id={optionId}
            onClick={onSelected}
          >
              <img src={`./img/palette-${optionId}.png`}></img>
              <h3>{`Paleta ${i + 1}`}</h3>
          </button>
        ))}
      </div>}
      <h1 className="title">{title}</h1>
    </>
  )
}
