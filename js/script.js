//Codigo simulador de tienda de guitarras
class Guitarra {
  constructor(guitarra, cantidad) {
    this.id = guitarra.id;
    this.marca = guitarra.marca;
    this.modelo = guitarra.modelo;
    this.precio = guitarra.precio;
    this.cantidad = cantidad;
    this.precioTotal = guitarra.precio;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  quitarUnidad() {
    this.cantidad--;
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}

let guitarras = [];
//funcion para elminar un solo objeto
function eliminarDelCarrito(id) {
  //buscamos por id y por el indice del producto
  let guitarra = carrito.find((guitarra) => guitarra.id === id);

  let index = carrito.findIndex((element) => element.id === guitarra.id);

  //Este if decide si quita una unidad, o elimina el array
  if (guitarra.cantidad > 1) {
    carrito[index].quitarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    carrito.splice(index, 1);
  }

  Toastify({
    text: "Producto Eliminado",
    duration: 2000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #75024f, #e20d3b, #680101)",
    },
  }).showToast();

  //como siempre que se modifica el array, actulizamos el LocalStorage
  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);

  if (carrito.length === 0) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "No quedan productos en el carrito",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("tablaCarrito").innerHTML = "";
    document.getElementById("acciones-carrito").innerHTML = "";
  }
}

//imprime una tabla en el html del carrito.
function imprimirTabla(array) {
  let precioTotal = obtenerPrecioTotal(array);
  let contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  let tabla = document.createElement("div");

  tabla.innerHTML = `
          <table id="tablaCarrito" class="table table-striped">
              <thead>         
                  <tr>
                      <th class="fs-4">Guitarra</th>
                      <th class="fs-4">Cantidad</th>
                      <th class="fs-4">Precio</th>
                      <th class="fs-4">Accion</th>
                  </tr>
              </thead>
  
              <tbody id="bodyTabla">
              </tbody>
          </table>
      `;

  contenedor.appendChild(tabla);

  let bodyTabla = document.getElementById("bodyTabla");

  for (let guitarra of array) {
    let datos = document.createElement("tr");
    datos.innerHTML = `
                  <td class="fw-bold">${guitarra.marca}</td>
                  <td class="fw-bold">${guitarra.cantidad}</td>
                  <td class="fw-bold">$${guitarra.precioTotal}</td>
                  <td><button id="eliminar${guitarra.id}" class="btn btn-dark">Eliminar</button></td>
        `;

    bodyTabla.appendChild(datos);

    let botonEliminar = document.getElementById(`eliminar${guitarra.id}`);
    botonEliminar.addEventListener("click", () =>
      eliminarDelCarrito(guitarra.id)
    );
  }

  let accionesCarrito = document.getElementById("acciones-carrito");
  accionesCarrito.innerHTML = `
          <h5>PrecioTotal: $${precioTotal}</h5></br>
          <button id="vaciarCarrito" class="btn btn-dark">Vaciar Carrito</button>
          <button id="comprar" class="btn btn-primary">Comprar</button>
      `;

  let botonVaciarCarrito = document.getElementById("vaciarCarrito");
  botonVaciarCarrito.addEventListener("click", () => {
    Toastify({
      text: "Carrito Vaciado",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #b8f70c, #e22020)",
      },
    }).showToast();
    eliminarCarrito();
  });

  let botonComprar = document.getElementById("comprar");
  botonComprar.addEventListener("click", () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `Esta seguro de realizar la compra por $${precioTotal}`,
        text: "Por favor revise la informacion antes de confirmar su compra",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            "¡Compra Realizada!",
            "Gracias por elegirnos",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Compra Cancelada",
            "¡Vamos! Sigamos buscando!",
            "error"
          );
        }
      });
    comprar();
  });
}

//Funcion para chequear si el contenido del carrito esta en el Storage
function chequearCarritoEnStorage() {
  let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

  //control de flujo para actualizar en la tabla las compras
  if (contenidoEnStorage) {
    let array = [];

    for (const objeto of contenidoEnStorage) {
      let guitarra = new Guitarra(objeto, objeto.cantidad);
      guitarra.actualizarPrecioTotal();
      array.push(guitarra);
    }

    imprimirTabla(array);
    //Aca retorna un array con los nuevos datos
    return array;
  }

  //Retorna un array vacio si no existe el array en el LocalStorage
  return [];
}

//Funcion para imprimir en el HTML
function cargarDom(array) {
  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  //creacion de Cartas, por cada objeto del array guitarras
  for (const guitarra of array) {
    let carta = document.createElement("div");

    carta.innerHTML = `
          <div class="card text-center" style="width: 15rem;">
          <div class="card-body">
          <img src="${guitarra.img}" id="" class="card-img-top img-fluid" alt="">
          <h2 class="card-title">${guitarra.marca}</h2>
          <h5 class="card-subtitle mb-2 text-primary">${guitarra.modelo}</h5>
          <p class="card-text fw-bold">$${guitarra.precio}</p>
          
          <div class="btn-group" role="group" aria-label="Basic mixed styles example">
          <button id="agregar${guitarra.id}" type="button" class="btn btn-dark"> Agregar al Carrito </button>
          </div>
          </div>
          </div>      
          `;

    contenedor.appendChild(carta);
    let boton = document.getElementById(`agregar${guitarra.id}`);

    boton.addEventListener("click", () => {
      Toastify({
        text: `${guitarra.marca} ${guitarra.modelo} Agregada al carrito`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();

      agregarAlCarrito(guitarra.id);
    });
  }
}

//Agregar productos al carrito
function agregarAlCarrito(idProducto) {
  //usando el metodo find encontramos el primer objeto del array
  let guitarraCarrito = carrito.find((guitarra) => guitarra.id === idProducto);

  //cuando el metodo find devuelva true entra en el if que busca el index donde se encuentra el elemento
  if (guitarraCarrito) {
    let index = carrito.findIndex(
      (elemento) => elemento.id === guitarraCarrito.id
    );
    //agrega, repite y actualiza el precio total
    carrito[index].agregarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    //si no se encuentra, lo pusheamos y le asignamos la clase Guitarra
    //inicializamos la propiedad cantidad en 1
    let cantidad = 1;
    carrito.push(new Guitarra(guitarras[idProducto], cantidad));
  }

  //se actualiza el LocalStorage como cada vez que el array es modificado
  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);
}

//Funcion para vaciar el carrito completo
function eliminarCarrito() {
  //al largo del array lo dejamos en 0
  carrito.length = 0;
  //removemos los datos del localstorage
  localStorage.removeItem("carritoEnStorage");

  document.getElementById("carrito").innerHTML = "";
  let vaciarElCarrito = document.getElementById("acciones-carrito");
  vaciarElCarrito.innerHTML = "";
}

function obtenerPrecioTotal(array) {
  return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function comprar() {
  //Luego de comprar vaciamos el carrito
  //Y vaciamos el localStorage
  carrito.length = 0;
  localStorage.removeItem("carritoEnStorage");

  document.getElementById("carrito").innerHTML = "";
  document.getElementById("acciones-carrito").innerHTML = "";
}

//Con el metodo filter filtramos la busqueda por marca y modelo de las guitarras
function filtrarBusqueda(element) {
  element.preventDefault();

  let ingreso = document.getElementById("busqueda").value.toLowerCase();
  let arrayFiltrado = guitarras.filter(
    (elemento) =>
      elemento.marca.toLowerCase().includes(ingreso) ||
      elemento.modelo.toLocaleLowerCase().includes(ingreso)
  );

  cargarDom(arrayFiltrado);

  // una vez filtrado agregamos como parametro el array filtrado a la funcion que imprime en el html
}

// Funcion asincronica que llama los datos del archivo json
const pedirDatos = async () => {
  try {
    const datosSinProcesar = await fetch("./json/productos.json");
    let datosProcesados = await datosSinProcesar.json();

    //agrego al array de guitarras cada objeto del archivo json
    datosProcesados.forEach((producto) => {
      guitarras.push(producto);
    });
    //capturo el error
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Los productos no pueden ser cargados en este momento",
      text: `${error}`,
    });
  } finally {
    cargarDom(guitarras);
  }
};

let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

//App Web, llama a la funcion que pide los datos al fetch, y a la funcion que redendiza los productos
const tiendaDeGuitarrasApp = () => {
  pedirDatos();
  cargarDom(guitarras);
};

tiendaDeGuitarrasApp();

//carrito de compras
const carrito = chequearCarritoEnStorage();
