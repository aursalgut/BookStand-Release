import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {Usuario} from '../types';
/* FICHERO PARA CREAR EL LOS REDUCERS CORRESPONDIENTES A LA AUTENTICACIÓN

  Los reducers son funciones que reciben el estado actual de la aplicación y un
  objeto de acción, deciden cómo actualizar el estado de ser necesario y devuelven
  el nuevo estado. Son el único lugar donde se puede cambiar el estado de la aplicación.*/

// Definimos el estado inicial del objeto de autenticación
const initialState: Usuario = {
	correo: undefined,
	uid: '',
	nombre: undefined,
	correoVerificado: false,
	foto: undefined,
	registroCorreo: false,
	token: '',
};

/* Creamos el reducer con la función createSlice que acepta el estado inicial, un objeto
  con un conjunto de reducers y el nombre del slice y genera automáticamente las acciones
  correspondientes a los reducers y al estado.

  En nuestro caso, tenemos dos acciones: iniciar sesión y cerrar sesión. */
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state: Usuario, action: PayloadAction<Usuario>) => {
			// Cuando iniciamos sesión, asociamos el usuario
			state.uid = action.payload.uid;
			state.correoVerificado = action.payload.correoVerificado;
			state.correo = action.payload.correo;
			state.foto = action.payload.foto;
			state.nombre = action.payload.nombre;
			state.registroCorreo = action.payload.registroCorreo;
			state.token = action.payload.token;
		},
		logout: (state: Usuario) => {
			// Cuando cerramos sesión, devolvemos el estado al valor inicial
			state.uid = initialState.uid;
			state.correoVerificado = initialState.correoVerificado;
			state.correo = initialState.correo;
			state.foto = initialState.foto;
			state.nombre = initialState.nombre;
			state.registroCorreo = initialState.registroCorreo;
			state.token = initialState.token;
		},
	},
});

export default authSlice.reducer;

// Exportamos las acciones
export const {login, logout} = authSlice.actions;

// Función selector que nos permitirá acceder al estado del objeto
export const selectUsuario = (state: RootState) => state.authReducer;

export const selectUID = (state: RootState) => state.authReducer.uid;
