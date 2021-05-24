import React, {Dispatch, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styled from 'styled-components/native';

import {
	AccionBiblioteca,
	EstadoBiblioteca,
} from '../../screens/Biblioteca/BibliotecaReducer';
import {colores} from '../../styles';
import {CriterioBusquedaTildes, Libro} from '../../types';
import {buscarPorCriterio} from '../../utils/Biblioteca';
import CampoTexto from '../CampoTexto';

/**
 * Componente que representa la barra de búsqueda para la biblioteca
 * @param props 
 * @returns 
 */
export function BarraBusqueda(props: {
	estado: EstadoBiblioteca;
	dispatch: Dispatch<AccionBiblioteca>;
	libros: Libro[];
}) {
	/* Variable de estado que permite mostrar el botón para limpiar los criterios
	de búsqueda desde la propia barra */
	const [mostrarLimpiar, setMostrarLimpiar] = useState(false);
	useEffect(() => {
		if (
			(props.estado.cadenaBusqueda != '' && props.estado.criterio) ||
			props.estado.filtrado
		) {
			setMostrarLimpiar(true);
		}
	}, [props.estado.criterio, props.estado.cadenaBusqueda]);
	return (
		<Contenedor>
			<CampoTexto
				style={styles.barraBusqueda}
				placeholder={`Buscar por ${
					CriterioBusquedaTildes[
						props.estado.criterio as keyof typeof CriterioBusquedaTildes
					]
				}`}
				value={props.estado.cadenaBusqueda}
				onChangeText={(cadenaBusqueda) =>
					props.dispatch({
						type: 'buscar',
						cadenaBusqueda: cadenaBusqueda,
						librosAMostrar: buscarPorCriterio(
							cadenaBusqueda,
							props.estado,
							props.libros,
						),
					})
				}
			/>
			{mostrarLimpiar && (
				<Icon
					name="clear"
					size={30}
					color={colores.principal_oscuro}
					style={styles.icono}
					onPress={() => {
						props.dispatch({type: 'limpiarDatos'});
						setMostrarLimpiar(false);
					}}
				/>
			)}
			<Icon
				name="more-vert"
				size={30}
				color={colores.principal_oscuro}
				style={styles.icono}
				onPress={() => {
					props.dispatch({type: 'abrirCuadroBusqueda'});
				}}
			/>
		</Contenedor>
	);
}

// Componentes auxiliares y estilos
const Contenedor = styled.View`
	justify-content: space-evenly;
	align-items: center;
	align-content: stretch;
	flex-direction: row;
	background-color: white;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 4px;
	border-radius: 8px;
	border-color: ${colores.principal_oscuro};
	elevation: 1;
`;

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	icono: {
		padding: 4,
		margin: 4,
	},
	barraBusqueda: {
		flex: 1,
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(52, 52, 52, 0.5)',
	},
	tarjeta: {
		flexShrink: 0,
		backgroundColor: colores.fondo,
		borderRadius: 15,
		paddingVertical: 20,
		paddingHorizontal: 10,
		margin: 20,
		justifyContent: 'center',
	},
	tituloModal: {
		alignSelf: 'center',
		fontSize: 18,
	},
});
