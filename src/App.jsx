import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Card from './components/Card'
import Footer from './components/Footer'

function App() {
  const [recetas, setRecetas] = useState([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const opciones = [
    { nombre: 'Inicio', url: '/' },
  ]

  function traerRecetas(busqueda) {
    setCargando(true)
    setError('')

    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + busqueda)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error')
        }
        return res.json()
      })
      .then((data) => {
        // si no encuentra nada, la API devuelve null
        setRecetas(data.meals || [])
        setCargando(false)
      })
      .catch(() => {
        setError('No se pudieron cargar las recetas')
        setCargando(false)
      })
  }

  useEffect(() => {
    traerRecetas('')
  }, [])

  function buscar(e) {
    e.preventDefault()
    traerRecetas(texto)
  }

  return (
    <div>
      <Navbar imagenUrl="/logo.svg" opciones={opciones} />

      <main>
        <h1>Recetas del mundo</h1>

        <form onSubmit={buscar}>
          <input
            type="text"
            placeholder="Buscar receta (en inglés)"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        {cargando && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && !error && recetas.length === 0 && <p>No se encontraron recetas</p>}

        <div className="lista">
          {recetas.map((receta) => (
            <Card
              key={receta.idMeal}
              titulo={receta.strMeal}
              imagen={receta.strMealThumb}
              categoria={receta.strCategory}
              origen={receta.strArea}
              descripcion={(receta.strInstructions || '').slice(0, 100) + '...'}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
