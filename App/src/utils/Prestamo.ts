import {
	EstadoConfirmacion,
	Libro,
	Notificacion,
	Prestamo,
	TipoNotificacion,
	TipoPrestamo,
	Usuario,
} from '../types';
import firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Dispatch} from 'react';
import {AccionPrestamo} from '../components/Prestamo/PrestamoReducer';
import {Recordatorios} from './../utils/Recordatorios';
import {agregarNotificacion} from './Notificaciones';

/* ************************************************************************** */
/* ******************** FUNCIONES DE MANEJO DE PRÉSTAMOS ******************** */
/* ************************************************************************** */

/**
 * agregarPrestamo: función para crear un préstamo de un libro.
 * @param usuario usuario de la aplicación
 * @param prestamo objeto que contiene los datos del préstamo
 */
export async function agregarPrestamo(
	usuario: Usuario,
	prestamo: Prestamo,
): Promise<void> {
	// Creamos un documento para el préstamo y obtenemos una referencia del mismo
	// en la base de datos
	const referenciaPrestamo = firestore()
		.collection('usuarios')
		.doc(usuario.uid) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Accedemos al documento de identificador ISBN
		.collection('prestamos') // Creamos/accedemos a la colección préstamos
		.doc(); // Creamos un documento nuevo

	// Añadimos los datos del préstamo
	referenciaPrestamo
		.set({...prestamo, id: referenciaPrestamo.id})
		.catch(function (error) {
			console.log(error); // Si se produce algún error, imprimimos por consola
		});

	// Actualizamos el documento con los datos del libro
	firestore()
		.collection('usuarios')
		.doc(usuario.uid) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Accedemos al documento de identificador ISBN
		.update({prestado: TipoPrestamo.prestador})
		.catch(function (error) {
			console.log(error); // Si se produce algún error, imprimimos por consola
		});
}

/**
 *	Función para aceptar un nuevo préstamo que un usuario nos ha hecho.
 * @param usuario uid del ususario
 * @param prestamo datos del préstamo
 */
export async function aceptarPrestamo(
	usuario: string,
	prestamo: Prestamo,
): Promise<void> {
	// Creamos el documento que contendrá los datos del libro
	firestore()
		.collection('usuarios')
		.doc(usuario) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn)
		.set({isbn: prestamo.isbn});

	// Creamos un documento para el préstamo y obtenemos una referencia del mismo
	// en la base de datos
	firestore()
		.collection('usuarios')
		.doc(usuario) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Accedemos al documento de identificador ISBN
		.collection('prestamos') // Creamos/accedemos a la colección préstamos
		.doc(prestamo.id) // Creamos un documento nuevo
		.set({
			...prestamo,
			estado: EstadoConfirmacion.confirmadoCreacion,
		})
		.catch(function (error) {
			console.log(error); // Si se produce algún error, imprimimos por consola
		});

	// Actualizamos el documento con los datos del libro
	firestore()
		.collection('usuarios')
		.doc(usuario) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Accedemos al documento de identificador ISBN
		.update({prestado: TipoPrestamo.deudor})
		.catch(function (error) {
			console.log(error); // Si se produce algún error, imprimimos por consola
		});

	// Cuando hemos aceptado un préstamo, establecemos recordatorios
}

/**
 * Función para rechazar un nuevo préstamo que un usuario nos acaba de hacer
 * @param usuario identificador del usuario
 * @param prestamo datos del préstamo
 */
export async function rechazarPrestamo(
	usuario: string,
	prestamo: Prestamo,
): Promise<void> {
	/* Una función de cloud se ejecutará ante estos eventos y enviará las
	notificaciones necesarias a los usuarios para que acepten los cambios */
	// Accedemos a la BBDD para añadir el documento del préstamo actualizado

	// Escribimos esto para ejecutar el trigger en Cloud Functions
	firestore()
		.collection('usuarios')
		.doc(usuario) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Creamos un documento de identificador ISBN
		.collection('prestamos')
		.doc(prestamo.id) // Accedemos al préstamo adecuado
		.set({
			...prestamo,
			estado: EstadoConfirmacion.denegadoCreacion,
		}) // Actualizamos los datos, estableciendo la denegación
		.catch(function (error) {
			console.log('Error al actualizar el préstamo', error);
		});
}

/**
 * Función para actualizar un préstamo de un libro.
 * @param usuario usuario de la aplicación
 * @param prestamo objeto que contiene los datos del préstamo
 */
export async function actualizarPrestamo(
	usuario: Usuario,
	prestamo: Prestamo,
): Promise<void> {
	/* Una función de cloud se ejecutará ante estos eventos y enviará las
	notificaciones necesarias a los usuarios para que acepten los cambios */
	// Accedemos a la BBDD para añadir el documento del préstamo actualizado
	firestore()
		.collection('usuarios')
		.doc(usuario.uid) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Creamos un documento de identificador ISBN
		.collection('prestamos')
		.doc(prestamo.id) // Accedemos al préstamo adecuado
		.update({
			...prestamo,
			estado: prestamo.devuelto
				? EstadoConfirmacion.pendienteDevolucion
				: EstadoConfirmacion.pendienteModificacion,
		}) // Actualizamos los datos
		.catch(function (error) {
			console.log('Error al actualizar el préstamo', error);
		});
}

/**
 * Función para rechazar los cambios que un usuario ha propuesto para un
 * préstamo
 * @param usuario uid del usuario
 * @param prestamo datos del préstamo
 */
export async function rechazarActualizacionPrestamo(
	usuario: string,
	prestamo: Prestamo,
): Promise<void> {
	/* Una función de cloud se ejecutará ante estos eventos y enviará las
	notificaciones necesarias a los usuarios para que acepten los cambios */
	// Accedemos a la BBDD para añadir el documento del préstamo actualizado
	firestore()
		.collection('usuarios')
		.doc(usuario) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Creamos un documento de identificador ISBN
		.collection('prestamos')
		.doc(prestamo.id) // Accedemos al préstamo adecuado
		.update({
			estado: prestamo.devuelto
				? EstadoConfirmacion.denegadoDevolucion
				: EstadoConfirmacion.degenadoModidicacion,
		}) // Actualizamos los datos
		.catch(function (error) {
			console.log('Error al actualizar el préstamo', error);
		});
}

/**
 * Función para aceptar los cambios que un usuario ha propuesto en el préstamo.
 * @param usuario uid del usuario
 * @param prestamo datos del préstamo
 */
export async function aceptarActualizacionPrestamo(
	usuario: string,
	prestamo: Prestamo,
): Promise<void> {
	/* Una función de cloud se ejecutará ante estos eventos y enviará las
	notificaciones necesarias a los usuarios para que acepten los cambios */
	// Accedemos a la BBDD para añadir el documento del préstamo actualizado
	firestore()
		.collection('usuarios')
		.doc(usuario) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(prestamo.isbn) // Creamos un documento de identificador ISBN
		.collection('prestamos')
		.doc(prestamo.id) // Accedemos al préstamo adecuado
		.update({
			...prestamo,
			estado: prestamo.devuelto
				? EstadoConfirmacion.confirmadoDevolucion
				: EstadoConfirmacion.confirmadoModificacion,
		}) // Actualizamos los datos
		.catch(function (error) {
			console.log('Error al actualizar el préstamo', error);
		});

	if (prestamo.devuelto) {
		// Actualizamos el campo prestado en el documento con los datos del libro
		firestore()
			.collection('usuarios')
			.doc(usuario) // Base de datos del usuario
			.collection('libros') // Si la colección libros no existe, la crea
			.doc(prestamo.isbn) // Creamos un documento de identificador ISBN
			.update({prestado: TipoPrestamo.ninguno})
			.catch(function (error) {
				console.log('Error al actualizar el estado del libro', error);
			});
	}
}

/**
 * obtenerLibrosPrestados: funcion para obtener todos los libros que están
 * siendo prestados o que está prestando.
 * @param usuario usuario de la aplicación
 * @returns librosPrestados conjunto de libros que tiene el usuario prestado
 */
export async function obtenerLibrosPrestados(
	usuario: Usuario,
): Promise<Libro[]> {
	const librosPrestados: Libro[] = []; // Almacenará los libros prestados

	const respuesta = (await firestore()
		.collection('usuarios')
		.doc(usuario.uid)
		.collection('libros')
		.where('prestado', '!=', '')
		.get()) as FirebaseFirestoreTypes.QuerySnapshot;

	// Añadimos la respuesta a un array de Libros
	if (!respuesta?.empty) {
		respuesta.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
			librosPrestados.push(doc.data());
		});
	}

	return librosPrestados;
}

/**
 * obtenerHistorialPrestamos: función que obtiene una lista con los préstamos
 * que se han realizado de un libro.
 * @param usuario usuario de la aplicación
 * @param libro libro para el que obtenemos el historial de préstamos
 * @return prestamosLibro conjunto de prestamos de un libro
 */
export async function obtenerHistorialPrestamos(
	usuario: Usuario,
	libro: Libro,
): Promise<Prestamo[]> {
	const prestamosLibro: Prestamo[] = []; // Almacenará los préstamos de un libro

	// Accedemos a la basede datos
	const respuesta = await firestore()
		.collection('usuarios')
		.doc(usuario.uid) // Base de datos del usuario
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(libro.isbn) // Accedemos al documento con el identificador ISBN
		.collection('prestamos')
		.orderBy('fechaPrestado', 'desc') // Accedemos a la colección de préstamos del libro
		.get(); // Obtenemos todos los documentos de dicha colección

	// Añadimos la respuesta a un array de objetos para
	// que sea más fácil de manejar en nuestra aplicación
	if (!respuesta?.empty) {
		respuesta.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
			prestamosLibro.push(doc.data());
		});
	}

	return prestamosLibro;
}

/**
 * eliminarRegistroPrestamo: función para eliminar un préstamo del historial de
 * préstamos
 * @param usuario usuario de la aplicación
 * @param prestamo préstamo a eliminar
 */
export function eliminarRegistroPrestamo(
	usuario: Usuario,
	prestamo: Prestamo,
): Promise<void> {
	// Comprobamos que el libro se haya devuelto para poder eliminarlo
	if (prestamo.devuelto) {
		// Accedemos al documento con el registro de la base de datos
		firestore()
			.collection('usuarios')
			.doc(usuario.uid)
			.collection('libros')
			.doc(prestamo.isbn)
			.collection('prestamos')
			.doc(prestamo.id)
			.delete() // Borramos el documento en cuestión
			.catch(function (error) {
				console.log('Se ha producido un error: ' + error);
			});

		// Eliminar la referencia del documento libro
		firestore()
			.collection('usuarios')
			.doc(usuario.uid)
			.collection('libros')
			.doc(prestamo.isbn)
			.update({prestado: ''})
			.catch(function (error) {
				console.log('Se ha producido un error: ' + error);
			});
	}

	return Promise.resolve();
}

/**
 * Función que obtiene todos los cambios que ha habido en un préstamo a partir
 * de las notificaciones de los usuarios que han participado en el préstamo.
 * @param usuario uid del usuario
 * @param prestamoId identificador del préstamo
 * @param dispatch despachador del reducer de préstamos (para efecutar los cambios)
 */
export async function obtenerCambiosPrestamo(
	prestamo: Prestamo,
	dispatch: Dispatch<AccionPrestamo>,
): Promise<void> {
	const cambios: Notificacion[] = [];
	const respuesta = await firestore()
		.collection('usuarios')
		.doc(prestamo.uidDeudor)
		.collection('notificaciones')
		.where('prestamo.id', '==', prestamo.id)
		.get();

	const respuesta2 = await firestore()
		.collection('usuarios')
		.doc(prestamo.uidPrestador)
		.collection('notificaciones')
		.where('prestamo.id', '==', prestamo.id)
		.get();

	if (!respuesta?.empty) {
		respuesta.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
			cambios.push(doc.data());
		});
	}

	if (!respuesta2?.empty) {
		respuesta2.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
			cambios.push(doc.data());
		});
	}

	const cambiosOrdenados = cambios.sort((a: Notificacion, b: Notificacion) => {
		return a.fecha?.toDate().getTime() - b.fecha?.toDate().getTime();
	});

	dispatch({type: 'mostrarCambios', cambios: cambiosOrdenados});
}

/**
 * Función para obtener los datos concretos de un libro que está siendo prestado.
 * @param usuario uid del usuario
 * @param libro libro del que se quieren conocer los datos del préstamo
 * @returns los datos del préstamo para ese libro
 */
export async function obtenerDatosPrestamo(
	usuario: Usuario,
	libro: Libro,
): Promise<Prestamo> {
	// Accedemos a la basede datos
	return obtenerHistorialPrestamos(usuario, libro)
		.then((respuesta) => {
			let datos: Prestamo = {} as Prestamo;
			if (respuesta.length !== 0) {
				datos = respuesta[0];
			}
			return Promise.resolve(datos);
		})
		.catch((error) => {
			return Promise.reject(error);
		});
}

/**
 * Función que comprueba los préstamos actuales y genera notificaciones locales
 * de recordatorio para informar al usuario de las fechas de devoluciones 
 * próximas o atrasadas.
 * @param libros libros de la biblioteca del usuario
 * @param usuario uid del usuario
 */
export function comprobarPrestamos(libros: Libro[], usuario: Usuario): void {
	// Obtenemos los libros con un préstamo activo
	const librosPrestador = buscarPrestamos(libros, TipoPrestamo.deudor);
	const librosDeudor = buscarPrestamos(libros, TipoPrestamo.prestador);
	const librosPrestados = [...librosPrestador, ...librosDeudor];

	// Notificaciones para los libros de los que el usuario es prestador
	librosPrestados.forEach((libro) => {
		obtenerDatosPrestamo(usuario, libro)
			.then((prestamo: Prestamo) => {
				if (prestamo.estado.slice(0, 1) === 'O') {
					// Si es ocioso o confirmado, establecemos las notificaciones de recordatorio

					// Además hacemos que se muestre de forma permanente en el feed
					// esta funcion debe ser idempotente
					let titulo = '';
					let cuerpo = '';
					switch (informacionPrestamo(prestamo)) {
						case 'ATRASADA':
							// Personalizamos el título y el cuerpo de la notificación
							titulo = 'Préstamo atrasado';
							cuerpo =
								'Hay un retraso en el préstamo de ' +
								prestamo.titulo +
								'. La fecha prevista era ' +
								prestamo.fechaDevolucion?.toDate().toLocaleDateString();

							/* Programamos el recordatorio con el valor especial 999 
								(prestamos atrasados) */
							Recordatorios.lanzarRecordatorio(titulo, cuerpo);
							break;
						case 'PROXIMA':
							// Hay que entregar el libro en los próximos 3 días, el día de
							// la entrega inclusive
							if (
								prestamo.fechaDevolucion?.toDate().getDate() ===
								new Date().getDate()
							) {
								// Si es el mismo día
								titulo = 'Último día para devolver un libro';
								cuerpo =
									'Es el último día para devolver ' +
									prestamo.titulo +
									' a ' +
									prestamo.nombrePrestador +
									'. Si no puedes, solicita un cambio en la ' +
									'fecha de devolución.';
							} else {
								titulo = 'Tienes que devolver un libro próximamente';
								cuerpo =
									'Se acerca la fecha de devolución de ' +
									prestamo.titulo +
									'.';
							}
							Recordatorios.lanzarRecordatorio(titulo, cuerpo);
							break;
						default:
							// En cualquier otro caso no hace falta programar los recordatorios
							break;
					}
					const notificacion: Notificacion = {
						id: prestamo.isbn,
						fecha: FirebaseFirestoreTypes.Timestamp.now(),
						leida: false,
						prestamo: prestamo,
						titulo: titulo,
						cuerpo: cuerpo,
						tipo: TipoNotificacion.devolucionLibro,
					};
					if (titulo && cuerpo) {
						agregarNotificacion(usuario.uid, notificacion);
					}
				}
			})
			.catch((error) => {
				console.error('Se ha producido un error', error);
			});
	});
}

/**
 * Función que busca un tipo de préstamo concreto entre un conjunto de libros.
 * @param libros conjunto de libros a buscar
 * @param tipoPrestamo tipo de préstamo que se quiere buscar
 * @returns todos los libros que cumplen ese tipo de préstamo
 */
export function buscarPrestamos(
	libros: Libro[],
	tipoPrestamo: TipoPrestamo,
): Libro[] {
	const librosEncontrados: Libro[] = [];
	libros.forEach((libro) => {
		if (libro.prestado === tipoPrestamo) {
			librosEncontrados.push(libro);
		}
	});
	return librosEncontrados;
}

/**
 * Función que clasifica los préstamos en función de su fecha de devolución
 * (atrasada, próxima, no establecida o con tiempo)
 * @param prestamo datos del préstamo
 * @returns cadena con la información del estado de la devolución del préstamo 
 */
export function informacionPrestamo(prestamo: Prestamo): string {
	enum fechaDevolucion {
		atrasada = 'ATRASADA',
		proxima = 'PROXIMA',
		noEstablecida = 'NO',
		conTiempo = 'OK',
	}
	let informacion = '';
	if (prestamo.fechaDevolucion !== undefined) {
		if (prestamo.fechaDevolucion.toDate().valueOf() < Date.now()) {
			informacion = fechaDevolucion.atrasada;
		} else {
			const tresDiasAntes = new Date(
				prestamo.fechaDevolucion.toDate().valueOf() - 3 * 24 * 60 * 60 * 1000,
			);
			if (Date.now().valueOf() < tresDiasAntes.valueOf()) {
				informacion = fechaDevolucion.conTiempo;
			} else {
				informacion = fechaDevolucion.proxima;
			}
		}
	} else {
		informacion = fechaDevolucion.noEstablecida;
	}
	return informacion;
}
