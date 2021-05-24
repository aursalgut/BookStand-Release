const {firestore} = require("firebase-admin");
const admin = require("firebase-admin");
// Constantes para la base de datos
const usuarios = "usuarios";
const notificaciones = "notificaciones";
const libros = "libros";
const prestamos = "prestamos";

// The database reference to perform writes and updates
const db = admin.firestore();

// Referencia a las plataforma de Cloud Messaging
const messaging = admin.messaging();

/**
 * Clase que contiene un conjunto de funciones auxiliares para simplificar el
 * código de las funciones de Cloud
 */
class Utilidades {
  /**
   * Función para crear una notificación y añadirla a la base de datos del
   * destino
   * @param {object} datosOrigen
   * @param {string} uidDestino
   * @param {object} mensaje
   * @param {string} tipo
   * @param {object} prestamo
   */
  static agregarNotificacion(datosOrigen, uidDestino, mensaje, tipo, prestamo) {
    let notificacion;

    if (prestamo !== undefined) {
      notificacion = {
        origen: {
          uid: datosOrigen.uid,
          nombre: datosOrigen.nombre,
          foto: datosOrigen.foto,
        },
        titulo: mensaje.notification.title,
        cuerpo: mensaje.notification.body,
        tipo: tipo,
        leida: false,
        prestamo: prestamo,
        fecha: admin.firestore.Timestamp.now(),
      };
    } else {
      notificacion = {
        origen: {
          uid: datosOrigen.uid,
          nombre: datosOrigen.nombre,
          foto: datosOrigen.foto,
        },
        titulo: mensaje.notification.title,
        cuerpo: mensaje.notification.body,
        tipo: tipo,
        leida: false,
        fecha: admin.firestore.Timestamp.now(),
      };
    }

    db.collection(usuarios)
        .doc(uidDestino)
        .collection(notificaciones)
        .add(notificacion);
  }

  /**
   * Función que agrega los datos de un libro prestado a la base de
   * datos del usuario deudor de un préstamo
   * @param {object} prestamo
   */
  static agregarLibro(prestamo) {
    // Obtenemos la información del libro que se presta
    db.collection(usuarios)
        .doc(prestamo.uidPrestador)
        .collection(libros)
        .doc(prestamo.isbn)
        .get()
        .then((bookRef) => {
        // Obtenemos los datos del libro
          const datosLibro = bookRef.data();

          /* Solo pasaremos al usuario deudor los datos básicos (título, isbn,
          autores y géneros) */
          const libro = {
            titulo: datosLibro.titulo,
            autores: datosLibro.autores,
            isbn: datosLibro.isbn,
            generos: datosLibro.generos,
            prestado: "DEUDOR",
            esPropietario: false,
          };

          /* Añadimos el libro a la base de datos del deudor */
          db.collection(usuarios)
              .doc(prestamo.uidDeudor)
              .collection(libros)
              .doc(prestamo.isbn)
              .set(libro);
        })
        .catch((error) =>
          console.error("Error al incluir los datos del libro", error),
        );
  }

  /**
   * Función que envía un mensaje a un dispositivo a través de Cloud Messaging
   * @param {string} tokenDestino
   * @param {object} mensaje
   */
  static enviarMensaje(tokenDestino, mensaje) {
    // Enviamos el mensaje de la notificación solo si tenemos un Token
    if (tokenDestino) {
      messaging
          .sendToDevice(tokenDestino, mensaje)
          .then((IdMensaje) => {
            console.log("Se ha enviado un mensaje correctamente: " + IdMensaje);
          })
          .catch((error) => {
            console.log("Error al enviar el mensaje " + error);
          });
    }
  }

  /**
   * Función que obtiene los nombres y uids del origen y el destino de una
   * notificación relacionada con los préstamos
   * @param {object} prestamo
   * @param {string} origen
   * @return {object} datos
   */
  static obtenerOrigenDestino(prestamo, origen) {
    let datosDestino;
    let datosOrigen;
    if (origen === prestamo.uidDeudor) {
      datosDestino = {
        uid: prestamo.uidPrestador,
        nombre: prestamo.nombrePrestador,
      };
      datosOrigen = {
        uid: prestamo.uidDeudor,
        nombre: prestamo.nombreDeudor,
      };
    } else if (origen === prestamo.uidPrestador) {
      datosOrigen = {
        uid: prestamo.uidPrestador,
        nombre: prestamo.nombrePrestador,
      };
      datosDestino = {
        uid: prestamo.uidDeudor,
        nombre: prestamo.nombreDeudor,
      };
    }

    const datos = {
      origen: datosOrigen,
      destino: datosDestino,
    };
    return datos;
  }

  /**
   * Función para enviar el registro de un préstamo de la base de datos de un
   * usuario
   * @param {string} usuario
   * @param {object} prestamo
   */
  static eliminarRegistroPrestamo(usuario, prestamo) {
    db.collection(usuarios)
        .doc(usuario)
        .collection(libros)
        .doc(prestamo.isbn)
        .collection(prestamos)
        .doc(prestamo.id)
        .delete()
        .catch((error) => console.log(error));
  }

  /**
   * Función para cambiar el estado de un préstamo en la base de datos de un
   * usuario
   * @param {string} usuario
   * @param {obtect} prestamo
   * @param {string} estado
   */
  static cambiarEstadoPrestamo(usuario, prestamo, estado) {
    firestore()
        .collection(usuarios)
        .doc(usuario)
        .collection(libros)
        .doc(prestamo.isbn)
        .collection(prestamos)
        .doc(prestamo.id)
        .update({estado: estado})
        .catch((error) =>
          console.log("Error al cambiar el estado del préstamo", error),
        );
  }

  /**
   * Función para cambiar el estado de un libro en la base de datos del usuario
   * @param {string} usuario
   * @param {string} libro
   * @param {string} estado
   */
  static cambiarEstadoLibro(usuario, libro, estado) {
    firestore()
        .collection(usuarios)
        .doc(usuario)
        .collection(libros)
        .doc(libro)
        .update({prestado: estado})
        .catch((error) =>
          console.log("Error actualizando el estado del libro", error),
        );
  }
}

module.exports = Utilidades;
