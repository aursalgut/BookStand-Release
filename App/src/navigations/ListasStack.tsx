import React from 'react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
	createStackNavigator,
	StackNavigationProp,
} from '@react-navigation/stack';
import {Libro} from '../types';
import {DrawerParamList} from './DrawerNavigation';
import {ListaDeLibros} from '../screens/Biblioteca/ListasDeLibros';
import {DetallesLibro} from '../screens';
import {DetallesLista} from '../screens/Biblioteca/DetallesLista';

export type ListasStackParamList = {
	Listas: undefined;
	DetallesLista: {libros: Libro[]; nombre: string};
	DetallesLibro: Libro;
};

export type PantallasListasNavigationProps = CompositeNavigationProp<
	StackNavigationProp<ListasStackParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

const ListasStack = createStackNavigator<ListasStackParamList>();

type DetallesListaRouteProp = RouteProp<ListasStackParamList, 'DetallesLista'>;
type DetallesListaNavigationProp = StackNavigationProp<
	ListasStackParamList,
	'DetallesLista'
>;

export type DetallesListaProps = {
	route: DetallesListaRouteProp;
	navigation: DetallesListaNavigationProp;
};

type DetallesLibroRouteProp = RouteProp<ListasStackParamList, 'DetallesLibro'>;
type DetallesLibroNavigationProp = StackNavigationProp<
	ListasStackParamList,
	'DetallesLibro'
>;

export type DetallesLibroProps = {
	route: DetallesLibroRouteProp;
	navigation: DetallesLibroNavigationProp;
};

export function PantallasListas() {
	return (
		<ListasStack.Navigator headerMode="none">
			<ListasStack.Screen name="Listas" component={ListaDeLibros} />
			<ListasStack.Screen name="DetallesLista" component={DetallesLista} />
			<ListasStack.Screen name="DetallesLibro" component={DetallesLibro} />
		</ListasStack.Navigator>
	);
}
