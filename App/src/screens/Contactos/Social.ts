import firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Dispatch} from 'react';
import {Contacto, EsContacto} from '../../types';
import {AccionListaUsuarios} from './ContactosReducer';

/**
 * obtenerListaContactos: función que nos permite obtener la lista de contactos
 * como un conjunto de strings con los UID
 * @param uid identificador de usuario para el que obtendremos los contactos
 * @returns contactos lista de string con el UID de los contactos del usuario
 */
export async function obtenerListaContactos(uid: string): Promise<Contacto[]> {
	const contactos: Contacto[] = [];
	// Resultado almacena la promesa de la llamada a la BBDD
	const resultado = await firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('contactos')
		.get();

	// Si el resultado no está vacío, añadimos los UID a un array
	if (!resultado.empty) {
		resultado.forEach((usuario) => {
			if (
				usuario.data().esContacto === EsContacto.si ||
				usuario.data().esContacto === EsContacto.pendiente
			) {
				contactos.push(usuario.data() as Contacto);
			}
		});
	}

	// Devolvemos el array
	return contactos;
}

/**
 * Función que obtiene los datos de los contactos de un usuario actualizados
 * @param uid identificador del usuario
 * @param dispatch despachador del reducer de la lista de contactos
 */
export async function obtenerMisContactos(
	uid: string,
	dispatch: Dispatch<AccionListaUsuarios>,
): Promise<void> {
	obtenerListaContactos(uid)
		.then((listaContactos: Contacto[]) => {
			for (let i = 0; i < listaContactos.length; i++) {
				firestore()
					.collection('usuarios')
					.doc(listaContactos[i].uid)
					.get()
					.then((resultado) => {
						listaContactos[i].foto = (resultado.data() as Contacto).foto;
						listaContactos[i].nombre = (resultado.data() as Contacto).nombre;
					});
			}
			dispatch({type: 'establecerContactos', contactos: listaContactos});
		})
		.catch((error) => console.log(`Error: ${error}`));
}
/**
 * buscarUsuario: función que busca usuarios en la base de datos de la aplicación
 * por nombre en base a una cadena de texto proporcionada.
 * @param uid identificador del usuario de la aplicación
 * @param nombreUsuario nombre de usuario que estamos buscando
 * @param dispatch despachador del estado de la lista de usuarios
 */
export async function buscarUsuario(
	uid: string,
	nombreUsuario: string,
	dispatch: Dispatch<AccionListaUsuarios>,
): Promise<void> {
	obtenerListaContactos(uid)
		.then((listaContactos: Contacto[]) => {
			const listaUIDContactos = listaContactos.map((contacto) => contacto.uid);
			// Es una búsqueda de toda la base de datos, debería limitarse
			const usuarios: Contacto[] = [];
			firestore()
				.collection('usuarios')
				.where('nombre', '>=', nombreUsuario)
				.orderBy('nombre') // Orden alfabético
				.limit(10) // Buscamos los 10 primeros
				.get()
				.then((querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
					querySnapshot.forEach(
						(usuario: FirebaseFirestoreTypes.DocumentData) => {
							// Nos aseguramos de no incluir al usuario de la aplicación dentro
							// de su propia lisa de contactos (un usuario no puede ser su
							// propio contacto)
							if (usuario.data().uid !== uid) {
								// Para todos los demás resultados, si el uid del usuario se
								// encuentra en la lista de contactos, es un contacto, por lo
								// que ponemos esContacto a true. Si no, será false
								usuarios.push({
									uid: usuario.data().uid,
									nombre: usuario.data().nombre,
									foto: usuario.data().foto,
									esContacto: listaUIDContactos.includes(usuario.data().uid)
										? listaContactos[
											listaUIDContactos.indexOf(usuario.data().uid)
										  ].esContacto
										: EsContacto.no,
								});
							}
						},
					);
					dispatch({type: 'actualizarUsuarios', usuarios: usuarios});
				})
				.catch((error) =>
					console.log(`Error: querySnapshot no llega ${error}`),
				);
		})
		.catch((error) => console.log('Error: listaContactos no llega ' + error));
}

/**
 * marcarContactoPendiente: función que añade un contacto a su base de datos como
 * pendiente, haciendo que se genere una notificación de petición de amistad a
 * dicho contacto.
 * @param uid
 * @param nuevoContacto
 */
export async function marcarContactoPendiente(
	uid: string,
	nuevoContacto: Contacto,
): Promise<void> {
	// Añadimos el contacto a la base de datos como PENDIENTE
	// Una función de Firebase Cloud Functions detectará esto y enviará una
	// notificación al usuario pertinente
	firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('contactos')
		.doc(nuevoContacto.uid)
		.set({...nuevoContacto, esContacto: EsContacto.pendiente})
		.catch((error) => console.log(error));

	return Promise.resolve();
}

/**
 * aceptarContacto: función que acepta una petición de amistad de un nuevo
 * contacto añadiendo los datos a la base de datos y generando una notificación
 * en Cloud Functions
 * @param uid usuario de la aplicación
 * @param nuevoContacto al que aceptamos
 */
export function aceptarContacto(
	uid: string,
	nuevoContacto: Contacto,
): Promise<void> {
	// Añadimos el contacto a la base de datos como contacto aceptado (SI)
	// Una función de Firebase Cloud Functions detectará esto y enviará una
	// notificación al usuario pertinente
	firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('contactos')
		.doc(nuevoContacto.uid)
		.set({...nuevoContacto, esContacto: EsContacto.si})
		.catch((error) => console.log(error));

	return Promise.resolve();
}

/**
 * Función para eliminar a un contacto de la lista de un usuario.
 * @param uid identificador del usuario
 * @param contactoAEliminar datos del contacto a eliminar
 */
export function eliminarContacto(
	uid: string,
	contactoAEliminar: string,
): Promise<void> {
	// Eliminamos el registro del contacto en la base de datos del usuario
	// Una función de Firebase Cloud Functions detectará esto y eliminará el
	// registro de la base de datos del otro contacto
	firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('contactos')
		.doc(contactoAEliminar)
		.delete()
		.catch((error) => console.log(error));

	return Promise.resolve();
}
