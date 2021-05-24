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

// The database reference to perform writes and updates
const db = admin.firestore();

const utilidades = require("../utilidades");

exports.nuevoPrestamo = functions.firestore
    .document(
        `${usuarios}/{user_id}/${libros}/{lido_id}/${prestamos}/{prestamo_id}`)
    .onCreate((snapshot, context) => {
      /* Cuando agregamos un préstamo por primera vez, debemos enviar una
      notificación al deudor para confirmar el préstamo o, si acabamos de
      aceptar un préstamo, actualizar la base de datos del prestador*/

      // Los datos del préstamo son:
      const prestamo = snapshot.data();

      if (prestamo.estado === EstadoConfirmacion.pendienteCreacion) {
        /* En este caso, el prestador acaba de prestar un libro al deudor.
        Ddebemos enviar una notificación al deudor para confirmar el préstamo */
        // Destino: el usuario a quien queremos prestar el libro
        // Origen: el usuario que ha prestado el libro
        const destino = prestamo.uidDeudor;
        const datosOrigen = {
          uid: prestamo.uidPrestador,
          nombre: prestamo.nombrePrestador,
        };

        /* Obtenemos el token de registro del dispositivo destino para poder
        enviar una notificación */
        db.collection(usuarios)
            .doc(destino)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              // Construimos el mensaje de la notificación
              const mensaje = {
                notification: {
                  title: "Nuevo préstamo",
                  body: datosOrigen.nombre +
                          " quiere prestarte el libro " + prestamo.titulo,
                },
              };

              // Enviamos el mensaje de la notificación
              utilidades.enviarMensaje(tokenDestino, mensaje);

              /* Y añadimos la notificación a la base de datos de notificaciones
              del destinatario */
              utilidades.agregarNotificacion(datosOrigen, destino, mensaje,
                  TipoNotificacion.confirmacionPrestamo, prestamo);
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      } else if (prestamo.estado === EstadoConfirmacion.denegadoCreacion) {
        // Se ha denegado el préstamo del libro
        // Obtenemos origen y destino de los mensajes FCM
        const destino = prestamo.uidPrestador;
        const datosOrigen = {
          uid: prestamo.uidDeudor,
          nombre: prestamo.nombreDeudor,
        };

        /* Obtenemos el token de registro del destino para poder enviar una
        notificación */
        db.collection(usuarios)
            .doc(destino)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              // Construimos el mensaje de la notificación
              const mensaje = {
                notification: {
                  title: "Denegación de préstamo",
                  body: datosOrigen.nombre +
                          " ha denegado el préstamo del libro " +
                          prestamo.titulo,
                },
              };

              // Enviamos el mensaje
              utilidades.enviarMensaje(tokenDestino, mensaje);

              /* Y añadimos la notificación a la base de datos de
              notificaciones del destinatario */
              utilidades.agregarNotificacion(datosOrigen, destino, mensaje,
                  TipoNotificacion.info, prestamo);

              /* Eliminamos los registros del préstamo de ambas partes*/
              utilidades.eliminarRegistroPrestamo(destino, prestamo);
              utilidades.eliminarRegistroPrestamo(datosOrigen.uid, prestamo);

              // Adicionalmente, para el destino, cambiamos el estado del libro
              utilidades.cambiarEstadoLibro(destino, prestamo.isbn, "NINGUNO");
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      } else if (prestamo.estado === EstadoConfirmacion.confirmadoCreacion) {
        /* En este caso, el deudor acaba de confirmar que le han prestado un
        libro. Ddebemos enviar una notificación al prestador para informarle
        de que se ha confirmado el préstamo */
        // Destino: el usuario que presta el libro
        // Origen: el usuario deudor
        const destino = prestamo.uidPrestador;
        const datosOrigen = {
          uid: prestamo.uidDeudor,
          nombre: prestamo.nombreDeudor,
        };

        /* Obtenemos el token de registro del destino para poder enviar una
        notificación */
        db.collection(usuarios)
            .doc(destino)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              // Construimos el mensaje de la notificación
              const mensaje = {
                notification: {
                  title: "Confirmación de préstamo",
                  body: datosOrigen.nombre +
                          " ha confirmado el préstamo del libro " +
                          prestamo.titulo,
                },
              };

              // Enviamos el mensaje
              utilidades.enviarMensaje(tokenDestino, mensaje);

              /* Y añadimos la notificación a la base de datos de
              notificaciones del destinatario */
              utilidades.agregarNotificacion(datosOrigen, destino, mensaje,
                  TipoNotificacion.info, prestamo);

              /* Actualizamos el préstamo que ya no está pendiente de
              confirmación por el deudor en la base de datos del PRESTADOR */
              utilidades.cambiarEstadoPrestamo(destino, prestamo,
                  EstadoConfirmacion.ocioso);

              // Finalmente, añadimos los datos del libro a la base de
              // datos del DEUDOR
              utilidades.agregarLibro(prestamo);
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      }

      return Promise.resolve();
    });
