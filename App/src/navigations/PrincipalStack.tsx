import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PantallaPrincipal, NuevoLibro} from '../screens';
import {DrawerParamList} from './DrawerNavigation';
import {Libro} from '../types';
import Camara from '../screens/InsertarLibro/Camara';
import ListaResultadosLibros from '../screens/InsertarLibro/ListaResultadosLibros';
/* ****************************************************** */
/* ********** Navegador de Stack añadir libros ********** */
/* ****************************************************** */

/* Conjunto de pantallas que componen el stack de navegación
  principal de la aplicación. Incluye las siguientes pantallas:

  Pantalla principal, que permite al usuario añadir libros de
  dos formas (mediante el escaneo del código de barras y de
  forma manual)

  Nuevo libro: pantalla que muestra los detalles del libro que
  se va a añadir y permite editarlos. */

// Definimos el tipo de nuestras rutas y el los parámetros que
// reciben
export type PrincipalStackParamList = {
	'Pantalla Principal': undefined;
	'Lista Libros': Libro[];
	'Nuevo Libro': Libro;
	'Camara': undefined;
};

// Definimos el tipo de las props que recibirán las pantallas de
// este navegador (necesario cuando pasamos los parámetros a pantallas)
export type PantallaPrincipalNavigationProps = CompositeNavigationProp<
	StackNavigationProp<PrincipalStackParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

// Creamos el navegador de stack
const PrincipalStack = createStackNavigator<PrincipalStackParamList>();

// Tipos para la pantalla Nuevo Libro
type NuevoLibroRouteProp = RouteProp<PrincipalStackParamList, 'Nuevo Libro'>;
type NuevoLibroNavigationProp = StackNavigationProp<
	PrincipalStackParamList,
	'Nuevo Libro'
>;

export type NuevoLibroProps = {
	route: NuevoLibroRouteProp;
	navigation: NuevoLibroNavigationProp;
};

type ListaLibrosRouteProp = RouteProp<PrincipalStackParamList, 'Lista Libros'>;
type ListaLibrosNavigationProp = StackNavigationProp<
	PrincipalStackParamList,
	'Lista Libros'
>;

export type ListaLibrosProps = {
	route: ListaLibrosRouteProp;
	navigation: ListaLibrosNavigationProp;
};
// Tipos para la pantalla de la cámara
export type CamaraRouteProp = RouteProp<PrincipalStackParamList, 'Camara'>;
export type CamaraNavigationProp = StackNavigationProp<
	PrincipalStackParamList,
	'Camara'
>;
/* PantallasLibros
    Función que devuelve el navegador a renderizar con todas las
    pantallas para el flujo de navegación con libros */
export function PantallasLibros() {
	return (
		<PrincipalStack.Navigator headerMode="none">
			<PrincipalStack.Screen
				name="Pantalla Principal"
				component={PantallaPrincipal}
			/>
			<PrincipalStack.Screen name="Nuevo Libro" component={NuevoLibro} />
			<PrincipalStack.Screen
				name="Lista Libros"
				component={ListaResultadosLibros}
			/>
			<PrincipalStack.Screen name="Camara" component={Camara} />
		</PrincipalStack.Navigator>
	);
}
