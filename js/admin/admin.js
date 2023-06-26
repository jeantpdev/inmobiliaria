import config from '../supabase/config.js';

const Modelo = {

    async mostrarTodosAlquileres() {

        const res = await axios({
            method: "GET",
            url: `https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?select=*`,
            headers: config.headers,
        });
        return res;
    },

    async eliminarAlquileres(idAlquiler) {
        const res = await axios({
            method: "DELETE",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?id=eq." + idAlquiler,
            headers: config.headers,
        });
        return res;
    },

    async obtenerImagenIdPorUrl(imagenes) {

        const body = []


        for (const imagenUrl of imagenes) {

            try {
                const response = await axios({
                    method: "GET",
                    url: `https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/imagenes?imagen_url=eq.${imagenUrl}`,
                    headers: config.headers,
                });
                const registros = response.data;
                console.log(registros)
                for (let index = 0; index < registros.length; index++) {
                    body.push(registros[index].id_imagenes);
                }

            } catch (error) {
                console.error(error);
                return null;
            }
        }

        return body;

    },

    async obtenerCasaIdPorUrl(tituloAlquiler) {

        try {

            const response = await axios({
                method: "GET",
                url: `https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?nombre_alquiler=eq.${tituloAlquiler}`,
                headers: config.headers,
            });

            const registros = response.data;

            console.log(registros)

            if (registros.length > 0) {
                return registros[0].id;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async insertarImagenes(imagenes) {

        const imagenIds = [];

        for (const imagenUrl of imagenes) {

            const body = {
                imagen_url: imagenUrl
            }

            try {
                const response = await axios({
                    method: "POST",
                    url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/imagenes",
                    headers: config.headers,
                    data: body
                });
            } catch (error) {
                console.error(error);
                // Si ocurre un error al insertar una imagen, puedes manejarlo según tus necesidades
                // Por ejemplo, podrías lanzar una excepción y deshacer las inserciones anteriores
            }
        }
        return imagenIds;
    },

    async insertarDatosAlquiler(tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler, imagenUrls) {

        await Modelo.insertarImagenes(imagenUrls);

        const datos_insertar = {
            nombre_alquiler: tituloAlquiler,
            huespedes_alquiler: huespedesSelect,
            baños_alquiler: bañosSelect,
            cocina_alquiler: cocinaSelect,
            disponibilidad_alquiler: disponibilidadAlquiler,
            descripcion_alquiler: descripcionAlquiler,
        }

        const res = await axios({
            method: "POST",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres",
            headers: config.headers,
            data: datos_insertar
        });

        const casaId = await Modelo.obtenerCasaIdPorUrl(tituloAlquiler);
        const imagenIds = await Modelo.obtenerImagenIdPorUrl(imagenUrls);
        console.log("eSTA ES LA ID DE LA CASA", casaId);
        console.log("eSTA ES LA ID DE LA IMAGEN", imagenIds);

        return res;

    },

    async modificarDatosAlquiler(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler) {
        const datos_modificar = {
            id: idAlquiler,
            nombre_alquiler: tituloAlquiler,
            huespedes_alquiler: huespedesSelect,
            baños_alquiler: bañosSelect,
            cocina_alquiler: cocinaSelect,
            disponibilidad_alquiler: disponibilidadAlquiler,
            descripcion_alquiler: descripcionAlquiler,
        }

        const res = await axios({
            method: "PATCH",
            url: "https://ciyrwbjyrpspcejakytr.supabase.co/rest/v1/alquileres?id=eq." + idAlquiler,
            headers: config.headers,
            data: datos_modificar
        });
        return res;
    },

}

const Controlador = {

    async obtenerTodosAlquileres() {
        try {
            const response = await Modelo.mostrarTodosAlquileres();
            Vista.mostrarPropiedades(response.data);
        } catch (err) {
            console.log(err);
            Vista.mostrarMensajeError(err);
        }
    },

    async getDatosApartamentoModificar(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler) {
        try {
            const res = await Modelo.modificarDatosAlquiler(idAlquiler, tituloAlquiler, huespedesSelect, bañosSelect, cocinaSelect, disponibilidadAlquiler, descripcionAlquiler);
            let mensaje = "Los datos fueron modificados"
            Vista.mostrarAlertaSatisfactorio(mensaje);
        } catch (err) {
            console.log(err);
        }
    },

    async insertarImagenes(imagenes) {

        try {
            const response_img = await Modelo.insertarImagenes(imagenes);
            console.log(response_img)
        } catch (err) {
            console.log(err);
        }
    },

    async insertarAlquiler(tituloAlquilerInsertar, huespedesSelectInsertar, bañosSelectInsertar, cocinaSelectInsertar, disponibilidadAlquilerInsertar, descripcionAlquilerInsertar, imagenes) {

        try {
            //const response_img = await Modelo.insertarDatosAlquiler(imagenAlquiler1, imagenAlquiler2, imagenAlquiler3);

            const res = await Modelo.insertarDatosAlquiler(tituloAlquilerInsertar, huespedesSelectInsertar, bañosSelectInsertar, cocinaSelectInsertar, disponibilidadAlquilerInsertar, descripcionAlquilerInsertar, imagenes);

            let mensaje = "Los datos fueron insertados correctamente"
            Vista.mostrarAlertaSatisfactorio(mensaje);
            this.obtenerTodosAlquileres();
        } catch (err) {
            console.log(err);
        }
    },

    async eliminarDatosAlquiler(idAlquiler) {
        try {
            const res = await Modelo.eliminarAlquileres(idAlquiler);
            alert("Se elimino el registro");
        } catch (err) {
            console.log(err);
        }
    },

    abrirModalAgregar: function () {
        const modalAgregar = document.getElementById('modalAgregar');
        modalAgregar.style.display = 'block';
    },

}

const Vista = {

    crearTarjetaCasa: function (element, i, imagenesCortadas) {
        const contenidoAlquileres = document.createElement('div');
        contenidoAlquileres.classList.add("casa")
        contenidoAlquileres.innerHTML = `

  
      <div class="casa-imagen">
      <!-- <div class="${disponibilidad_alquiler(element.disponibilidad_alquiler)}">${element.disponibilidad_alquiler}</div> -->
        <div id="casaImagenes-${i}" class="casa-imagenes-slider"></div>
      </div>
  
      <div class="casa-contenido">
          <div class="casa-titulo">
              <p class="casa__titulo">${element.nombre_alquiler}</p>
          </div>
  
          <div class="casa-info">
              <p>${element.huespedes_alquiler} Huespedes</p>
              <p>${element.cocina_alquiler} Cocina</p>
              <p>${element.baños_alquiler} Baño</p>
          </div>
  
          <div class="casa-boton">
              <button id="btnAbrirModal" class="btn-mas-informacion-casas btn-primario">Mas información</button>
          </div>
  
      </div>
      `;

        //Se agregan todas las imagenes a .casa-imagenes-slider (creado anteriormente)
        const imagenesContainer = contenidoAlquileres.querySelector(`#casaImagenes-${i}`);
        this.agregarImagenesCasa(imagenesCortadas, imagenesContainer)
        return contenidoAlquileres;
    },

    agregarImagenesCasa: function (imagenesCortadas, imagenesContainer) {
        for (let index = 0; index < imagenesCortadas.length; index++) {
            const imagen = document.createElement('img');
            imagen.src = imagenesCortadas[index];
            imagen.className = "casa__imagen";
            imagenesContainer.appendChild(imagen);
        }
    },
    //editar
    llenarModal: function (element) {
        // Aquí puedes llenar el contenido del modal con la información específica
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.modal-contenido');

        modalContent.innerHTML = `
        <div class="modal-cabecera modal-editar-cabecera">
        <div class="modal-cabecera-boton">
            <span class="btn-cerrar-modal cerrar-modal-informacion" id="cerrarModal">&times;</span>
        </div>
    
        <div class="modal-cabecera-titulo">
            <h2>Editar apartamento</h2>
            <p class="casa__id" id="idAlquiler">${element.id}</p>
        </div>
    
    </div>
    
    <div class="modal-cuerpo modal-editar-cuerpo">
    
        <div class="modal-cuerpo-imagen" id="modalImagenes">
            <!-- Agrega un contenedor para el slider -->
            <div class="modal-imagenes-slider"></div>
        </div>
    
        <div class="modal-cuerpo-contenido">
    
            <div class="principal">
                <div class="titulo-casa">
                    <p>Titulo</p>
                    <input type="text" id="tituloAlquiler" class="titulo__casa" value="${element.nombre_alquiler}">
                </div>
            </div>
    
            <div class="secundario">
                <div class="disponibilidad-casa">
                    <p>Disponibilidad</p>
                    <select name="cars" id="disponibilidadSelect">
                        <option selected="selected">${element.disponibilidad_alquiler}</option>
                        <option value="Disponible">Disponible</option>
                        <option value="No disponible">No disponible</option>
                    </select>
                </div>
    
                <div class="huespedes-casa">
                    <p>Huespedes</p>
                    <select name="cars" id="huespedesSelect">
                        <option selected="selected">${element.huespedes_alquiler}</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="mas">10 o más</option>
                    </select>
                </div>
    
                <div class="baños-casa">
                    <p>Baños</p>
                    <select name="cars" id="bañosSelect">
                        <option selected="selected">${element.baños_alquiler}</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="mas">5 o más</option>
                    </select>
                </div>
    
                <div class="cocina-casa">
                    <p>Cocina</p>
                    <select name="cars" id="cocinaSelect">
                        <option selected="selected">${element.cocina_alquiler}</option>
                        <option value="Si">Si</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>
    
            <div class="terceario">
                <div class="descripcion-casa">
                    <p>Descripción</p>
                    <textarea name="" id="descripcionAlquiler" cols="60" rows="3">${element.descripcion_alquiler}</textarea>
                </div>
            </div>
    
        </div>
    </div>
    
    <div class="modal-pie modal-editar-pie">
        <button id="btnEditarDatosModal">Editar</button>
        <button id="btnEliminarDatosModal">Eliminar</button>
    </div>
      `;
        return modalContent
    },

    abrirModal: function () {
        modal.style.display = 'block';
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    },

    llenarModalContenido: function () {
        // Aquí puedes llenar el contenido del modal con la información específica
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.modal-contenido');

        modalContent.innerHTML = `
        <div class="modal-cuerpo">
            <div class="modal-cuerpo-imagen" id="modalImagenes"></div>
            <!-- Agrega un contenedor para el slider -->
            <div class="modal-imagenes-slider"></div>
        </div>
        
        <div class="modal-cuerpo-contenido">
            <div class="principal">
                <div class="titulo-casa">
                    <p>Titulo</p>
                    <input type="text" id="tituloAlquiler" class="titulo__casa" value="">
                </div>
            </div>
            <div class="secundario">
                <div class="disponibilidad-casa">
                    <p>Disponibilidad</p>
                    <select name="cars" id="disponibilidadSelect">
                        <option selected="selected"></option>
                        <option value="Disponible">Disponible</option>
                        <option value="No disponible">No disponible</option>
                    </select>
                </div>
        
                <div class="huespedes-casa">
                    <p>Huespedes</p>
                    <select name="cars" id="huespedesSelect">
                        <option selected="selected"></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="mas">10 o más</option>
                    </select>
                </div>
        
                <div class="baños-casa">
                    <p>Baños</p>
                    <select name="cars" id="bañosSelect">
                        <option selected="selected"></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="mas">5 o más</option>
                    </select>
                </div>
        
                <div class="cocina-casa">
                    <p>Cocina</p>
                    <select name="cars" id="cocinaSelect">
                        <option selected="selected"></option>
                        <option value="Si">Si</option>
                        <option value="No">No</option>
                    </select>
                </div>
        
                <div class="terceario">
                    <div class="descripcion-casa">
                        <p>Descripción</p>
                        <textarea name="" id="descripcionAlquiler"></textarea>
                    </div>
                </div>
        
            </div>
        </div>
        
        <div class="modal-pie">
            <button id="btnInsertarDatosModal">Insertar</button>
            <button id="btnEliminarDatosModal">Eliminar</button>
        
        </div>
        `;
        return modalContent
    },

    cerrarModal: function () {
        const botonCerrarModal = modal.querySelector('#cerrarModal');
        botonCerrarModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    },

    agregarImagenesModal: function (imagenesContainer, imagenesSeparadas) {
        // Agrega las imágenes al contenedor del slider
        for (let index = 0; index < imagenesSeparadas.length; index++) {
            const imagen = document.createElement('img');
            imagen.src = imagenesSeparadas[index];
            imagen.className = "casa__imagen";
            imagenesContainer.appendChild(imagen);
        }
    },

    carrouselImagenes: function (container) {
        tns({
            container: container,
            items: 1,
            slideBy: "page",
            navAsThumbnails: true,
            mouseDrag: true,
            swipeAngle: false,
            speed: 400,
            nav: true,
            controls: false,
            navPosition: "bottom"
        });
        return tns
    },

    mostrarPropiedades: function (data) {

        //Contenedor donde se mostrarán las imagenes
        const contenidoAlquileres = document.getElementById("adminContenido");
        const botonAgregarContenido = document.getElementById("btnAgregar")


        botonAgregarContenido.addEventListener('click', () => {
            this.abrirModal()
            this.llenarModalContenido();

        });

        //Muestra solamente 6 alquileres en la seccion de contenedor-alquileres
        for (let i = 0; i < data.length; i++) {
            const element = data[i];

            //Se guardan todas las imagenes
            let imaganesPorSeparar = data[i].imagen_alquiler;

            //Se retorna todas las imagenes separadas dentro de un array
            let imagenesSeparadas = separar_imagenes(imaganesPorSeparar)

            //crea toda la estructura de la casa incluyendo el botón que abre el modal (ventana emergente)
            const contenidoPropiedad = this.crearTarjetaCasa(element, i, imagenesSeparadas);

            //Busca el botón que abre el modal (creado dentro de la estructura de la casa)
            const botonAbrirModal = contenidoPropiedad.querySelector('.btn-mas-informacion-casas');

            botonAbrirModal.addEventListener('click', () => {
                const modalContent = this.llenarModal(element);
                const imagenesModal = modalContent.querySelector('.modal-imagenes-slider');
                this.agregarImagenesModal(imagenesModal, imagenesSeparadas);

                // Inicializa el slider
                this.carrouselImagenes(imagenesModal);

                // Abre el modal
                this.abrirModal();

                // Obtén el botón de cerrar modal y agrega el evento de clic
                this.cerrarModal();

            });

            contenidoAlquileres.append(contenidoPropiedad);
        }

        const sliders = document.querySelectorAll('.casa-imagenes-slider');
        sliders.forEach((imagenesPropiedades) => {
            this.carrouselImagenes(imagenesPropiedades);
        });
    },
    /* PAGINA PRINCIPAL */

    getDatosContenidoAgregar: function () {
        const nombreAlquiler = document.getElementById('nombreAlquiler').value;
        const huespedesAlquiler = document.getElementById('huespedesAlquiler').value;
        const bañosAlquiler = document.getElementById('bañosAlquiler').value;
        const cocinaAlquiler = document.getElementById('cocinaAlquiler').value;
        const descripcionAlquiler = document.getElementById('descripcionAlquiler').value;
        const imagenAlquiler = document.getElementById('imagenAlquiler').value;

        return { nombreAlquiler, huespedesAlquiler, bañosAlquiler, cocinaAlquiler, descripcionAlquiler, imagenAlquiler };
    },

    /* MENSAJES DE ERRORES */
    mostrarMensajeError(mensaje) {
        console.log(mensaje);
    }
}

function btn_whatsapp() {
    var chatCircle = document.getElementById("chat-circle");
    var chatBox = document.getElementById("chat-box");
    var chatBoxToggle = document.getElementById("chat-box-toggle");

    chatCircle.addEventListener("click", function () {
        chatBox.style.display = "block";
    });

    chatBoxToggle.addEventListener("click", function () {
        chatBox.style.display = "none";
    });
}

function separar_imagenes(imagenesACortar) {
    let imagenesCortadas = imagenesACortar.split(",");
    return imagenesCortadas
}

function disponibilidad_alquiler(disponibilidad) {
    if (disponibilidad == "Disponible") {
        return "alquiler-disponible";
    } else {
        return "alquiler-no-disponible";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.obtenerTodosAlquileres();
    btn_whatsapp();
})