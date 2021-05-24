import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

import {colores} from '../../styles';

// Estilo y componentes auxiliares
export const Tarjeta = styled.ScrollView`
	background-color: ${colores.fondo_tarjeta};
	padding: 16px;
	border-radius: 16px;
	margin: 8px;
	elevation: 2;
`;
export const Titulo = styled.Text`
	font-size: 24px;
`;

export const Autor = styled.Text`
	font-size: 16px;
`;

export const Isbn = styled.Text`
	font-size: 12px;
	color: ${(props) =>
		props.selectable ? colores.importante : colores.texto_oscuro};
`;

export const TextoNota = styled.Text`
	font-size: 14px;
`;

export const Fila = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 4px;
`;

export const Nota = styled.View`
	padding: 16px;
	border-radius: 8px;
	border-width: 1px;
	border-color: ${colores.principal};
`;

export const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
		borderRadius: 16,
	},
	icono: {
		paddingRight: 16,
	},
	fila: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: 8,
	},
	textoOverflow: {
		flex: 1,
	},
	centrado: {
		alignSelf: 'center',
		paddingVertical: 8,
	},
	derecha: {
		alignSelf: 'flex-end',
	},
	tarjeta: {
		flex: 1,
		flexShrink: 0,
		backgroundColor: colores.fondo,
		borderRadius: 16,
		paddingVertical: 16,
		paddingHorizontal: 8,
		margin: 16,
		justifyContent: 'center',
	},
	imagenLibro: {
		width: 110,
		height: 150,
		marginRight: 8,
		borderRadius: 8,
	},
});
