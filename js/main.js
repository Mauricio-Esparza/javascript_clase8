const productosIniciales = [
  { id: 1, nombre: "vela lavnda", precio: 8000 },
  { id: 2, nombre: "vela vainilla", precio: 9500 },
  { id: 3, nombre: "vela canela", precio: 12000 }
]

const contenedor = document.querySelector("#contenedorProductos")
const feedback = document.querySelector("#feedback")
const form = document.querySelector("#formAgregar")
const busqueda = document.querySelector("#busqueda")

const carritoGuardado = localStorage.getItem("cart")

let velas = carritoGuardado
  ? JSON.parse(carritoGuardado)
  : [...productosIniciales]

let contadorId = velas.length > 0
  ? velas[velas.length - 1].id
  : 0

if (!carritoGuardado) {
  localStorage.setItem("cart", JSON.stringify(velas))
}

function guardarCarrito() {
  localStorage.setItem("cart", JSON.stringify(velas))
}

function renderizar(lista) {
  contenedor.innerHTML = ""

  if (lista.length === 0) {
    contenedor.innerHTML = "<li>No hay productos para mostrar.</li>"
    return
  }

  lista.forEach(({ id, nombre, precio }) => {
    const li = document.createElement("li")
    li.className = "producto"
    li.setAttribute("draggable", "true")

    li.innerHTML = `
      <h3>${nombre}</h3>
      <p>Precio: $${precio.toLocaleString("es-AR")}</p>
    `

    const btnEliminar = document.createElement("button")
    btnEliminar.type = "button"
    btnEliminar.textContent = "Eliminar"

    btnEliminar.addEventListener("click", () => {
      eliminar(id)
    })

    li.appendChild(btnEliminar)

    li.addEventListener("mouseenter", () => {
      feedback.textContent = `Sobre ${nombre}`
      feedback.style.color = "coral"
    })

    contenedor.appendChild(li)
  })
}

function aplicarBusqueda() {
  const texto = busqueda?.value.trim().toLowerCase() ?? ""

  const filtradas = velas.filter(vela =>
    vela.nombre.toLowerCase().includes(texto)
  )

  renderizar(filtradas)
}

function eliminar(id) {
  velas = velas.filter(vela => vela.id !== id)

  guardarCarrito()
  aplicarBusqueda()

  feedback.textContent = "Producto eliminado"
  feedback.style.color = "red"
}

form.addEventListener("submit", e => {
  e.preventDefault()

  const nombre = document.querySelector("#nombre")?.value.trim() ?? ""
  const precio = Number(document.querySelector("#precio")?.value ?? 0)

  if (nombre === "" || isNaN(precio) || precio <= 0) {
    feedback.textContent = "Ingresá un nombre y un precio válido"
    feedback.style.color = "red"
    return
  }

  contadorId++

  const nuevaVela = {
    id: contadorId,
    nombre,
    precio
  }

  velas.push(nuevaVela)

  guardarCarrito()
  aplicarBusqueda()

  feedback.textContent = `Vela "${nombre}" agregada`
  feedback.style.color = "green"

  form.reset()
})

busqueda.addEventListener("keyup", () => {
  aplicarBusqueda()
})

function vaciarCarrito() {
  velas = []

  guardarCarrito()
  renderizar(velas)

  feedback.textContent = "Carrito vacío"
  feedback.style.color = "brown"
}

function restablecerProductos() {
  velas = [...productosIniciales]
  contadorId = productosIniciales.length

  guardarCarrito()
  aplicarBusqueda()

  feedback.textContent = "Productos iniciales restaurados"
  feedback.style.color = "green"
}

renderizar(velas)