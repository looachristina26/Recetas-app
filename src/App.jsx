import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Card from './components/Card'
import Footer from './components/Footer'

function App() {
  const [recetas, setRecetas] = useState([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [seleccionada, setSeleccionada] = useState(null)

  const base = import.meta.env.BASE_URL

  const opciones = [
    { nombre: 'Inicio', url: base },
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
    setSeleccionada(null)
    traerRecetas(texto)
  }

  function ingredientesDe(receta) {
    const lista = []
    for (let i = 1; i <= 20; i++) {
      const ingrediente = receta['strIngredient' + i]
      const medida = receta['strMeasure' + i]
      if (ingrediente && ingrediente.trim() !== '') {
        lista.push((medida || '').trim() + ' ' + ingrediente.trim())
      }
    }
    return lista
  }

  return (
    <div>
      <Navbar imagenUrl={base + 'logo.svg'} opciones={opciones} />

      <main>
        {seleccionada ? (
          <div className="detalle">
            <button onClick={() => setSeleccionada(null)}>← Volver</button>
            <h1>{seleccionada.strMeal}</h1>
            <img
              src={seleccionada.strMealThumb}
              alt={seleccionada.strMeal}
              style={{ maxWidth: '100%', width: '400px' }}
            />
            <p>
              <strong>Categoría:</strong> {seleccionada.strCategory} |{' '}
              <strong>Origen:</strong> {seleccionada.strArea}
            </p>

            <h2>Ingredientes</h2>
            <ul>
              {ingredientesDe(seleccionada).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h2>Preparación</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{seleccionada.strInstructions}</p>
          </div>
        ) : (
          <>
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
                <div
                  key={receta.idMeal}
                  onClick={() => setSeleccionada(receta)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card
                    titulo={receta.strMeal}
                    imagen={receta.strMealThumb}
                    categoria={receta.strCategory}
                    origen={receta.strArea}
                    descripcion={(receta.strInstructions || '').slice(0, 100) + '...'}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App