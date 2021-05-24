import React, {Dispatch, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colores} from '../../styles';
import {Fila} from './LibroEstilo';
import {AccionLibro, EstadoLibro} from './LibroReducer';
import {TipoPrestamo} from '../../types';
import {StyleSheet, Text, View} from 'react-native';
// Muestra los iconos que informan sobre si un libro está marcado
// como favorito, leído o prestado
export function IconosDeEstado(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	const [mostrarBadge, setMostrarBadge] = useState(false);

	useEffect(() => {
		if (
			props.estado.libro.prestado === undefined ||
			props.estado.libro.prestado === TipoPrestamo.ninguno
		) {
			setMostrarBadge(false);
		} else {
			setMostrarBadge(true);
		}
	});
	return (
		<Fila style={styles.centrado}>
			<Icon
				name="local-library"
				size={30}
				color={
					props.estado.libro?.leido ? colores.principal : colores.deshabilitado
				}
				style={styles.icono}
				onPress={() => {
					if (props.estado.editando) {
						/* Editamos el campo del libro adecuado realizando una copia profunda
            (copiar un objeto sin arrastrar dependencias) para evitar modificar libro
            sin el uso de useState y romper el patrón */
						const libroActualizado = JSON.parse(
							JSON.stringify(props.estado.libro),
						);
						// Simplemente invertimos el valor que el atributo tenía previamente
						libroActualizado.leido = !props.estado.libro.leido;
						// Actualizamos el libro
						props.dispatch({type: 'libro', libro: libroActualizado});
					}
				}}
			/>
			<Icon
				name="star"
				size={30}
				color={
					props.estado.libro?.favorito
						? colores.principal
						: colores.deshabilitado
				}
				style={styles.icono}
				onPress={() => {
					if (props.estado.editando) {
						/* Editamos el campo del libro adecuado realizando una copia profunda
            (copiar un objeto sin arrastrar dependencias) para evitar modificar libro
            sin el uso de useState y romper el patrón */
						const libroActualizado = JSON.parse(
							JSON.stringify(props.estado.libro),
						);
						// Simplemente invertimos el valor que el atributo tenía previamente
						libroActualizado.favorito = !props.estado.libro.favorito;
						// Actualizamos el libro
						props.dispatch({type: 'libro', libro: libroActualizado});
					}
				}}
			/>
			{mostrarBadge && (
				<View
					style={
						props.estado.libro.prestado === TipoPrestamo.deudor
							? styles.badgeDeudor
							: styles.badgePrestador
					}>
					<Text
						style={styles.textoBadge}
						onPress={() => {
							props.dispatch({
								type: 'modalHistorialPrestamo',
								modalHistorialPrestamo: true,
							});
						}}>
						{props.estado.libro.prestado === TipoPrestamo.deudor
							? 'ES PRESTADO'
							: 'LO HAS PRESTADO'}
					</Text>
				</View>
			)}
		</Fila>
	);
}

const styles = StyleSheet.create({
	icono: {
		paddingRight: 16,
	},
	centrado: {
		alignSelf: 'center',
		paddingVertical: 8,
	},
	badgeDeudor: {
		borderRadius: 4,
		backgroundColor: colores.importante,
		padding: 4,
	},
	badgePrestador: {
		borderRadius: 4,
		backgroundColor: colores.prestado,
		padding: 4,
	},
	textoBadge: {
		color: colores.texto_claro,
	},
});
