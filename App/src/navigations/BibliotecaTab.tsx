import 'react-native-gesture-handler';

import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {CompositeNavigationProp} from '@react-navigation/core';
import {DrawerNavigationProp} from '@react-navigation/drawer';
/* eslint-disable react/display-name */
import {
	createMaterialBottomTabNavigator,
	MaterialBottomTabNavigationProp,
} from '@react-navigation/material-bottom-tabs';

import colores from '../styles/colores';
import {BiblioStackParamList, PantallasBiblioteca} from './BibliotecaStack';
import {DrawerParamList} from './DrawerNavigation';
import {FavoritosStackParamList, PantallasFavoritos} from './FavoritosStack';
import {ListasStackParamList, PantallasListas} from './ListasStack';
import {PantallasPrestamos, PrestamosStackParamList} from './PrestamosStack';

// Tipo de las rutas del navegador de pestañas
export type BibliotecaParamList = {
	Todos: BiblioStackParamList;
	Listas: ListasStackParamList;
	Favoritos: FavoritosStackParamList;
	Prestados: PrestamosStackParamList;
};

// Tipo de las props de las pantallas del navegador
export type PantallasBibliotecaNavigationProps = CompositeNavigationProp<
	MaterialBottomTabNavigationProp<BibliotecaParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

const Tab = createMaterialBottomTabNavigator<BibliotecaParamList>();

export function BibliotecaTab() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Todos"
				component={PantallasBiblioteca}
				options={{
					tabBarColor: colores.principal_oscuro,
					tabBarLabel: 'Todo',
					tabBarIcon: () => (
						<Icon name="auto-stories" size={25} color="white" />
					),
				}}
			/>
			<Tab.Screen
				name="Listas"
				component={PantallasListas}
				options={{
					tabBarColor: colores.acento,
					tabBarLabel: 'Listas',
					tabBarIcon: () => <Icon name="category" size={25} color="white" />,
				}}
			/>
			<Tab.Screen
				name="Favoritos"
				component={PantallasFavoritos}
				options={{
					tabBarColor: colores.importante,
					tabBarLabel: 'Favoritos',
					tabBarIcon: () => <Icon name="star" size={25} color="white" />,
				}}
			/>
			<Tab.Screen
				name="Prestados"
				component={PantallasPrestamos}
				options={{
					tabBarColor: colores.prestado,
					tabBarLabel: 'Préstamos',
					tabBarIcon: () => <Icon name="event-note" size={25} color="white" />,
				}}
			/>
		</Tab.Navigator>
	);
}
