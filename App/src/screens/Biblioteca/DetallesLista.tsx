import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {EntradaLibro} from '../../components';
import {contexto} from '../../components/Biblioteca/EntradaLibro';
import Encabezado from '../../components/Encabezado';
import {DetallesListaProps} from '../../navigations/ListasStack';

export function DetallesLista(props: DetallesListaProps) {
	return (
		<View style={styles.contenedor}>
			<Encabezado />
			<Text style={styles.tituloLista}>{props.route.params.nombre}</Text>
			<View style={styles.contenedor}>
				<FlatList
					data={props.route.params.libros}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item}) => (
						<EntradaLibro libro={item} contexto={contexto.listas} />
					)}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	tituloLista: {
		fontSize: 24,
		alignSelf: 'flex-start',
		marginStart: 16,
	},
});
