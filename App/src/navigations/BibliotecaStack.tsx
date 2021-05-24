import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Biblioteca, DetallesLibro} from '../screens';
import {DrawerParamList} from './DrawerNavigation';
import {Libro} from '../types';

/* ****************************************************** */
/* ********** Navegador de Stack la biblioteca ********** */
/* ****************************************************** */
/* Conjunto de pantallas que componen el stack de navegación
  de la parte de la biblioteca de la aplicacion. */

// Definimos el tipo de nuestras rutas y el los parámetros que
// reciben
export type BiblioStackParamList = {
	Biblioteca: undefined;
	'Detalles libro': Libro;
};

// Definimos el tipo de las props que recibirán las pantallas de
// este navegador (necesario cuando pasamos los parámetros a pantallas)
export type PantallasBibliolNavigationProps = CompositeNavigationProp<
	StackNavigationProp<BiblioStackParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

// Creamos el navegador de stack para las pantallas de la biblioteca
const BibliotecaStack = createStackNavigator<BiblioStackParamList>();

type DetallesLibroRouteProp = RouteProp<BiblioStackParamList, 'Detalles libro'>;
type DetallesLibroNavigationProp = StackNavigationProp<
	BiblioStackParamList,
	'Detalles libro'
>;

export type DetallesLibroProps = {
	route: DetallesLibroRouteProp;
	navigation: DetallesLibroNavigationProp;
};
/* PantallasLibros
    Función que devuelve el navegador a renderizar con todas las
    pantallas para el flujo de navegación de la buiblioteca */
export function PantallasBiblioteca() {
	return (
		<BibliotecaStack.Navigator headerMode="none">
			<BibliotecaStack.Screen name="Biblioteca" component={Biblioteca} />
			<BibliotecaStack.Screen name="Detalles libro" component={DetallesLibro} />
		</BibliotecaStack.Navigator>
	);
}
