function Navbar({ imagenUrl, opciones }) {
  return (
    <nav className="navbar">
      <img src={imagenUrl} alt="Logo" />
      <ul>
        {opciones.map((opcion) => (
          <li key={opcion.nombre}>
            <a href={opcion.url}>{opcion.nombre}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
