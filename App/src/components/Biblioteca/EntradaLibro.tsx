import React from 'react';
import styled from 'styled-components/native';
import {colores} from '../../styles';
import {Alert, Pressable, StyleSheet} from 'react-native';
import {array2Cadena} from '../../utils';
import {
	PantallaPrincipalNavigationProps,
	PantallasBibliolNavigationProps,
} from '../../navigations';
import {useNavigation} from '@react-navigation/native';
import {Libro} from '../../types';
import {PantallasListasNavigationProps} from '../../navigations/ListasStack';
import {PantallasFavoritosNavigationProps} from '../../navigations/FavoritosStack';

/* Componente para mostrar los datos de un libro */
// El contexto (navegador desde el que se usa el componente)
/* Sirve para que el tap en el elemento nos lleve a una pantalla u otra */
export enum contexto {
	principal = 'PRINCIPAL',
	todosLibros = 'LIBROS',
	listas = 'LISTAS',
	favoritos = 'FAVORITOS',
}
const EntradaLibro = function (props: {libro: Libro; contexto?: contexto}) {
	const navigationBiblio = useNavigation<PantallasBibliolNavigationProps>();
	const navigationPrincipal = useNavigation<PantallaPrincipalNavigationProps>();
	const navigationListas = useNavigation<PantallasListasNavigationProps>();
	const navigationFavoritos = useNavigation<PantallasFavoritosNavigationProps>();
	return (
		<Tarjeta>
			<Pressable
				style={styles.textoOverflow}
				onPress={() => {
					if (props.contexto === contexto.principal) {
						navigationPrincipal.navigate('Nuevo Libro', props.libro);
					} else if (props.contexto === contexto.todosLibros) {
						navigationBiblio.navigate('Detalles libro', props.libro);
					} else if (props.contexto === contexto.listas) {
						navigationListas.navigate('DetallesLibro', props.libro);
					} else if (props.contexto === contexto.favoritos) {
						navigationFavoritos.navigate('DetallesLibro', props.libro);
					}
				}}>
				<Titulo numberOfLines={1} ellipsizeMode="tail">
					{props.libro.titulo ? props.libro.titulo : 'Sin título'}
				</Titulo>
				<Autor
					numberOfLines={1}
					ellipsizeMode="tail"
					onLongPress={() => {
						if (props.libro.autores) {
							Alert.alert('Autores', array2Cadena(props.libro.autores));
						}
					}}>
					{props.libro.autores
						? array2Cadena(props.libro.autores)
						: 'No hay autores'}
				</Autor>
			</Pressable>
		</Tarjeta>
	);
};

export default EntradaLibro;

// Estilo y componentes auxiliares
//  border-radius: 6px;
const Tarjeta = styled.ScrollView`
	background-color: ${colores.fondo_tarjeta};
	padding: 15px;
	margin-horizontal: 10px;
	margin-vertical: 5px;
	border-radius: 8px;
`;
const Titulo = styled.Text`
	font-size: 18px;
`;

const Autor = styled.Text`
	font-size: 14px;
`;

// const Fila = styled.View`
//   flex-direction: row;
//   align-items: center;
//   padding: 5px;
// `;

const styles = StyleSheet.create({
	icono: {
		paddingHorizontal: 5,
	},
	textoOverflow: {
		flex: 1,
	},
	centrado: {
		alignSelf: 'center',
	},
	izquierda: {
		alignSelf: 'flex-start',
	},
	derecha: {
		alignSelf: 'flex-end',
	},
});
