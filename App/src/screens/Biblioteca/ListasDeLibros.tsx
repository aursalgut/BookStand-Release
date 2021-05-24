import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Encabezado} from '../../components';
import {selectTodosLibros} from '../../redux/librosSlice';
import {buscarLibrosPorLista, obtenerListas} from '../../utils/Biblioteca';
import ListasVacio from '../../assets/images/nodata.svg';
import colores from '../../styles/colores';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Libro} from '../../types';
import {PantallasListasNavigationProps} from '../../navigations/ListasStack';
import {useNavigation} from '@react-navigation/native';

export function ListaDeLibros() {
	const sinListas: string[] = ['No hay listas definidas por el usuario'];
	const [listas, setListas] = useState({} as string[]);
	const libros = useSelector(selectTodosLibros); // los libros que hay
	const navigation = useNavigation<PantallasListasNavigationProps>();
	useEffect(() => {
		setListas(obtenerListas(libros) as string[]);
	}, [libros]);
	return (
		<View style={styles.contenedorPrincipal}>
			<Encabezado />
			<FlatList
				data={listas.length !== 0 ? listas : sinListas}
				numColumns={2}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({item}) =>
					listas.length !== 0 ? (
						<ElementoLista
							nombreLista={item}
							libros={libros}
							navigation={navigation}
						/>
					) : (
						<View style={styles.contenedorVacio}>
							<ListasVacio width={250} height={250} />
							<Text style={styles.texto}>
								Aquí aparecerán las listas que crees. Para crear una lista,
								edita el campo "Listas" del libro que quieras añadir.
							</Text>
						</View>
					)
				}
			/>
		</View>
	);
}

function ElementoLista(props: {
	nombreLista: string;
	libros: Libro[];
	navigation: PantallasListasNavigationProps;
}) {
	return (
		<Pressable
			onPress={() => {
				const libros = buscarLibrosPorLista(props.libros, props.nombreLista);
				console.log(libros);
				props.navigation.navigate('DetallesLista', {
					libros: libros,
					nombre: props.nombreLista,
				});
			}}
			style={styles.contenedorLista}>
			<Text style={styles.textoLista}>{props.nombreLista}</Text>
			<Icon name="category" size={30} style={styles.icono} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	contenedorPrincipal: {
		flex: 1,
	},
	contenedorVacio: {
		margin: 24,
		padding: 12,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		flex: 1,
	},
	texto: {
		margin: 12,
		color: colores.texto_secundario,
		textAlign: 'center',
	},
	textoLista: {
		fontSize: 16,
	},
	contenedorLista: {
		width: '46%',
		marginHorizontal: '2%',
		marginVertical: 4,
		padding: 8,
		borderRadius: 8,
		elevation: 1,
		backgroundColor: colores.fondo_tarjeta,
	},
	icono: {
		color: colores.principal,
		alignSelf: 'flex-end',
	},
});
