const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
// Para ingorar propiedades no definidas
db.settings({ignoreUndefinedProperties: true});

// Exportamos las funciones
exports.nuevoContacto = require("./contactos/nuevoContacto");
exports.eliminarContacto = require("./contactos/eliminarContactos");
exports.nuevoPrestamo = require("./prestamos/nuevoPrestamo");
exports.actualizarPrestamo = require("./prestamos/actualizarPrestamo");
