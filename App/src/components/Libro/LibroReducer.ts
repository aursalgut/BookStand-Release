import {Libro} from '../../types';

export const reducer = (state: EstadoLibro, action: AccionLibro) => {
	switch (action.type) {
		case 'modalTVisible':
			return {
				...state,
				modalTVisible: action.modalTVisible,
			};
		case 'modalLVisible':
			return {
				...state,
				modalLVisible: action.modalLVisible,
			};
		case 'editando':
			return {
				...state,
				editando: action.editando,
			};
		case 'menuOpcionesVisible':
			return {
				...state,
				menuOpcionesVisible: action.menuOpcionesVisible,
			};
		case 'enBiblioteca':
			return {
				...state,
				enBiblioteca: action.enBiblioteca,
			};
		case 'textoEnEdicion':
			return {
				...state,
				textoEnEdicion: action.textoEnEdicion,
			};
		case 'campoAEditar':
			return {
				...state,
				campoAEditar: action.campoAEditar,
			};
		case 'libro':
			return {
				...state,
				libro: action.libro,
			};
		case 'backupLibro':
			return {
				...state,
				backupLibro: action.backupLibro,
			};
		case 'modalPrestamo':
			return {
				...state,
				modalPrestamo: action.modalPrestamo,
			};
		case 'modalHistorialPrestamo':
			return {
				...state,
				modalHistorialPrestamo: action.modalHistorialPrestamo,
			};
		case 'primeraCarga':
			return {
				...state,
				primeraCarga: action.primeraCarga,
			};
		default:
			return state;
	}
};

export const estadoInicial = {
	modalTVisible: false,
	modalLVisible: false,
	menuOpcionesVisible: false,
	enBiblioteca: false,
	editando: false,
	campoAEditar: '',
	textoEnEdicion: '',
	primeraCarga: true,
	modalPrestamo: false,
	modalHistorialPrestamo: false,
	libro: {} as Libro,
	backupLibro: {} as Libro,
};

export type EstadoLibro = typeof estadoInicial;

export type AccionLibro =
	| {type: 'modalTVisible'; modalTVisible: boolean}
	| {type: 'modalLVisible'; modalLVisible: boolean}
	| {type: 'modalPrestamo'; modalPrestamo: boolean}
	| {type: 'modalHistorialPrestamo'; modalHistorialPrestamo: boolean}
	| {type: 'menuOpcionesVisible'; menuOpcionesVisible: boolean}
	| {type: 'primeraCarga'; primeraCarga: boolean}
	| {type: 'editando'; editando: boolean}
	| {type: 'enBiblioteca'; enBiblioteca: boolean}
	| {type: 'textoEnEdicion'; textoEnEdicion: string}
	| {type: 'campoAEditar'; campoAEditar: string}
	| {type: 'libro'; libro: Libro}
	| {type: 'backupLibro'; backupLibro: Libro}
	| {type: 'buscar'; cadenaBusqueda: string; librosAMostrar: Libro[]}
	| {type: 'filtrar'; criterioFiltrado: string; librosAMostrar: Libro[]};
