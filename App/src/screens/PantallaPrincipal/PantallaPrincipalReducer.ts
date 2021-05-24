import {Action, Dispatch} from '@reduxjs/toolkit';
import {PantallaPrincipalNavigationProps} from '../../navigations';
import {Notificacion, Usuario} from '../../types';

export function reducer(state: EstadoPrincipal, action: AccionPrincipal) {
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
		case 'notificaciones':
			return {
				...state,
				notificaciones: action.notificaciones,
			};
		case 'navigation':
			return {
				...state,
				navigation: action.navigation,
			};
		case 'usuario':
			return {
				...state,
				usuario: action.usuario,
			};
		case 'dispatchRedux':
			return {
				...state,
				dispatchRedux: action.dispatchRedux,
			};
		case 'dimensionModal':
			return {
				...state,
				dimensionModal: action.dimensionModal,
				tipoFormulario: action.tipo,
			};
		case 'refrescando':
			return {
				...state,
				refrescando: action.refrescando,
			};
		case 'cerrarModalAgregarLibro':
			return {
				...state,
				dimensionModal: DimensionModal.botones,
				titulo: '',
				isbn: '',
				modalAgregarLibro: false,
			};
		default:
			return state;
	}
}
export enum DimensionModal {
	botones = 'BOTONES',
	formulario = 'FORMULARIO',
}

export const estadoInicial = {
	modalAgregarLibro: false,
	isbn: '',
	titulo: '',
	tipoFormulario: '',
	notificaciones: [] as Notificacion[],
	navigation: {} as PantallaPrincipalNavigationProps,
	usuario: {} as Usuario,
	dispatchRedux: {} as Dispatch<Action>,
	dimensionModal: DimensionModal.botones,
	refrescando: false,
};

export type EstadoPrincipal = typeof estadoInicial;

export type AccionPrincipal =
	| {type: 'modalAgregarLibro'; modalAgregarLibro: boolean}
	| {type: 'isbn'; isbn: string}
	| {type: 'titulo'; titulo: string}
	| {type: 'notificaciones'; notificaciones: Notificacion[]}
	| {type: 'navigation'; navigation: PantallaPrincipalNavigationProps}
	| {type: 'usuario'; usuario: Usuario}
	| {type: 'dispatchRedux'; dispatchRedux: Dispatch<Action>}
	| {
			type: 'dimensionModal';
			dimensionModal: DimensionModal;
			tipo: 'ISBN' | 'Título' | '';
	  }
	| {type: 'refrescando'; refrescando: boolean}
	| {type: 'cerrarModalAgregarLibro'};
