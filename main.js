// Creo inventario vacio y id en 18 (dado que ya hay 17 productos cargados en el productos.json)
let inventario = [];
let id = 18;

// Creo constructor para crear nuevos productos
const Producto = function (id, nombre, marca, categoria, imagen, precio) {
  this.id = id,
    this.nombre = nombre,
    this.marca = marca,
    this.categoria = categoria,
    this.imagen = imagen,
    this.precio = precio
}

// Creo funcion que carga el inventario guardado en el localStorage; en caso que no exista nada en el localStorage, hace un fetch que carga el archivo productos.json
function cargarJSONoLocalStorage() {
  let elementosGuardados = localStorage.getItem("productos");
  let idGuardado = localStorage.getItem("id");
  if (elementosGuardados) {
    inventario = JSON.parse(elementosGuardados);
    id = idGuardado;
    mostrarProductos(inventario);
  } else {
    const archivojson = "./json/productos.json";
    fetch(archivojson)
      .then((resp) => resp.json())
      .then((data) => {
        inventario = data;
        mostrarProductos(inventario);
        guardarProductos();
      })
      .catch((error) => console.log(error))
      .finally(() => console.log("Proceso finalizado"))
  }
}
cargarJSONoLocalStorage();

// Creo funcion que guarda el inventario y el id en el localStorage
function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(inventario));
  localStorage.setItem("id", id);
}

// Creo funcion que primero limpia la grilla y luego recorre el array ingresado por parametro creando tarjetas HTML con sus propiedades y las va agregando a la grilla.
function mostrarProductos(dataProductos) {
  let productos = document.querySelector("#productos");
  productos.innerHTML = "";
  let tablaInventario = document.querySelector("#tablaInventario");
  tablaInventario.innerHTML = "";
  dataProductos.forEach(elemento => {
    const producto = document.createElement("div")
    producto.innerHTML =
      `<div class="productos__card">
        <img src=${elemento.imagen} class="productos__card__image" alt="${elemento.nombre}">
        <div class="productos__card__descripcion">
            <div class="productos__card__descripcion__brand"> ID: ${elemento.id}</div>
            <div class="productos__card__descripcion__brand"> ${elemento.marca}</div>
            <p class="productos__card__descripcion__name"> ${elemento.nombre}</p>
            <p class="productos__card__descripcion__price"> $ ${elemento.precio} </p>
            <div class="button_delete_edit">
            <button onclick="eliminarElemento(${elemento.id})" class="button_size"> <i class="bi bi-trash-fill"> </i> </button>
            <button onclick="editarElemento(${inventario.indexOf(elemento)})" class="button_size"> <i class="bi bi-pencil-fill"></i>  </button>
            </div>
        </div>
        </div>`
    productos.appendChild(producto)
  });
}

// Creo funcion que se llama para crear nuevos productos cuando se llama al evento del menu agregar, toma los campos, valida los datos, crea un nuevo producto y lo agrega al inventario.
function agregarProducto() {
  let nombre = document.querySelector("#nombre").value;
  let marca = document.querySelector("#marca").value;
  let categoria = document.querySelector("#categoria").value;
  let precio = Number(document.querySelector("#precio").value);
  // Valido que los datos ingresados, sean correctos, de lo contrario mando un alert y corto la funcion. 
  if (isNaN(precio) || nombre == "" || marca == "" || categoria == "") {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'INGRESA DATOS VALIDOS',
    })
    return;
  }
  let nuevoProducto = new Producto(id, nombre, marca, categoria, "./img/nuevoProducto.jpg", precio);
  inventario.push(nuevoProducto);
  Swal.fire({
    icon: 'success',
    title: '¡PRODUCTO AGREGADO!'
  })
  mostrarProductos(inventario);
  id++;
  guardarProductos();
  let menu = document.getElementById("menuAgregar");
  menu.style.display = "none";
  // Finalmente, vacio los campos luego de que se agrego el elemnto
  document.querySelector("#nombre").value = "";
  document.querySelector("#marca").value = "";
  document.querySelector("#categoria").value = "";
  document.querySelector("#precio").value = "";
}

// Creo funcion que despliega el "menu agregar" cuando se le da click al evento
function desplegarAgregar() {
  let menu = document.getElementById("menuAgregar");
  if (menu.style.display == "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
    menu.classList.add("formularioEnColumna");
  }
}

// Creo evento que se activa cuando se envia el menu agregar en el html.
let menuAgregar = document.getElementById("menuAgregar");
menuAgregar.addEventListener("submit", function (event) {
  event.preventDefault();
  agregarProducto();
});

// Creo funcion que se activa al darle click al boton eliminar de la tarjeta del producto en el html.
function eliminarElemento(id) {
  Swal.fire({
    title: '¿Estas seguro que quieres borrar este producto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si'
  }).then((result) => {
    if (result.isConfirmed) {
      inventario = inventario.filter(item => item.id !== id);
      Swal.fire(
        '¡Eliminado correctamente!',
        'El producto fue borrado',
        'success'
      )
      mostrarProductos(inventario);
      guardarProductos();
    }
  })
}

// Creo funcion que se activa cuando le doy click al input buscar
function buscarProducto() {
  let palabraABuscar = document.querySelector("#buscarInput").value.toUpperCase();
  console.log(palabraABuscar)
  let arrayFiltrado = inventario.filter((producto) => producto.nombre.toUpperCase().includes(palabraABuscar));
  if (arrayFiltrado.length > 0) {
    mostrarProductos(arrayFiltrado);
  } else {
    let productos = document.querySelector("#productos");
    productos.innerHTML = "";
    let mensaje = document.createElement("div");
    mensaje.innerText = "NO SE ENCONTRARON COINCIDENCIAS"
    productos.appendChild(mensaje)
  }
  document.querySelector("#buscarInput").value = "";
}

// Creo evento que disparara cuando le doy click al input buscar
let formBuscar = document.getElementById("formBuscar");
formBuscar.addEventListener("submit", function (event) {
  event.preventDefault();
  buscarProducto();
});

// Creo funcion que hace que el inventario se muestre en una tabla ocupando el DOM
function mostrarTablaInventario() {
  let productos = document.querySelector("#productos");
  productos.innerHTML = "";
  let tablaInventario = document.querySelector("#tablaInventario");
  tablaInventario.innerHTML = `
    <tr>
    <th scope="col">ID</th>
    <th scope="col">NOMBRE</th>
    <th scope="col">MARCA</th>
    <th scope="col">CATEGORIA</th>
    <th scope="col">PRECIO</th>
  </tr>
  `
  for (let i = 0; i < inventario.length; i++) {
    let fila = document.createElement("tr");
    let celdaId = document.createElement("td");
    celdaId.textContent = inventario[i].id;
    fila.appendChild(celdaId)
    let celdaNombre = document.createElement("td");
    celdaNombre.textContent = inventario[i].nombre;
    fila.appendChild(celdaNombre)
    let celdaMarca = document.createElement("td");
    celdaMarca.textContent = inventario[i].marca;
    fila.appendChild(celdaMarca)
    let celdaCategoria = document.createElement("td");
    celdaCategoria.textContent = inventario[i].categoria;
    fila.appendChild(celdaCategoria)
    let celdaPrecio = document.createElement("td");
    celdaPrecio.textContent = inventario[i].precio;
    fila.appendChild(celdaPrecio)
    tablaInventario.appendChild(fila);
  }
  let botonGrilla = document.createElement("div");
  botonGrilla.innerHTML = `<button onclick="mostrarProductos(inventario)" class="btn btn-primary">MOSTRAR INVENTARIO COMO GRILLA</button>`
  tablaInventario.appendChild(botonGrilla);
}


// Creo funcion que se dispara cuando le doy click al boton editarElemento de las tarjeta de html
async function editarElemento(indexEnInventario) {
  let productoEditado = {}
  await Swal.fire({
    title: 'Editor productos',
    html:
      '<label> Nombre: </label> <input id="swal-input1" class="swal2-input">' +
      '<label> Marca: </label> <input id="swal-input2" class="swal2-input">' +
      '<label> Categoria: </label> <input id="swal-input3" class="swal2-input">' +
      '<label> Precio: </label> <input id="swal-input4" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      let id = inventario[indexEnInventario].id
      let nombreEditado = document.getElementById('swal-input1').value;
      console.log(nombreEditado)
      let marcaEditado = document.getElementById('swal-input2').value;
      console.log(marcaEditado)
      let categoriaEditado = document.getElementById('swal-input3').value;
      let precioEditado = Number(document.getElementById('swal-input4').value);
      let imagen = inventario[indexEnInventario].imagen;
      if (isNaN(precioEditado) || nombreEditado == "" || marcaEditado == "" || categoriaEditado == "") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'INGRESA DATOS VALIDOS',
        })
        return;
      }
      return [
        productoEditado = new Producto(id, nombreEditado, marcaEditado, categoriaEditado, imagen, precioEditado)
      ]

    }
  })
  inventario[indexEnInventario] = productoEditado;
  mostrarProductos(inventario)
  guardarProductos();
  Swal.fire("Cambios cargados exitosamente");
}

// Creo funcion que identifica la pagina html en la que estamos posicionados y filtra el inventario segun la pagina.
let paginaHtml = window.location.pathname.split('/').pop();
switch (paginaHtml) {
  case "hombre.html":
    const Hombres = inventario.filter(elemento => elemento.categoria.toUpperCase() === "HOMBRE")
    Hombres.forEach(elemento =>{
      nuevaruta= "." + elemento.imagen
      elemento.imagen = nuevaruta
    });
    mostrarProductos(Hombres);
    mostrarTablaInventario
    break;
  case "mujer.html":
    const Mujeres = inventario.filter(elemento => elemento.categoria.toUpperCase() === "MUJER")
    Mujeres.forEach(elemento =>{
      nuevaruta= "." + elemento.imagen
      elemento.imagen = nuevaruta
    });
    mostrarProductos(Mujeres);
    break;
  case "accesorios.html":
    const Accesorios = inventario.filter(elemento => elemento.categoria.toUpperCase() === "ACCESORIO")
    Accesorios.forEach(elemento =>{
      nuevaruta= "." + elemento.imagen
      elemento.imagen = nuevaruta
    });
    mostrarProductos(Accesorios);
    break;
}
