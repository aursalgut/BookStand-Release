/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationProp } from '@react-navigation/core';
import {Alert} from 'react-native';
import {Libro} from '../types';

/**
 * Función para buscar la información de un libro en la API de OpenLibrary
 * https://openlibrary.org/dev/docs/api/books
 * @param isbn un ISBN (International Standard Book Number) es un identificador 
 * único para libros previsto para uso comercial. Se aceptan formatos de 10 o 13
 * dígitos.
 * @param navigation el objeto de navegación (React Navigation) que se ha utilizado
 */
export async function obtenerLibro(
	isbn: string,
	navigation: NavigationProp<any>,
): Promise<void> {
	let libro: Libro = {isbn: isbn}; // Datos del libro que usaremos en nuestra app
	let libroJSON; // Datos del libro proporcionados por la API de OpenLibrary

	// Buscamos el libro en la API de OpenLibrary
	fetch(
		`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
	)
		.then(async (respuestaAPI) => {
			// En función del valor de la respuesta https
			// OJO, que tengamos una respuesta de la API no significa que se encuentre
			// el libro
			switch (respuestaAPI.status) {
				case 200:
					// Transformamos la respuesta en un JSON
					libroJSON = await respuestaAPI.json();

					/* El formato del objeto JSON incluye un campo de nombre "ISBN:" seguido
					del ISBN del libro concreto. Si este campo no existe, el libro no se
					ha encontrado */

					if (libroJSON[`ISBN:${isbn}`]) {
						// Si el libro se ha encontrado

						/* Añadimos los datos que nos interesan a nuestro libro: el isbn, el 
						título, los autores y los géneros. Además, por defecto, los libros
						que escaneemos serán nuestros (esPropietario => true) */
						libro = {
							isbn: isbn,
							titulo: libroJSON[`ISBN:${isbn}`]?.title
								? libroJSON[`ISBN:${isbn}`]?.title
								: undefined,
							autores: libroJSON[`ISBN:${isbn}`]?.authors
								? json2array(libroJSON[`ISBN:${isbn}`]?.authors)
								: undefined,
							generos: libroJSON[`ISBN:${isbn}`]?.subjects
								? json2array(libroJSON[`ISBN:${isbn}`]?.subjects)
								: undefined,
							esPropietario: true,
						};
					} else {
						/* Si el libro no existe, lo notificamos y ofrecemos al usuario la
						opción de introducir los datos manualmente */
						libro = {isbn: isbn, error: true};
					}
					break;
				default:
					// Si no recibimos 200 OK, se ha producido un error
					// Ofrecemos al usuario reintentar o introducir los datos manualmente
					console.log('Se ha producido un error: ' + respuestaAPI.status);
					libro = {isbn: isbn, error: true};
			}
		})
		.catch((error) => {
			// Si se ha producido algún error, lo notificamos
			libro = {...libro, error: true};
			console.log('Se ha producido un error:' + error);
		})
		.finally(() => {
			if (libro?.error) {
				// Si hay algún error en la respuesta, lo notificamos y
				// ofrecemos la posibilidad de añadir los datos manualmente
				Alert.alert(
					'Se ha producido un error buscando el libro',
					'¿Quieres añadir los datos manualmente?',
					[
						{
							text: 'Cancelar',
							style: 'cancel',
						},
						{
							text: 'Sí',
							onPress: () => {
								// Pasamos a la pantalla de añadir los datos del libro con una
								// plantilla del libro
								navigation.navigate('Nuevo Libro', {
									isbn: isbn,
									titulo: 'Añade un título',
								});
							},
						},
					],
					{cancelable: true},
				);
			} else {
				// Si no existe dicho campo, se ha encontrado un libro
				/* Pasamos como parámetro el libro a la pantalla que se encargará de
					representarlo */
				navigation.navigate('Nuevo Libro', libro);
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

/**
 * Función para buscar libros en la API de Open Library a partir de su título
 * @param texto Cadena de texto que se va a buscar
 * @returns Un conjunto de libros que incluyen esa cadena en su título
 */
export async function buscarPorTitulo(texto: string): Promise<Libro[]> {
	let libros: Libro[] = [];
	const titulo = texto.replace(/\s/g, '-');

	return fetch(`https://openlibrary.org/search.json?title=${titulo}`)
		.then(async (response: Response) => {
			let resultadoBusqueda;
			if (response.status === 200) {
				resultadoBusqueda = await response.json();

				if (resultadoBusqueda.numFound !== 0) {
					libros = obtenerNResultados(
						resultadoBusqueda.docs,
						resultadoBusqueda.numFound,
					);
					return libros;
				} else {
					Alert.alert('No se han encontrado el libro');
					return Promise.reject();
				}
			} else {
				console.log('Error al obtener la respuesta de OpenLibrary');
				return Promise.reject();
			}
		})
		.catch((error) => {
			Alert.alert('Error al buscar el libro por el título', error.toString());
			return Promise.reject();
		});
}

/**
 * Función para filtrar la cantidad de resultados que se obtienen cuando se
 * busca un libro por su título. Devuelve los 10 primeros resutlados.
 * @param resultados Libros que se han encontrado al realizar la búsqueda
 * @param numResultados Número de libros que han resultado de la búsqueda
 * @returns Devuelve los 10 primeros resultados
 */
function obtenerNResultados(
	resultados: any,
	numResultados: number,
): Array<Libro> {
	const listaLibros = [];

	try {
		let numero: number;
		if (numResultados >= 10) {
			numero = 10;
		} else {
			numero = numResultados;
		}

		let i;
		for (i = 0; i < numero; i++) {
			listaLibros.push({
				titulo: resultados[i]['title'],
				autores: resultados[i]['author_name'],
				isbn: resultados[i]['isbn'][0],
			});
		}
	} catch (error) {
		console.log('Error al extraer los datos del libro', error);
	}
	return listaLibros;
}

/**
 * Función auxiliar para obtener un array a partir del objeto que devuelve la
 * API de OpenLibrary, lo que nos permite trabajar con datos más consistentes en
 * la app.
 * @param elementos un objeto con los elementos a transformar en array. Son los
 * datos que vienen directamente de la API de OpenLibrary
 * @returns un array de cadenas con los elementos que formaban el objeto JSON
 */
function json2array(elementos: any): string[] {
	const elementosArray: string[] = [];

	if (elementos !== undefined) {
		// Insertamos los nombres de los diversos elementos en un array para
		// su fácil iteración y manejo
		elementos.forEach((elt: any) => {
			elementosArray.push(elt.name.toString());
		});
	}

	return elementosArray;
}
