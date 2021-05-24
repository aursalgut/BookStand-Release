import {login, logout} from '../redux/authSlice';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {GoogleSignin} from '@react-native-community/google-signin';
import firestore from '@react-native-firebase/firestore';
import {Usuario} from '../types/index';
import {Dispatch} from 'react';
import {Action} from '@reduxjs/toolkit';
import {
	AccionLibroRedux,
	limpiarLibros,
	obtenerLibros,
} from '../redux/librosSlice';

export class Autenticacion {
	// Token necesario para inicializar el SDK de Google, que nos permite usar el
	// inicio de sesión con Google (GoogleSingin).
	// Se encuentra en el archivo android/app/google-services.json como la
	// propiedad client/oauth_client/client_id

	private static webClientID =
		'ID_NECESARIO_PARA_INICIALIZAR_SDK_GOOGLE';

	/**
	 *  Función para registrar a un usuario en el sistema BookStand a partir de un
	 * 	email y una contraseña.
	 * @param email El correo del usuario
	 * @param passwd  La contraseña del usuario
	 * @param dispatch El despachador de Redux para actualizar el estado de la app
	 */
	public static async registroConEmail(
		email: string,
		passwd: string,
		dispatch: Dispatch<Action>,
	) {
		auth()
			.createUserWithEmailAndPassword(email, passwd)
			.then(() => {
				const usuario = auth().currentUser;
				// Si el usuario se ha creado correctamente...
				if (usuario != null) {
					// Lo añadimos a nuestra BBDD
					const datosUsuario: Usuario = {
						correo: usuario.email,
						uid: usuario.uid,
						correoVerificado: usuario.emailVerified,
						registroCorreo: true,
					};
					firestore().collection('usuarios').doc(usuario.uid).set(datosUsuario);
					// Actualizamos el estado de nuestra aplicación con el
					// usuario iniciado
					dispatch(login(datosUsuario));
					console.log('Usuario registrado: ' + usuario.uid);
				}
			})
			.catch(function (error) {
				// Si se produce algún error, se notifica
				let tituloAlert = '';
				let mensaje = '';
				switch (error.code) {
					case 'auth/email-already-in-use':
						tituloAlert = 'Correo en uso';
						mensaje =
							'El correo con el que intentas registrarte ya está en uso. Inicia sesión.';
						break;
					case 'auth/invalid-email':
						tituloAlert = 'Dirección de correo no válida';
						mensaje =
							'Asegúrate de haber escrito una dirección de correo válida';
						break;
					case 'auth/weak-password':
						tituloAlert = 'La contraseña introducida es débil';
						mensaje =
							'Cambia la contraseña para que tenga al menos 6 caracteres';
						break;
					default:
						tituloAlert = error.errorCode;
						mensaje = error.message;
						break;
				}
				Alert.alert(tituloAlert, mensaje);
				console.log(error);
			});
	}

	/**
	 * Función para iniciar la sesión de un usuario a partir de su correo y
	 * contraseña.
	 * @param email El correo del usuario
	 * @param passwd  La contraseña del usuario
	 * @param dispatch El despachador de Redux para actualizar el estado de la app
	 */
	public static async inicioSesion(
		email: string,
		passwd: string,
		dispatch: Dispatch<Action | AccionLibroRedux>,
	) {
		auth()
			.signInWithEmailAndPassword(email, passwd)
			.then(async () => {
				const usuario = auth().currentUser;
				if (usuario !== null) {
					// Actualizamos el estado de nuestra aplicación con el usuario iniciado
					this.obtenerDatosUsuario(usuario)
						.then((datosUsuario: Usuario) => {
							dispatch(login(datosUsuario));

							// Hacemos una carga inicial de los libros del usuario
							dispatch(obtenerLibros(usuario as Usuario));
							console.log('Usuario iniciado: ' + datosUsuario.uid);
						})
						.catch((error) => console.error(error));
				}
			})
			.catch((error) => {
				{
					// Si se produce algún error, se notifica
					let tituloAlert = '';
					let mensaje = '';
					switch (error.code) {
						case 'auth/user-not-found':
							tituloAlert = 'Usuario no encontrado';
							mensaje =
								'No existe ningún usuario con este correo. Regístrate en la aplicación primero';
							break;
						case 'auth/invalid-email':
							tituloAlert = 'Dirección de correo no válida';
							mensaje =
								'Asegúrate de haber escrito una dirección de correo válida';
							break;
						case 'auth/wrong-password':
							tituloAlert = 'Contraseña incorrecta';
							mensaje = 'La contraseña introducida no es correcta';
							break;
						default:
							tituloAlert = error.errorCode;
							mensaje = error.message;
							break;
					}
					Alert.alert(tituloAlert, mensaje);
					console.log(error);
				}
			});
	}

	/**
	 * Función para obtener los datos básicos de un usuario desde la base de datos
	 * Firestore
	 * @param usuario Datos de usuario obtenidos del módulo de Autenticación
	 * @returns Datos del usuario de la aplicación
	 */
	public static async obtenerDatosUsuario(
		usuario: FirebaseAuthTypes.User,
	): Promise<Usuario> {
		// Llamamos a la base de datos
		let datos: Usuario;
		return firestore()
			.collection('usuarios')
			.doc(usuario.uid)
			.get()
			.then((respuesta) => {
				if (respuesta.exists) {
					// Extraemos los datos de la respuesta
					datos = respuesta.data() as Usuario;
				} else {
					datos = this.obtenerDatosAuthentication(usuario);
				}
				return datos;
			})
			.catch((error) => {
				console.log(
					'Se ha producido un erro al obtener los datos del usuario',
					error,
				);
				// Si no podemos encontrar los datos del usuario en firestore, usamos
				// los que tenemos del login
				return usuario as Usuario;
			});
	}

	/**
	 * Función para el registro y/o inicio de sesión de un usuario en nuestra
	 * aplicación con su cuenta de Google
	 * @param dispatch El despachador de acciones de Redux para actualizar el
	 * estado de la aplicación con usuario con sesión iniciada
	 */
	public static async inicioConGoogle(
		dispatch: Dispatch<Action | AccionLibroRedux>,
	) {
		try {
			/* Antes de realizar alguna solicitud de inicio de sesión o registro, se
      debe inicializar el SDK de Google SDK usando el ID de cliente que se
      obtiene al registrar la aplicación */
			GoogleSignin.configure({
				webClientId: this.webClientID,
			});

			// Obtenemos el ID del usuario...
			const {idToken} = await GoogleSignin.signIn();
			// Y creamos unas credenciales de google con dicho ID
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);

			// Una vez obtenidas las credenciales, iniciamos sesión
			auth()
				.signInWithCredential(googleCredential)
				.then(() => {
					const usuario = auth().currentUser;
					// Si el usuario inicia sesión correctamente...
					if (usuario != null) {
						this.obtenerDatosUsuario(usuario).then((datosUsuario: Usuario) => {
							// Añadimos los datos a nuestra BBDD (necesario cuando registramos
							// al usuario por primera vez)
							firestore()
								.collection('usuarios')
								.doc(usuario.uid)
								.set(datosUsuario)
								.then(() => console.log('Documento añadido'))
								.catch((error) =>
									console.log('Se ha producido un error ' + error.errorCode),
								);
							// Actualizamos el estado de nuestra aplicación con el usuario
							// iniciado
							dispatch(login(datosUsuario));
							// Hacemos una carga inicial de los libros del usuario
							dispatch(obtenerLibros(usuario as Usuario));
							console.log('Usuario iniciado: ' + datosUsuario.uid);
						});
					}
				});
		} catch (error) {
			// Si se produce algún error, se notifica
			const errorCode = error.code;
			const errorMessage = error.message;
			Alert.alert(errorCode, errorMessage);
			console.error(error);
		}
	}

	/**
	 * Función para cerrar la sesión del usuario que se encuentra actualmente
	 * activo.
	 * @param dispatch El despachador de acciones de Redux para actualizar el
	 * estado de la aplicación con usuario con sesión cerrada
	 * @param uid Identificador del usuario que va a cerrar sesión
	 */
	public static async cerrarSesion(dispatch: Dispatch<Action>, uid: string) {
		// Se cierra la sesión del usuario
		auth()
			.signOut()
			.then(() => {
				// Actualizamos el estado de nuestra aplicación
				dispatch(limpiarLibros());
				dispatch(logout());
			})
			.catch(function (error) {
				// Si se produce algún error, se notifica
				if (error.code === 'auth/no-current-user') {
					/* Si salta el error de que no hay usuario iniciado, actualizamos el estado
          de nuestra aplicación con el usuario iniciado */
					dispatch(logout());
				} else {
					// Si se produce algún error, se notifica
					const errorCode = error.code;
					const errorMessage = error.message;
					Alert.alert(errorCode, errorMessage);
					console.error(error);
				}
			})
			.finally(() => {
				this.eliminarTokenFCM(uid);
			});
	}

	/**
	 * Función que transforma los datos de usuario proporcionados por el módulo de
	 * autenticación de firebase en un objeto usuario de nuestro modelo.
	 * @param usuario datos de usuario del modulo Authentication
	 * @returns datosUsuario de tipo Usuario de la aplicación
	 */
	public static obtenerDatosAuthentication(
		usuario: FirebaseAuthTypes.User,
	): Usuario {
		const datosUsuario: Usuario = {
			nombre: usuario.displayName,
			uid: usuario.uid,
			correo: usuario.email,
			correoVerificado: usuario.emailVerified,
			registroCorreo:
				usuario.providerData[0].providerId !== 'google.com' ? true : false,
			foto: usuario.photoURL,
		};
		return datosUsuario;
	}

	/**
	 * Función que elimina el token FCM de la base de datos. Lo usamos para evitar
	 * que se envíen mensajes a un dispositivo cuando el usuario ha cerrado sesión
	 * @param uid identificador del usuario
	 */
	public static async eliminarTokenFCM(uid: string): Promise<void> {
		return firestore()
			.collection('usuarios')
			.doc(uid)
			.update({token: null})
			.then(() => Promise.resolve())
			.catch(() => Promise.reject());
	}

	/**
	 * Función para eliminar la cuenta de un usuario.
	 * @param uid Identificador del usuario del que queremos eliminar la cuenta.
	 * @returns 
	 */
	public static async eliminarCuenta(uid: string): Promise<void> {
		return auth()
			.currentUser?.delete()
			.then(() => {
				console.log('El usuario ' + uid + ' se ha borrado del sistema');
				// Tras esto, la extensión de Cloud Functions se encargará de borrar
				// todos los datos asociados a dicho usuario
			})
			.catch((error) => {
				console.log(
					'Se ha producido un error al borrar al usuario ' + uid,
					error,
				);
			});
	}
}
