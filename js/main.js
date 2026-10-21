const productos = [
  { id: 1, nombre: "vela lavanda", precio: 8000 },
  { id: 2, nombre: "vela vainilla", precio: 9500 },
  { id: 3, nombre: "vela canela", precio: 12000 },
  { id: 4, nombre: "vela coco", precio: 8500 },
  { id: 5, nombre: "vela jazmin", precio: 9000 },
  { id: 6, nombre: "vela rosas", precio: 10000 },
  { id: 7, nombre: "vela limon", precio: 7800 },
  { id: 8, nombre: "vela cafe", precio: 9200 },
  { id: 9, nombre: "vela eucalipto", precio: 8800 },
  { id: 10, nombre: "vela chocolate", precio: 10500 },
  { id: 11, nombre: "vela sandalo", precio: 11000 },
  { id: 12, nombre: "vela frutilla", precio: 8300 }
]

const catalogoProductos = document.getElementById("catalogoProductos")
const carritoProductos = document.getElementById("carritoProductos")
const busqueda = document.getElementById("busqueda")
const total = document.getElementById("total")
const cantidadCarrito = document.getElementById("cantidadCarrito")
const feedback = document.getElementById("feedback")
const btnVaciar = document.getElementById("btnVaciar")
const btnFinalizar = document.getElementById("btnFinalizar")

const carritoGuardado = localStorage.getItem("carritoGenova")

let carrito = carritoGuardado
  ? JSON.parse(carritoGuardado)
  : []

function guardarCarrito() {
  localStorage.setItem("carritoGenova", JSON.stringify(carrito))
}

function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-ar")}`
}

function mostrarMensaje(mensaje, tipo) {
  feedback.textContent = mensaje
  feedback.className = `feedback ${tipo}`
}

function renderizarProductos(lista) {
  catalogoProductos.innerHTML = ""

  if (lista.length === 0) {
    const mensaje = document.createElement("p")
    mensaje.textContent = "no se encontraron productos."
    catalogoProductos.appendChild(mensaje)
    return
  }
  lista.forEach(producto => {
    const { id, nombre, precio } = producto

    const tarjeta = document.createElement("article")
    tarjeta.className = "producto"

    const titulo = document.createElement("h3")
    titulo.textContent = nombre

    const precioProducto = document.createElement("p")
    precioProducto.textContent = formatearPrecio(precio)

    const controles = document.createElement("div")
    controles.className = "controles-producto"

    const etiquetaCantidad = document.createElement("label")
    etiquetaCantidad.textContent = "cantidad:"
    etiquetaCantidad.htmlFor = `cantidad-${id}`

    const inputCantidad = document.createElement("input")
    inputCantidad.type = "number"
    inputCantidad.id = `cantidad-${id}`
    inputCantidad.min = "1"
    inputCantidad.value = "1"

    const btnAgregar = document.createElement("button")
    btnAgregar.type = "button"
    btnAgregar.textContent = "agregar al carrito"

    btnAgregar.addEventListener("click", () => {
      const cantidad = Number(inputCantidad.value)

      if (cantidad < 1 || isNaN(cantidad)) {
        mostrarMensaje("elegi una cantidad valida.", "error")
        return
      }

      agregarAlCarrito(producto, cantidad)
    })
    controles.appendChild(etiquetaCantidad)
    controles.appendChild(inputCantidad)
    controles.appendChild(btnAgregar)

    tarjeta.appendChild(titulo)
    tarjeta.appendChild(precioProducto)
    tarjeta.appendChild(controles)

    catalogoProductos.appendChild(tarjeta)
  })
}

function agregarAlCarrito(producto, cantidad) {
  const { id, nombre, precio } = producto

  const productoEnCarrito = carrito.find(item => item.id === id)

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += cantidad
  } else {
    carrito.push({ id, nombre, precio, cantidad })
  }

  guardarCarrito()
  renderizarCarrito()

  mostrarMensaje(`${nombre} fue agregado al carrito.`, "exito")
}

function aumentarCantidad(id) {
  const productoEnCarrito = carrito.find(item => item.id === id)

  productoEnCarrito.cantidad++

  guardarCarrito()
  renderizarCarrito()
}

function disminuirCantidad(id) {
  const productoEnCarrito = carrito.find(item => item.id === id)

  if (productoEnCarrito.cantidad > 1) {
    productoEnCarrito.cantidad--
  } else {
    carrito = carrito.filter(item => item.id !== id)
  }

  guardarCarrito()
  renderizarCarrito()
}

function eliminarProducto(id) {
  carrito = carrito.filter(item => item.id !== id)

  guardarCarrito()
  renderizarCarrito()

  mostrarMensaje("producto eliminado del carrio.", "error")
}

function renderizarCarrito() {
  carritoProductos.innerHTML = ""

  let totalCompra = 0
  let cantidadTotal = 0

  if (carrito.length === 0) {
    const mensaje = document.createElement("li")
    mensaje.textContent = "tu carrito esta vacio."
    carritoProductos.appendChild(mensaje)
  }

  carrito.forEach(item => {
    const { id, nombre, precio, cantidad } = item

    const fila = document.createElement("li")
    fila.className = "item-carrito"

    const descripcion = document.createElement("p")
    descripcion.textContent = `${nombre} - ${formatearPrecio(precio)}`

    const controles = document.createElement("div")
    controles.className = "controles-carrito"

    const btnMenos = document.createElement("button")
    btnMenos.type = "button"
    btnMenos.textContent = "-"

    btnMenos.addEventListener("click", () => {
      disminuirCantidad(id)
    })

    const cantidadProducto = document.createElement("span")
    cantidadProducto.textContent = cantidad

    const btnMas = document.createElement("button")
    btnMas.type = "button"
    btnMas.textContent = "+"

    btnMas.addEventListener("click", () => {
      aumentarCantidad(id)
    })

    const btnEliminar = document.createElement("button")
    btnEliminar.type = "button"
    btnEliminar.textContent = "eliminar"
    btnEliminar.className = "btn-eliminar"

    btnEliminar.addEventListener("click", () => {
      eliminarProducto(id)
    })

    controles.appendChild(btnMenos)
    controles.appendChild(cantidadProducto)
    controles.appendChild(btnMas)
    controles.appendChild(btnEliminar)

    fila.appendChild(descripcion)
    fila.appendChild(controles)

    carritoProductos.appendChild(fila)

    totalCompra += precio * cantidad
    cantidadTotal += cantidad
  })

  total.textContent = formatearPrecio(totalCompra)
  cantidadCarrito.textContent = `(${cantidadTotal})`
}

function filtrarProductos() {
  const texto = busqueda.value.toLowerCase()

  const productosFiltrados = productos.filter(producto => {
    const { nombre } = producto

    return nombre.toLowerCase().includes(texto)
  })

  renderizarProductos(productosFiltrados)
}

function vaciarCarrito() {
  carrito = []

  guardarCarrito()
  renderizarCarrito()

  mostrarMensaje("el carrito fue vaciado.", "error")
}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje("no podes finalizar una compra con el carrito vacio.", "error")
    return
  }

  const compraConfirmada = confirm("queres finalizar tu compra?")

  if (compraConfirmada) {
    carrito = []

    guardarCarrito()
    renderizarCarrito()

    mostrarMensaje("compra finalizada. gracias por elegir genova.", "exito")
  }
}

busqueda.addEventListener("keyup", filtrarProductos)
btnVaciar.addEventListener("click", vaciarCarrito)
btnFinalizar.addEventListener("click", finalizarCompra)

renderizarProductos(productos)
renderizarCarrito()