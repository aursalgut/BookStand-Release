const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Constantes para la base de datos
const usuarios = "usuarios";
const contactos = "contactos";

// Referencia a la base de datos Firestore
const db = admin.firestore();

exports.eliminarContacto = functions.firestore
    .document(`${usuarios}/{user_id}/${contactos}/{contacto_id}`)
    .onDelete((snapshot, context) => {
      /* Cuando se borra un contacto, se debe actualizar la base de datos del
      contacto borrado sin enviar ninguna notificación */
      db.collection(usuarios)
          .doc(context.params.contacto_id)
          .collection(contactos)
          .doc(context.params.user_id)
          .delete().then(() =>
            console.log("Se ha borrado el contacto correctamente"))
          .catch((error) =>
            console.log("Error al borrar el contacto", error));

      return Promise.resolve();
    });
