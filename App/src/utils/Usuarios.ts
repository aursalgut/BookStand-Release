import firestore from '@react-native-firebase/firestore';
import {Usuario} from '../types';
import auth from '@react-native-firebase/auth';
import {Dispatch} from 'react';
import {Action} from '@reduxjs/toolkit';
import {login} from '../redux/authSlice';
import storage from '@react-native-firebase/storage';
import {ImagePickerResponse} from 'react-native-image-picker';

/* ********* CAMBIOS DE LA CUENTA DE USUARIO ********* */
/**
 * Función que permite actualizar los datos del usuario en el sistema
 * @param usuario usuario en el sistema
 * @param dispatchRedux despachador de Redux para hacer que el efecto de los
 * cambios sea global
 */
export async function actualizarDatosUsuario(
	usuario: Usuario,
	dispatchRedux: Dispatch<Action>,
): Promise<void> {
	// Actualiza los datos de usuario
	// Permite quitar (null)/agregar datos
	const user = auth().currentUser;
	if (user) {
		firestore()
			.collection('usuarios')
			.doc(usuario.uid)
			.update(usuario)
			.catch((error) => console.log(error));
		// Una vez editados los datos, actualizamos el estado de Redux
		dispatchRedux(login(usuario));
	}
}

/**
 * Función para cambiar la foto de perfil de un usuario en la aplicación. La
 * imagen se guarda en una carpeta de Cloud Storage.
 * @param usuario usuario de la aplicación
 * @param foto imagen que se desea establecer como foto de perfil
 * @param dispatchRedux despachador de Redux para hacer que el efecto de los
 * cambios sea global
 */
export async function subirFotoPerfil(
	usuario: Usuario,
	foto: ImagePickerResponse,
	dispatchRedux: Dispatch<Action>,
): Promise<void> {
	/* Para subir un archivo a Cloud Storage, primero debes crear una referencia
	a la ruta de acceso completa del archivo, incluido el nombre
	*/
	// Creamos una referencia para la foto
	const storageRef = storage().ref(usuario.uid + '/profilePicture');
	storageRef
		.putFile(foto.uri as string)
		.then(async () => {
			console.log('Se ha subido correctamente');

			// Una vez que hemos subido la foto a Firebase Storage, la ponemos como
			// imagen de perfil
			firestore()
				.collection('usuarios')
				.doc(usuario.uid)
				.update({foto: await storageRef.getDownloadURL()})
				.then(async () => {
					// Una vez editados los datos, actualizamos el estado de Redux
					dispatchRedux(
						login({
							...usuario,
							foto: await storageRef.getDownloadURL(),
						}),
					);
				})
				.catch((error) => {
					console.log('Se ha producido un error', error);
				});
		})
		.catch((error) => {
			console.log('Error al subir la foto', error);
		});
}
