const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Constantes para la base de datos
const usuarios = "usuarios";
const libros = "libros";
const prestamos = "prestamos";
const TipoNotificacion = {
  actualizacionPrestamo: "ACTUALIZACION_PRESTAMO",
  info: "INFO",
  confirmacionPrestamo: "CONFIRMACION_PRESTAMO",
};
const EstadoConfirmacion = {
  pendienteCreacion: "PEND_CREACION",
  confirmadoCreacion: "OK_CREACION",
  pendienteModificacion: "PEND_MODIFICACION",
  confirmadoModificacion: "OK_MODIFICACION",
  pendienteDevolucion: "PEND_DEVOLUCION",
  confirmadoDevolucion: "OK_DEVOLUCION",
  denegadoCreacion: "DEN_CREACION",
  degenadoModidicacion: "DEN_MODIFICACION",
  denegadoDevolucion: "DEN_DEVOLUCION",
  ocioso: "OCIOSO",
};

/* FIXME: Cuando actualizamos un préstamo el mensaje de confirmación
que se envía es "Se ha devuelto el libroundefined correctamente" */

// The database reference to perform writes and updates
const db = admin.firestore();

const utilidades = require("../utilidades");

exports.actualizarPrestamo = functions.firestore
    .document(
        `${usuarios}/{user_id}/${libros}/{lido_id}/${prestamos}/{prestamo_id}`)
    .onUpdate((change, context) => {
      /* Cuando se actualiza un préstamo, debemos enviar una notificación al
      otro extremo para confirmar los detalles */
      /* Habrá que notificar a la otra parte. El destino será el UID que no
      coincida con user_id (el origen) */

      // Los datos del préstamo son:
      const prestamo = change.after.data();

      // Obtenemos los datos del origen y el destino para la notificación
      // El origen es del usuario que genera el evento (user_id)
      const origen = context.params.user_id;

      // El destino será el UID que no sea el origen
      const datos = utilidades.obtenerOrigenDestino(prestamo, origen);
      const datosOrigen = datos.origen;
      const destino = datos.destino.uid;

      if (prestamo.estado === EstadoConfirmacion.pendienteModificacion ||
        prestamo.estado === EstadoConfirmacion.pendienteDevolucion) {
        // En este caso, se acaban de proponer los cambios del préstamo.
        /* Obtenemos el token de registro del dispositivo destino para poder
        enviar una notificación */
        db.collection(usuarios)
            .doc(destino)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              // Creamos un mensaje que será diferente según la situación
              let mensaje;
              if (prestamo.devuelto === true) {
                // Se quiere marcar el libro como devuleto
                mensaje = {
                  notification: {
                    title: "Devolución de libro",
                    body: datosOrigen.nombre +
                      " quiere marcar como devuelto el libro " +
                      prestamo.titulo,
                  },
                };
              } else {
                // Si no se ha marcado como devuelto, se ha modificado la fecha
                const fechaNueva = prestamo.fechaDevolucion;
                const fechaAntigua = change.before.data().fechaDevolucion;

                let cambio;
                if (fechaAntigua !== undefined) {
                  if (fechaAntigua < fechaNueva) {
                    cambio = "retrasar";
                  } else {
                    cambio = "adelantar";
                  }
                } else {
                  cambio = "establecer";
                }

                mensaje = {
                  notification: {
                    title: "Cambios en el préstamo de un libro",
                    body: datosOrigen.nombre +
                      " quiere " + cambio +
                      " la fecha de devolución del libro " +
                      prestamo.titulo,
                  },
                };
              }

              // Enviamos el mensaje de la notificación
              utilidades.enviarMensaje(tokenDestino, mensaje);

              /* Y añadimos la notificación a la base de datos de
                    notificaciones del destinatario */
              utilidades.agregarNotificacion(datosOrigen, destino, mensaje,
                  TipoNotificacion.actualizacionPrestamo, prestamo);
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      } else if (prestamo.estado === EstadoConfirmacion.confirmadoDevolucion ||
        prestamo.estado === EstadoConfirmacion.confirmadoModificacion) {
        /* En este caso, se acaban de aceptar los cambios  o la devolución del
        préstamo */

        /* Obtenemos el token de registro del destino para poder enviar una
        notificación */
        db.collection(usuarios)
            .doc(destino)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              // Creamos un mensaje que será diferente según la situación
              let mensaje;
              if (prestamo.devuelto === true) {
                // Se quiere marcar el libro como devuleto
                mensaje = {
                  notification: {
                    title: "Devolución de libro",
                    body: "Se ha devuelto el libro " + prestamo.titulo +
                      " correctamente",
                  },
                };
              } else {
                /* Si no se ha marcado el libro como devuelto, se han aceptado
                los cambios */
                mensaje = {
                  notification: {
                    title: "Cambios aceptados",
                    body: datosOrigen.nombre +
                      " ha aceptado los cambios en el préstamo del libro " +
                    prestamo.titulo,
                  },
                };
              }

              // Enviamos el mensaje
              utilidades.enviarMensaje(tokenDestino, mensaje);

              /* Y añadimos la notificación a la base de datos de
              notificaciones del destinatario */
              utilidades.agregarNotificacion(datosOrigen, destino, mensaje,
                  TipoNotificacion.info, prestamo);

              /* Actualizamos el préstamo que ya no está pendiente de
              confirmación por el deudor en la base de datos del destino */
              utilidades.cambiarEstadoPrestamo(destino, prestamo,
                  EstadoConfirmacion.ocioso);

              /* Finalmente, actualizamos los datos del libro del DESTINO
              (prestado a NINGUNO) si se ha devuelto el libro */
              if (prestamo.devuelto) {
                utilidades.cambiarEstadoLibro(destino, prestamo.isbn,
                    "NINGUNO");
              }
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      } else if (prestamo.estsado === EstadoConfirmacion.denegadoDevolucion ||
        prestamo.estado === EstadoConfirmacion.degenadoModidicacion) {
        // Se han denegado los cambios

        /* Obtenemos el token de registro del destino para poder enviar una
        notificación */
        db.collection(usuarios)
            .doc(destino)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              // Creamos un mensaje que será diferente según la situación
              let mensaje;
              if (prestamo.estado === EstadoConfirmacion.denegadoDevolucion) {
                mensaje = {
                  notification: {
                    title: "Devolución de libro rechazada",
                    body: datosOrigen.nombre +
                      " ha rechazado la devolución del libro " +
                      prestamo.titulo,
                  },
                };
              } else {
                /* Si se han rechazado los cambios */
                mensaje = {
                  notification: {
                    title: "Cambios rechazados",
                    body: datosOrigen.nombre +
                      " ha rechazado los cambios en el préstamo del libro " +
                    prestamo.titulo,
                  },
                };
              }

              // Enviamos el mensaje
              utilidades.enviarMensaje(tokenDestino, mensaje);

              /* Y añadimos la notificación a la base de datos de
              notificaciones del destinatario */
              utilidades.agregarNotificacion(datosOrigen, destino, mensaje,
                  TipoNotificacion.info, prestamo);

              /* Actualizamos el préstamo en la base de datos del origen */
              utilidades.cambiarEstadoPrestamo(origen, prestamo,
                  EstadoConfirmacion.ocioso);

              // Y el préstamo en el destino
              db.collection(usuarios)
                  .doc(destino)
                  .collection(libros)
                  .doc(prestamo.isbn)
                  .collection(prestamos)
                  .doc(prestamo.id)
                  .update({...prestamo, estado: EstadoConfirmacion.ocioso});
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      }

      return Promise.resolve();
    });
