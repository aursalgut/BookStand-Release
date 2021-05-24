/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AsyncThunkAction,
	createAsyncThunk,
	createSlice,
} from '@reduxjs/toolkit';
import {Libro, Usuario} from '../types';
import {obtenerLibros as obtenerTodosLibros} from '../utils/Biblioteca';
import {RootState} from './store';
/* FICHERO PARA CREAR EL LOS REDUCERS CORRESPONDIENTES A LOS LIBROS

  Los reducers son funciones que reciben el estado actual de la aplicación y un
  objeto de acción, deciden cómo actualizar el estado de ser necesario y devuelven
  el nuevo estado. Son el único lugar donde se puede cambiar el estado de la aplicación.*/

const initialState = {
	libros: [],
	status: 'idle',
	error: null,
};

export const obtenerLibros = createAsyncThunk(
	'libros/obtenerLibros',
	async (usuario: Usuario) => {
		return obtenerTodosLibros(usuario)
			.then((respuesta) => respuesta)
			.catch(() => []);
		// Si encontramos libros, devolvemos la respuesta
		// Si se produce un error, devolvemos un array vacío
	},
);
export type AccionLibroRedux = AsyncThunkAction<Libro[], Usuario, any>;

export const librosSlice = createSlice({
	name: 'libros',
	initialState,
	reducers: {
		limpiarLibros: (state: any) => {
			state.status = initialState.status;
			state.libros = initialState.libros;
			state.error = initialState.error;
		},
	},
	extraReducers: {
		[obtenerLibros.pending as any]: (state: any) => {
			state.status = 'loading';
		},
		[obtenerLibros.fulfilled as any]: (state: any, action: any) => {
			state.status = 'succeeded';
			// Add any fetched books to the array
			state.libros = action.payload;
		},
		[obtenerLibros.rejected as any]: (state: any, action: any) => {
			state.status = 'failed';
			state.error = action.payload;
		},
	},
});

export default librosSlice.reducer;
export const {limpiarLibros} = librosSlice.actions;

export const selectTodosLibros = (state: RootState) =>
	state.librosReducer.libros;

export const selectStatusLibros = (state: RootState) =>
	state.librosReducer.status;

export const selectErrorLibro = (state: RootState) =>
	state.librosReducer.status;
