import React from 'react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
	createStackNavigator,
	StackNavigationProp,
} from '@react-navigation/stack';
import {Libro} from '../types';
import {DrawerParamList} from './DrawerNavigation';
import {Favoritos} from '../screens/Biblioteca/Favoritos';
import {DetallesLibro} from '../screens';

export type FavoritosStackParamList = {
	Favoritos: undefined;
	DetallesLibro: Libro;
};

export type PantallasFavoritosNavigationProps = CompositeNavigationProp<
	StackNavigationProp<FavoritosStackParamList>,
	DrawerNavigationProp<DrawerParamList>
>;

const FavoritosStack = createStackNavigator<FavoritosStackParamList>();

type DetallesLibroRouteProp = RouteProp<
	FavoritosStackParamList,
	'DetallesLibro'
>;
type DetallesLibroNavigationProp = StackNavigationProp<
	FavoritosStackParamList,
	'DetallesLibro'
>;

export type DetallesLibroProps = {
	route: DetallesLibroRouteProp;
	navigation: DetallesLibroNavigationProp;
};

export function PantallasFavoritos() {
	return (
		<FavoritosStack.Navigator headerMode="none">
			<FavoritosStack.Screen name="Favoritos" component={Favoritos} />
			<FavoritosStack.Screen name="DetallesLibro" component={DetallesLibro} />
		</FavoritosStack.Navigator>
	);
}
