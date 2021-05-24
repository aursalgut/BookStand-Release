import {persistStore, persistReducer} from 'redux-persist';
import {createLogger} from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';
import {default as authReducer} from './authSlice';
import {applyMiddleware, createStore, combineReducers} from '@reduxjs/toolkit';
import Redux from 'redux-thunk';
import {default as librosReducer} from './librosSlice';
/*  FICHERO QUE CONFIGURA Y CREA EL STORE DE LA APLICACIÓN

  Un store es un árbol de objetos inmutables en Redux. Es un contenedor que
  almacena el estado de la aplicación. Redux solo puede tener un único store
  en la aplicación. Cuando un store es creado, se deben especificar los reducers
  correspondientes.

  Los reducers son funciones que reciben el estado actual de la aplicación y un
  objeto de acción, deciden cómo actualizar el estado de ser necesario y devuelven
  el nuevo estado. Son el único lugar donde se puede cambiar el estado de la aplicación. */

// Combinamos los reductores que usará nuestra aplicación en uno solo
// De momento solo nos hace falta uno...
const appReducers = combineReducers({authReducer, librosReducer});

// Definimos un objeto con la configuración de persistencia deseada
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['authReducer', 'librosReducer'],
};

// Aplicamos la configuración a los reducers de la aplicación
const persistedReducer = persistReducer(persistConfig, appReducers);

// Creamos el store de la apliación con los reducers y el middleware necesario
export const store = createStore(
	persistedReducer,
	applyMiddleware(createLogger(), Redux),
);
export type RootState = ReturnType<typeof store.getState>;

// Exportamos el store persistido
export const persistedStore = persistStore(store);
