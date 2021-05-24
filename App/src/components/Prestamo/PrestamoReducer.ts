import { Notificacion } from '../../types';

export const reducer = (state: EstadoPrestamo, action: AccionPrestamo) => {
	switch (action.type) {
		case 'cerrarModal':
			return {
				...state,
				modalVisible: false,
				devolver: false,
				actualizar: false,
			};
		case 'devolver':
			return {
				...state,
				modalVisible: true,
				actualizar: false,
				devolver: true,
			};
		case 'actualizar':
			return {
				...state,
				modalVisible: true,
				actualizar: true,
				devolver: false,
			};
		case 'mostrarCambios':
			return {
				...state,
				mostrarCambios: true,
				cambios: action.cambios,
			};
		case 'ocultarCambios':
			return {
				...state,
				mostrarCambios: false,
			};
		default:
			return state;
	}
};

export const estadoInicial = {
	modalVisible: false,
	devolver: false,
	actualizar: false,
	cambios: [] as Notificacion[],
	mostrarCambios: false,
};

export type EstadoPrestamo = typeof estadoInicial;
export type AccionPrestamo =
	| {type: 'cerrarModal'}
	| {type: 'devolver'}
	| {type: 'actualizar'}
	| {type: 'mostrarCambios', cambios: Notificacion[]}
	| {type: 'ocultarCambios'};
