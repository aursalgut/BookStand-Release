// Exportamos la función para obtener los datos de la API
export {obtenerLibro} from './openLibrary';
export {Autenticacion} from './Autenticacion';

/**
 * Función que convierte un array de cadenas en una única cadena con los 
 * elementos separados por comas y la conjunción 'y'. Nos ayuda a obtener una 
 * cadena con unformato más presentable para el usuario.

 * @param array el array con los elementos a convertir en una cadena.
 * @returns cadena con los elementos con comas y la 'y'.
 */
export function array2Cadena(array: string[]): string {
	// Damos formato a la cadena de los autores
	let cadenaElementos = '';
	for (let i = 0; i < array.length; i++) {
		if (i === 0) {
			// Para elprimer eñemento no hace falta usar comas
			cadenaElementos = array[i];
		} else if (i === array.length - 1) {
			// Antes del último elemento, añadimos la 'y'
			cadenaElementos = cadenaElementos + ' y ' + array[i];
		} else {
			// En cualuier otro caso, añadimos comas
			cadenaElementos = cadenaElementos + ', ' + array[i];
		}
	}
	return cadenaElementos;
}
