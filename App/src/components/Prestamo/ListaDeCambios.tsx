import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import {colores} from '../../styles';
import {Notificacion, TipoNotificacion, Usuario} from '../../types';

export function ListaDeCambios(props: {
	cambios: Notificacion[];
	usuario: Usuario;
}) {
	return (
		<SafeAreaView>
			<FlatList
				data={props.cambios}
				renderItem={(cambio) => (
					<Cambio cambio={cambio.item} usuario={props.usuario.uid} />
				)}
				keyExtractor={(cambio, index) => index.toString()}
			/>
		</SafeAreaView>
	);
}

function Cambio(props: {cambio: Notificacion; usuario: string}) {
	return (
		<View>
			{props.cambio.origen ? (
				<>
					<View
						style={
							props.cambio.origen.uid === props.usuario
								? styles.mensajeEnviado
								: styles.mensajeRecibido
						}>
						<Text
							style={
								props.cambio.origen.uid === props.usuario
									? styles.tituloDerecha
									: styles.tituloIzda
							}>
							{props.cambio.titulo}
						</Text>
						<Text
							style={
								props.cambio.origen.uid === props.usuario
									? styles.textoDerecha
									: styles.textoIzda
							}>
							{props.cambio.cuerpo}
						</Text>
						{props.cambio.prestamo?.detalles &&
							props.cambio.tipo === TipoNotificacion.actualizacionPrestamo && (
							<>
								<Text style={styles.nuevaFecha}>
										Nueva Fecha:{' '}
									{props.cambio.prestamo.fechaDevolucion
										?.toDate()
										.toLocaleDateString()}
								</Text>
								<Text
									style={
										props.cambio.origen.uid === props.usuario
											? styles.textoDerecha
											: styles.textoIzda
									}>
									{props.cambio.origen.nombre}:{' '}
									{props.cambio.prestamo.detalles}
								</Text>
							</>
						)}
						<Fecha fecha={props.cambio.fecha?.toDate()} />
					</View>
				</>
			) : (
				<></>
			)}
		</View>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Fecha(fecha: any) {
	const nFecha: Date = fecha.fecha;
	return <Text style={styles.fecha}>{nFecha.toLocaleString()}</Text>;
}
const styles = StyleSheet.create({
	mensajeRecibido: {
		alignItems: 'flex-start',
		padding: 8,
		margin: 8,
		borderColor: colores.deshabilitado,
		borderWidth: 1,
		alignSelf: 'flex-start',
		borderTopEndRadius: 16,
		borderTopStartRadius: 16,
		borderBottomEndRadius: 16,
		elevation: 1,
		backgroundColor: colores.fondo_tarjeta,
	},
	mensajeEnviado: {
		alignSelf: 'flex-end',
		alignItems: 'flex-end',
		backgroundColor: colores.principal,
		padding: 8,
		borderTopEndRadius: 16,
		borderTopStartRadius: 16,
		borderBottomStartRadius: 16,
		margin: 8,
		borderColor: colores.principal,
		borderWidth: 1,
		elevation: 1,
	},
	tituloDerecha: {
		fontStyle: 'italic',
		fontWeight: 'bold',
		textAlign: 'right',
	},
	tituloIzda: {
		fontStyle: 'italic',
		fontWeight: 'bold',
		textAlign: 'left',
	},
	textoDerecha: {
		textAlign: 'right',
	},
	textoIzda: {
		textAlign: 'left',
	},
	fecha: {
		fontSize: 12,
		fontStyle: 'italic',
		marginTop: 8,
		paddingTop: 4,
		borderColor: colores.texto_oscuro,
		color: colores.texto_oscuro,
		borderTopWidth: 1,
	},
	nuevaFecha: {

	},
});
