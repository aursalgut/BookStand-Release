import {Contacto, Usuario} from '../../types';

export const reducer = (
	state: EstadoAgregarPrestamo,
	action: AccionAgregarPrestamo,
) => {
	switch (action.type) {
		case 'selUsuarios':
			return {
				...state,
				selUsuarios: action.selUsuarios,
			};
		case 'selFechaPrestamo':
			return {
				...state,
				selFechaPrestamo: action.selFechaPrestamo,
			};
		case 'selFechaDevolucion':
			return {
				...state,
				selFechaDevolucion: action.selFechaDevolucion,
			};
		case 'fechaPrestamo':
			return {
				...state,
				fechaPrestamo: action.fechaPrestamo,
			};
		case 'fechaDevolucion':
			return {
				...state,
				fechaDevolucion: action.fechaDevolucion,
			};
		case 'confechaDevolucion':
			return {
				...state,
				confechaDevolucion: action.confechaDevolucion,
			};
		case 'deudor':
			return {
				...state,
				deudor: action.deudor,
			};
		case 'usuario':
			return {
				...state,
				usuario: action.usuario,
			};
		case 'listaContactos':
			return {
				...state,
				listaContactos: action.listaContactos,
			};
		case 'limpiarEstado':
			return {
				...state,
				...estadoInicial,
			};
		default:
			return state;
	}
};

export const estadoInicial = {
	selFechaPrestamo: false,
	selFechaDevolucion: false,
	selUsuarios: false,
	fechaPrestamo: new Date(),
	fechaDevolucion: new Date(),
	deudor: {} as Usuario,
	usuario: {} as Usuario,
	listaContactos: [] as Contacto[],
	confechaDevolucion: false,
};

export type EstadoAgregarPrestamo = typeof estadoInicial;
export type AccionAgregarPrestamo =
	| {type: 'limpiarEstado'}
	| {type: 'selFechaPrestamo'; selFechaPrestamo: boolean}
	| {type: 'selFechaDevolucion'; selFechaDevolucion: boolean}
	| {type: 'selUsuarios'; selUsuarios: boolean}
	| {type: 'fechaPrestamo'; fechaPrestamo: Date}
	| {type: 'fechaDevolucion'; fechaDevolucion: Date}
	| {type: 'deudor'; deudor: Usuario}
	| {type: 'confechaDevolucion'; confechaDevolucion: boolean}
	| {type: 'usuario'; usuario: Usuario}
	| {type: 'listaContactos'; listaContactos: Contacto[]};
