import {EstadoBiblioteca} from '../screens/Biblioteca/BibliotecaReducer';
import {
	CriterioBusquedaArray,
	CriterioBusquedaCadena,
	Libro,
	TipoPrestamo,
	Usuario,
} from '../types';
import firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

/* ************************************************************************** */
/* ******************** FUNCIONES DE BÚSQUEDA Y FILTRADO ******************** */
/* ************************************************************************** */

/**
 * buscarPorCriterio: función que nos permite buscar si un conjunto de libros
 * contienen cierta cadena en alguno de sus campos.
 *
 * @param cadena cadena de búsqueda
 * @param estado contiene el estado de la biblioteca, del que podemos extraer el
 * 	campo que se utiliza como criterio de búsqueda
 * @param libros conjunto de libros sobre el que buscaremos la cadena
 *
 * @return librosConCriterio libros que cumple el criterio de búsqueda
 */
export function buscarPorCriterio(
	cadena: string,
	estado: EstadoBiblioteca,
	libros: Libro[],
): Libro[] {
	// Variable que almacenará los resultados de la búsqueda
	const librosConCriterio: Libro[] = [];
	// Buscamos en cada elemento la coincidencia del título con la cadena
	libros.forEach((libro: Libro) => {
		// Para los campos que son solo una cadena se hace una búsqueda simple
		if (CriterioBusquedaCadena.includes(estado.criterio)) {
			const datos = libro[estado.criterio as keyof Libro] as string;
			// Ponemos las cadenas en minúsculas para permitir que la búsqueda
			// coincidente no sea case sensitive
			if (
				datos !== undefined &&
				datos !== null &&
				datos.toLowerCase().search(cadena.toLowerCase()) !== -1
			) {
				// Si se devuelve != -1, se habrá encontrado un resultado
				// y lo añadimos al nuevo array
				// Solo añadiremos el libro si no está
				if (!librosConCriterio.includes(libro)) {
					librosConCriterio.push(libro);
				}
			}
		} else if (CriterioBusquedaArray.includes(estado.criterio)) {
			// Para los campos que son un array, se busca en cada uno de los elementos
			// del array
			const arrayDatos = libro[estado.criterio as keyof Libro] as string[];
			if (arrayDatos !== undefined && arrayDatos !== null) {
				arrayDatos.forEach((elemento: string) => {
					if (elemento.toLowerCase().search(cadena.toLowerCase()) !== -1) {
						// Si devuelve != -1, habrá encontrado un resultado
						// y lo añadimos al nuevo array solo si no estaba antes
						if (!librosConCriterio.includes(libro)) {
							librosConCriterio.push(libro);
						}
					}
				});
			}
		}
	});

	return librosConCriterio;
}

/**
 * filtrarLibros: función que nos permite buscar si un determinado libro tiene
 * uno de sus campos activado.
 * @param criterio criterio de filtrado de libros (es uno de los campos booleanos
 * del objeto libro)
 * @param libros conjunto de libros sobre el que buscaremos la cadena
 *
 * @return librosConCriterio libros que cumple el criterio de búsqueda */
export function filtrarLibros(criterio: string, libros: Libro[]) {
	// Variable que almacenará los resultados de la búsqueda
	const librosFiltrados: Libro[] = [];
	// Buscamos en cada elemento la coincidencia del título con la cadena
	libros.forEach((libro: Libro) => {
		if (criterio === 'ninguno') {
			// Si el criterio es ninguno, metemos todos los libros (no filtramos)
			librosFiltrados.push(libro);
		} else if (libro[criterio as keyof Libro] === true) {
			// Cuando el criterio es otro, metemos solo los libros que tienen dicho
			// atributo a true
			librosFiltrados.push(libro);
		}
	});

	return librosFiltrados;
}

/* ************************************************************************** */
/* ********************* FUNCIONES DE MANEJO DE LIBROS ********************** */
/* ************************************************************************** */

/**
 * agregarLibros: función para actualizar o añadir un libro a la base de datos
 * de Firebase
 * @param libro que deseamos agregar/actualizar a la base de datos
 * @param usuario usuario de la aplicación
 */
export async function agregarLibro(libro: Libro, usuario: Usuario) {
	firestore() // Accedemos a la basede datos...
		.collection('usuarios') // Colección de datos de los usuarios
		.doc(usuario.uid) // Documento del usuario concreto
		.collection('libros') // Si la colección libros no existe, la crea
		.doc(libro.isbn) // Creamos un documento de identificador ISBN
		.set(libro) // Establecemos el valor del libro
		.catch(function (error) {
			console.error(error); // Si se produce un error lo imprimimos por consola
		});
}

/**
 * obtenerLibros: función para obtener todos los libros que tiene un usuario en
 * su base de datos.
 * @param usuario usuario de la aplicación
 * @return libros un array de los libros que tiene el usuario en su base de datos
 */
export async function obtenerLibros(usuario: Usuario) {
	const libros: Libro[] = []; // Almacenará el conjunto de libros

	// Accedemos a la colección 'libros' del usuario
	const respuesta = (await firestore()
		.collection('usuarios')
		.doc(usuario.uid)
		.collection('libros')
		.get() // Obtenemos todos los libros
		.catch(function (error) {
			console.error(error); // Si se produce un error lo imprimimos por consola
		})) as FirebaseFirestoreTypes.QuerySnapshot;

	// Añadimos la respuesta a un array de Libros
	if (!respuesta?.empty) {
		respuesta.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
			libros.push(doc.data());
		});
	}

	// Devolvemos el conjunto de libros
	return libros;
}

/**
 * eliminarLibro: función para eliminar un libro en la base de datos de un usuario.
 * @param usuario usuario de la aplicación
 * @param libro libro a elimina
 */
export async function eliminarLibro(usuario: Usuario, libro: Libro) {
	// Solo podremos borrar el libro si el libro no está siendo prestado
	if (
		libro.prestado !== TipoPrestamo.deudor &&
		libro.prestado !== TipoPrestamo.prestador
	) {
		// Accedemos a la base de datos y eliminamos el libro
		firestore()
			.collection('usuarios')
			.doc(usuario.uid)
			.collection('libros')
			.doc(libro.isbn) // Obtenemos el registro correspondiente al libro
			.delete() // Eliminamos el registro
			.catch(function (error) {
				console.error(error); // Si ocurre algún error lo notificamos
			});
	} else {
		Alert.alert('No puedes eliminar un libro que está siendo prestado');
	}
}

/* MÉTODOS PARA LA OBTENCIÓN DE LAS LISTAS */
/**
 * Función para obtener todas las listas que tiene definidas un usuario en su
 * colección.
 * @param libros Todos los libros del usuario
 * @returns Un array con los nombres de todas las listas que hay en la biblioteca
 */
export function obtenerListas(libros: Libro[]): string[] {
	const nombresLista: string[] = [];
	libros.forEach((libro) => {
		const listas = libro?.listas;
		if (listas !== undefined) {
			listas.forEach((lista) => {
				if (!nombresLista.includes(lista)) {
					nombresLista.push(lista);
				}
			});
		}
	});

	return nombresLista;
}

/**
 * Función para buscar todos los libros que pertenecen a una lista en la 
 * biblioteca del usuario
 * @param libros Libros de la biblioteca del usuario
 * @param lista Nombre de la lista
 * @returns Conjunto de libros que pertenecen a la lista
 */
export function buscarLibrosPorLista(libros: Libro[], lista: string): Libro[] {
	const librosEncontrados: Libro[] = [];
	libros.forEach((libro) => {
		const listas = libro?.listas;
		if (listas !== undefined && listas.includes(lista)) {
			librosEncontrados.push(libro);
		}
	});

	return librosEncontrados;
}