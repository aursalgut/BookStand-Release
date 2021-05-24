import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ContactosPantalla} from '../screens';
import {DrawerParamList} from './DrawerNavigation';

/* ****************************************************** */
/* ******** Navegador de Stack de Conversaciones ******** */
/* ****************************************************** */
/* Conjunto de pantallas que componen el stack de navegación
  de la parte de Contactos de la aplicacion. */

// Definimos el tipo de nuestras rutas y el los parámetros que
// reciben
export type ContactosParamList = {
	Contactos: undefined;
};

// Definimos el tipo de las props que recibirán las pantallas de
// este navegador (necesario cuando pasamos los parámetros a pantallas)
export type ContactosNavigationProps = CompositeNavigationProp<
	StackNavigationProp<ContactosParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

// Creamos el navegador de stack para las pantallas de los Contactoss
const ContactosStack = createStackNavigator<ContactosParamList>();

/* PantallasMercadillo
    Función que devuelve el navegador a renderizar con todas las
    pantallas para el flujo de navegación del mercadillo */
export function PantallasContactos() {
	return (
		<ContactosStack.Navigator headerMode="none">
			<ContactosStack.Screen name="Contactos" component={ContactosPantalla} />
		</ContactosStack.Navigator>
	);
}
