import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {EntradaLibro} from '../../components/';
import {contexto} from '../../components/Biblioteca/EntradaLibro';
import Encabezado from '../../components/Encabezado';
import {selectTodosLibros} from '../../redux/librosSlice';
import {colores} from '../../styles';
import {filtrarLibros} from '../../utils/Biblioteca';
import Booklover from './../../assets/images/booklover.svg';
export function Favoritos() {
	// Obtenemos los datos del nuestro almacén global de Redux
	const libros = useSelector(selectTodosLibros); // los libros que hay

	const favoritos = filtrarLibros('favorito', libros);

	return (
		<View style={styles.contenedor}>
			<Encabezado />
			<Text style={styles.titulo}>Mis libros favoritos</Text>
			<View style={styles.contenedor}>
				{favoritos.length === 0 ? (
					<View style={styles.favoritosVacio}>
						<Booklover width={225} height={225} />
						<Text style={styles.textoFavoritos}>
							Los libros que marques como favoritos aparecerán aquí
						</Text>
					</View>
				) : (
					<FlatList
						data={favoritos}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({item}) => (
							<EntradaLibro libro={item} contexto={contexto.favoritos} />
						)}
					/>
				)}
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
	titulo: {
		fontSize: 18,
		alignSelf: 'center',
	},
	favoritosVacio: {
		margin: 24,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	textoFavoritos: {
		color: colores.texto_secundario,
		textAlign: 'center',
	},
});
