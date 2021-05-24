import React from 'react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
	createStackNavigator,
	StackNavigationProp,
} from '@react-navigation/stack';
import {Libro} from '../types';
import {DrawerParamList} from './DrawerNavigation';
import {LibrosPrestados} from '../screens/Biblioteca/LibrosPrestados';
import {DetallesLibro} from '../screens';

export type PrestamosStackParamList = {
	Prestamos: undefined;
	DetallesLibro: Libro;
};

export type PantallasPrestamosNavigationProps = CompositeNavigationProp<
	StackNavigationProp<PrestamosStackParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

const PrestamosStack = createStackNavigator<PrestamosStackParamList>();

type DetallesLibroRouteProp = RouteProp<
	PrestamosStackParamList,
	'DetallesLibro'
>;
type DetallesLibroNavigationProp = StackNavigationProp<
	PrestamosStackParamList,
	'DetallesLibro'
>;

export type DetallesLibroProps = {
	route: DetallesLibroRouteProp;
	navigation: DetallesLibroNavigationProp;
};

export function PantallasPrestamos() {
	return (
		<PrestamosStack.Navigator headerMode="none">
			<PrestamosStack.Screen name="Prestamos" component={LibrosPrestados} />
			<PrestamosStack.Screen name="DetallesLibro" component={DetallesLibro} />
		</PrestamosStack.Navigator>
	);
}
