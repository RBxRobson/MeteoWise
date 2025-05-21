import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetCoordinatesByCityQuery } from '../../services/api'
import { RootState } from '../../store'
import { setCity } from '../../store/reducers/city'

const HeaderSearch = () => {
  const dispatch = useDispatch()
  const { name: currentCityName, state, country } = useSelector((state: RootState) => state.city)

  const initialValue = useMemo(
    () => `${currentCityName} - ${state}, ${country}`,
    [currentCityName, state, country],
  )

  const [inputValue, setInputValue] = useState(initialValue)
  const [searchTerm, setSearchTerm] = useState<string>(currentCityName)
  const [prevValue, setPrevValue] = useState(initialValue)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)

  const { data, isSuccess, isFetching } = useGetCoordinatesByCityQuery(searchTerm, {
    skip: !searchTerm,
  })

  useEffect(() => {
    if (isSuccess && data?.results?.length > 0) {
      const city = data.results[0]

      if (!city.feature_code || !['PPLC', 'PPLA', 'PPLA2', 'PPL'].includes(city.feature_code)) {
        alert('Desculpe, não temos cobertura na cidade solicitada.')
        setInputValue(prevValue) // Restaura o valor anterior
        setHasSubmitted(false)
        return
      }

      dispatch(
        setCity({
          coordinates: {
            latitude: city.latitude,
            longitude: city.longitude,
          },
          name: city.name,
          country: city.country,
          state: city.admin1,
        }),
      )

      setPrevValue(`${city.name} - ${city.admin1}, ${city.country}`) // Atualiza o valor anterior
      setInputValue(`${city.name} - ${city.admin1}, ${city.country}`)
      setHasSubmitted(false)
    }
  }, [isSuccess, data, dispatch, prevValue])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (inputValue.trim()) {
        setPrevValue(inputValue) // Guarda o valor antes da busca
        setSearchTerm(inputValue.trim())
        setHasSubmitted(true)
      }
    },
    [inputValue],
  )

  const handleFocus = useCallback(() => setInputValue(''), [])
  const handleBlur = useCallback(
    () => !hasSubmitted && setInputValue(prevValue),
    [hasSubmitted, prevValue],
  )

  return (
    <header className="w-full">
      <form
        className="text-txmain mx-auto flex max-w-3xl cursor-pointer items-center rounded-full border border-gray-300/30 backdrop-brightness-85"
        onSubmit={handleSubmit}
      >
        <label htmlFor="search_city" className="h-full cursor-pointer px-4 pl-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </label>
        <input
          id="search_city"
          className="w-full cursor-pointer py-4 text-xl outline-none"
          type="text"
          value={inputValue}
          placeholder="Buscar cidade"
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          className="h-full border-l border-gray-300/30 px-4 py-2 pr-6 disabled:bg-amber-950"
          type="submit"
          disabled={isFetching}
          aria-label="Buscar cidade"
        >
          <svg
            className="size-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </form>
    </header>
  )
}

export default HeaderSearch
