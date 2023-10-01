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

//Array de objetos.
const guitarras = [
  {
    id: 0,
    marca: "Fender",
    modelo: "Telecaster",
    precio: 150000,
    img: "./img/fender.jpg",
  },
  {
    id: 1,
    marca: "Gibson",
    modelo: "Les Paul",
    precio: 200000,
    img: "./img/gibson.jpeg",
  },
  {
    id: 2,
    marca: "Yamaha",
    modelo: "Pacifica",
    precio: 130000,
    img: "./img/yamaha.jpg",
  },
  {
    id: 3,
    marca: "Gretsch",
    modelo: "Electromatic",
    precio: 320000,
    img: "./img/gretsch.jpg",
  },
  {
    id: 4,
    marca: "Ibanez",
    modelo: "J. Custom",
    precio: 180000,
    img: "./img/ibanez.jpg",
  },
  {
    id: 5,
    marca: "ESP",
    modelo: "Stratocaster",
    precio: 210000,
    img: "./img/esp.jpg",
  },
  {
    id: 6,
    marca: "Taylor",
    modelo: "Electroacustica",
    precio: 130000,
    img: "./img/taylor.jpg",
  },
  {
    id: 7,
    marca: "Martin",
    modelo: "Electroacustica",
    precio: 135000,
    img: "./img/martin.jpg",
  },
];

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

//Esta tabla tambien la saque de otro proyecto, fue lo mas simple que entendi para plasmar el carrito
function imprimirTabla(array) {
  let precioTotal = obtenerPrecioTotal(array);
  let contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  let tabla = document.createElement("div");

  tabla.innerHTML = `
          <table id="tablaCarrito" class="table table-striped">
              <thead>         
                  <tr>
                      <th>Guitarra</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Accion</th>
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
                  <td>${guitarra.marca}</td>
                  <td>${guitarra.cantidad}</td>
                  <td>$${guitarra.precioTotal}</td>
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
      comprar();4
      
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

  //creacion de Cards, por cada objeto del array guitarras
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

  let compra = document.getElementById("carrito");
  compra.innerHTML = "";

  compra.appendChild(texto);
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

let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

cargarDom(guitarras);

const carrito = chequearCarritoEnStorage();
