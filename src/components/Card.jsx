function Card({ titulo, imagen, categoria, origen, descripcion }) {
  return (
    <div className="card">
      <img src={imagen} alt={titulo} />
      <h3>{titulo}</h3>
      <p>Categoría: {categoria}</p>
      <p>Origen: {origen}</p>
      <p>{descripcion}</p>
    </div>
  )
}

export default Card
