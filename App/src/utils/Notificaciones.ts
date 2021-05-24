import firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Dispatch} from 'react';
import { AccionPrincipal } from '../screens/PantallaPrincipal/PantallaPrincipalReducer';
import {Notificacion} from '../types';

/**
 * obtenerNotificaciones: función que permite obtener las notificaciones de un
 * usuario y añadirlas al estado de la pantalla.
 * @param uid identificador de usuario
 * @param dispatch despachador del estado de la pantalla principal
 */
export async function obtenerNotificaciones(
	uid: string,
	dispatch: Dispatch<AccionPrincipal>,
): Promise<void> {
	// Almacenaremos las notificaciones en un array
	const notificaciones: Notificacion[] = [];

	// Llamamos a la base de datos
	firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('notificaciones')
		.where('leida', '==', false)
		.get()
		.then((respuesta: FirebaseFirestoreTypes.QuerySnapshot) => {
			// Si la respuesta que obtenemos no está vacía
			if (!respuesta?.empty) {
				// Insertamos los datos en nuestro array de notificaciones
				respuesta.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
					notificaciones.push({...doc.data(), id: doc.id});
				});
			}
			dispatch({type: 'notificaciones', notificaciones: notificaciones});
		})
		.catch((error) => {
			console.log(
				'Se ha producido un error al obtener las notificaciones',
				error,
			);
		});
}

/**
 * Función que marca una notificación como leída.
 * @param uid identificador del usuario
 * @param notificacion datos de la notificación
 */
export async function marcarNotificacionLeida(
	uid: string,
	notificacion: Notificacion,
): Promise<void> {
	firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('notificaciones')
		.doc(notificacion.id)
		.update({leida: true});
}

/**
 * Función que añade una notificación a la base de datos del usuario.
 * @param uid identificador del usuario
 * @param notificacion datos de la notificación
 */
export async function agregarNotificacion(
	uid: string,
	notificacion: Notificacion,
): Promise<void> {
	firestore()
		.collection('usuarios')
		.doc(uid)
		.collection('notificaciones')
		.doc(notificacion.id)
		.set(notificacion);
}
