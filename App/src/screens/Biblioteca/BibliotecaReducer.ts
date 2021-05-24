// ESTADO DE LA PANTALLA
import {Libro} from '../../types';
import {DimensionModal} from '../PantallaPrincipal/PantallaPrincipalReducer';

/* Función reducer que se encargará de modificar el estado de la pantalla
  en función del tipo de las acciones que se produzcan. Sustituye a useState cuando
  el estado del componente es muy complejo */
export function reducer(state: EstadoBiblioteca, action: AccionBiblioteca) {
	switch (action.type) {
		case 'modalAgregarLibro':
			return {
				...state,
				modalAgregarLibro: action.modalAgregarLibro,
			};
			break;
		case 'isbn':
			return {
				...state,
				isbn: action.isbn,
			};
		case 'titulo':
			return {
				...state,
				titulo: action.titulo,
			};
		case 'dimensionModal':
			return {
				...state,
				dimensionModal: action.dimensionModal,
				tipoFormulario: action.tipo,
			};
		case 'cerrarModalAgregarLibro':
			return {
				...state,
				dimensionModal: DimensionModal.botones,
				titulo: '',
				isbn: '',
				modalAgregarLibro: false,
			};
		case 'abrirCuadroBusqueda':
			return {...state, modalVisible: true};
		case 'cerrarCuadroBusqueda':
			return {
				...state,
				modalVisible: false,
			};
		case 'cambiarCriterio':
			return {
				...state,
				criterio: action.criterio,
			};
		case 'buscar':
			return {
				...state,
				cadenaBusqueda: action.cadenaBusqueda,
				filtrado: true,
				librosAMostrar: action.librosAMostrar,
			};
		case 'filtrar':
			return {
				...state,
				filtrado: true,
				criterioFiltrado: action.criterioFiltrado,
				librosAMostrar: action.librosAMostrar,
				modalVisible: false,
			};
		case 'limpiarDatos':
			return {
				...state,
				criterio: 'titulo',
				criterioFiltrado: 'ninguno',
				cadenaBusqueda: '',
				filtrado: false,
				librosAMostrar: state.libros,
			};
		case 'refrescando':
			return {
				...state,
				refrescando: action.refrescando,
			};
		default:
			return state;
	}
}

export type EstadoBiblioteca = {
	filtrado: boolean;
	criterio: string;
	cadenaBusqueda: string;
	criterioFiltrado: string;
	librosAMostrar: Libro[] | null;
	modalVisible: boolean;
	libros: Libro[] | null;
	refrescando: boolean;
	modalAgregarLibro: boolean;
	isbn: string;
	titulo: string;
	tipoFormulario: string;
	dimensionModal: DimensionModal;
};

export type AccionBiblioteca =
	| {type: 'modalAgregarLibro'; modalAgregarLibro: boolean}
	| {type: 'isbn'; isbn: string}
	| {type: 'titulo'; titulo: string}
	| {
			type: 'dimensionModal';
			dimensionModal: DimensionModal;
			tipo: 'ISBN' | 'Título' | '';
	  }
	| {type: 'cerrarModalAgregarLibro'}
	| {type: 'limpiarDatos'}
	| {type: 'abrirCuadroBusqueda'}
	| {type: 'cerrarCuadroBusqueda'}
	| {type: 'refrescando'; refrescando: boolean}
	| {type: 'cambiarCriterio'; criterio: string}
	| {type: 'buscar'; cadenaBusqueda: string; librosAMostrar: Libro[]}
	| {type: 'filtrar'; criterioFiltrado: string; librosAMostrar: Libro[]};
