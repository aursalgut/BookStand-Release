const functions = require("firebase-functions");
const admin = require("firebase-admin");

const utilidades = require("../utilidades");
// Constantes para la base de datos
const usuarios = "usuarios";
const contactos = "contactos";
const solicitudAmistad = "SOLICITUD_AMISTAD";
const info = "INFO";

// Referencia a la base de datos Firestore
const db = admin.firestore();

exports.nuevoContacto = functions.firestore
    .document(`${usuarios}/{user_id}/${contactos}/{contacto_id}`)
    .onCreate((snapshot, context) => {
      // El destino y el origen de la notificación son
      // Destino: el contacto que hemos añadido a la colección "contactos"
      const destino = snapshot.data();
      // Origen: el contacto que ha realizar la acción
      const origen = context.params.user_id;

      if (destino.esContacto === "PENDIENTE") {
        // En este caso, el origen mandará una solicitud de amistad al destino

        /* Obtenemos el token de registro del dispositivo destino para poder
        enviar una notificación */
        db.collection(usuarios)
            .doc(destino.uid)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              /* Obtenemos los datos del origen para añadir los datos a la
              notificación */
              db.collection(usuarios)
                  .doc(origen)
                  .get()
                  .then((respuestaOrigen) => {
                    // Los datos del usuario origen son:
                    const datosOrigen = respuestaOrigen.data();

                    // Construimos el mensaje de la notificación
                    const mensaje = {
                      notification: {
                        title: "¡Nueva solicitud de amistad!",
                        body: datosOrigen.nombre +
                          " quiere añadirte a sus contactos en BookStand",
                      },
                    };

                    // Enviamos el mensaje de la notificación
                    utilidades.enviarMensaje(tokenDestino, mensaje);


                    /* Y añadimos la notificación a la base de datos de
                    notificaciones del destinatario */
                    utilidades.agregarNotificacion(datosOrigen, destino.uid,
                        mensaje, solicitudAmistad);
                  })
                  .catch((error) => {
                    console.log(
                        "Error al obtener los datos del origen",
                        error);
                  });
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      } else if (destino.esContacto === "SI") {
        /* En este caso, el origen acaba de aceptar la solicitud de amistad del
        destino y le mandará una notificación */

        /* Obtenemos el token de registro del destino para poder enviar una
        notificación */
        db.collection(usuarios)
            .doc(destino.uid)
            .get()
            .then((respuestaDestino) => {
              // El token del destino
              const tokenDestino = respuestaDestino.data().token;

              /* Obtenemos los datos del origen para añadir los datos a la
              notificación */
              db.collection(usuarios)
                  .doc(context.params.user_id)
                  .get()
                  .then((respuestaOrigen) => {
                    // Los datos del usuario origen son:
                    const datosOrigen = respuestaOrigen.data();

                    // Construimos el mensaje de la notificación
                    const mensaje = {
                      notification: {
                        title: "¡Solicitud de amistad aceptada!",
                        body: datosOrigen.nombre +
                          " ha aceptado tu petición de amistad",
                        image: datosOrigen.foto,
                      },
                    };

                    // Enviamos el mensaje
                    utilidades.enviarMensaje(tokenDestino, mensaje);

                    // Y añadimos la notificación a la base de datos de
                    // notificaciones del destinatario
                    utilidades.agregarNotificacion(datosOrigen, destino.uid,
                        mensaje, info);

                    /* Actualizamos el contacto de PENDIENTE a SI en la base de
                    datos del destino */
                    db.collection(usuarios)
                        .doc(destino.uid)
                        .collection(contactos)
                        .doc(origen)
                        .update({esContacto: "SI"});
                  })
                  .catch((error) => {
                    console.log(
                        "Error al obtener los datos del origen",
                        error);
                  });
            })
            .catch((error) => {
              console.log(
                  "Error al obtener el token del destino",
                  error);
            });
      }

      return Promise.resolve();
    });

