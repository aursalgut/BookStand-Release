/* eslint-disable react/display-name */
import React from 'react';
import 'react-native-gesture-handler';
import {
	createDrawerNavigator,
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colores} from '../styles';
import {Acerca, Perfil} from '../screens';
import {PantallasLibros} from './PrincipalStack';
import {PantallasContactos} from './ContactosStack';
import {BibliotecaTab} from './BibliotecaTab';
import {View, StyleSheet} from 'react-native';
import {TextoEncabezado} from '../components/Encabezado';
import Reading from '../assets/images/reading.svg';

/* ****************************************************** */
/* ***************** Navegador de cajón ***************** */
/* ****************************************************** */

/* Conjunto de pantallas que solo están accesibles a los usuarios que han
  iniciado sesión en la aplicación. Están organizadas en un navegador de
  cajón lateral y pueden contener otros navegadores dentro (como el stack
  de navegación para los libros)*/

// Definimos las pantallas que tendrá el cajón
export type DrawerParamList = {
	Header: undefined;
	'Pantalla Principal': undefined;
	Biblioteca: any;
	Perfil: undefined;
	'Acerca de BookStand': undefined;
	'Mis contactos': undefined;
};

// Creamo el navegador de cajón para el menú de la aplicación
const Drawer = createDrawerNavigator<DrawerParamList>();

export type DrawerNavigationProps = typeof Drawer;
/* PantallasUsuarios
    Función que devuelve el navegador a renderizar con todas las
    pantallas que lo forman. Estas pantallas a su vez pueden ser
    otro navegadores que estén anidados */
export function PantallasUsuarios() {
	return (
		<Drawer.Navigator
			initialRouteName="Pantalla Principal"
			backBehavior="initialRoute"
			drawerContent={(props) => <EncabezadoMenu {...props} />}
			drawerContentOptions={{
				activeTintColor: colores.principal_oscuro,
			}}>
			<Drawer.Screen
				name="Pantalla Principal"
				component={PantallasLibros}
				options={{
					drawerIcon: () => (
						<Icon name="home" size={25} color={colores.principal_oscuro} />
					),
				}}
			/>
			<Drawer.Screen
				name="Biblioteca"
				component={BibliotecaTab}
				options={{
					drawerIcon: () => (
						<Icon
							name="library-books"
							size={25}
							color={colores.principal_oscuro}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Mis contactos"
				component={PantallasContactos}
				options={{
					drawerIcon: () => (
						<Icon name="contacts" size={25} color={colores.principal_oscuro} />
					),
				}}
			/>
			<Drawer.Screen
				name="Perfil"
				component={Perfil}
				options={{
					drawerIcon: () => (
						<Icon
							name="account-circle"
							size={25}
							color={colores.principal_oscuro}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Acerca de BookStand"
				component={Acerca}
				options={{
					drawerIcon: () => (
						<Icon name="info" size={25} color={colores.principal_oscuro} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
}

function EncabezadoMenu(props: DrawerContentComponentProps) {
	return (
		<DrawerContentScrollView
			contentContainerStyle={styles.contenedor}
			{...props}>
			<View style={styles.cabecera}>
				<TextoEncabezado>BookStand</TextoEncabezado>
			</View>
			<DrawerItemList {...props} />
			<View style={styles.pie}>
				<Reading width={300} height={300} />
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
		justifyContent: 'flex-start',
		alignContent: 'flex-start',
	},
	cabecera: {
		alignItems: 'center',
	},
	pie: {
		flex: 1,
		justifyContent: 'flex-end',
	},
});
