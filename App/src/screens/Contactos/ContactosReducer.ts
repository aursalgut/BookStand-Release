import {Contacto} from '../../types';

export function reducer(
	state: EstadoListaUsuario,
	action: AccionListaUsuarios,
) {
	switch (action.type) {
		case 'actualizarUsuarios':
			return {
				...state,
				usuarios: action.usuarios,
			};
		case 'modificarCadenaBusqueda':
			return {
				...state,
				cadenaBusqueda: action.cadenaBusqueda,
			};
		case 'establecerContactos':
			return {
				...state,
				contactos: action.contactos,
			};
		case 'buscando':
			return {
				...state,
				buscando: action.buscando,
			};
	}
}
export const estadoInicial = {
	contactos: [] as Contacto[],
	usuarios: [] as Contacto[],
	cadenaBusqueda: '',
	buscando: false,
};

export type EstadoListaUsuario = typeof estadoInicial;
export type AccionListaUsuarios =
	| {type: 'actualizarUsuarios'; usuarios: Contacto[]}
	| {type: 'modificarCadenaBusqueda'; cadenaBusqueda: string}
	| {type: 'establecerContactos'; contactos: Contacto[]}
	| {type: 'buscando'; buscando: boolean};
