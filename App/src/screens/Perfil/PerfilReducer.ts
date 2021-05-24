import {Usuario} from '../../types';

// Estado para la pantalla Perfil
export function reducer(state: EstadoPerfil, action: AccionPerfil) {
	switch (action.type) {
		case 'editarNombreVisible':
			return {
				...state,
				editarNombreVisible: action.editarNombreVisible,
			};
		case 'actualizarDatosUsuario':
			return {
				...state,
				datosUsuario: action.datosUsuario,
			};
		case 'camerarollVisible':
			return {
				...state,
				camerarollVisible: action.camerarollVisible,
			};
	}
}

export const estadoInicial = {
	editarNombreVisible: false,
	datosUsuario: {} as Usuario,
	camerarollVisible: false,
};

export type EstadoPerfil = typeof estadoInicial;
export type AccionPerfil =
	| {type: 'editarNombreVisible'; editarNombreVisible: boolean}
	| {type: 'actualizarDatosUsuario'; datosUsuario: Usuario}
	| {type: 'camerarollVisible'; camerarollVisible: boolean};
