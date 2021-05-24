import React, {Dispatch, useReducer} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {Action} from '@reduxjs/toolkit';

import {selectUsuario} from '../../redux/authSlice';
import {AccionLibroRedux, obtenerLibros} from '../../redux/librosSlice';
import {colores} from '../../styles';
import {
	EstadoConfirmacion,
	Prestamo as TipoPrestamo,
	Usuario,
} from '../../types';
import {
	eliminarRegistroPrestamo,
	obtenerCambiosPrestamo,
} from '../../utils/Prestamo';
import {ModificarPrestamo} from './ModificarPrestamo';
import {
	AccionPrestamo,
	estadoInicial,
	EstadoPrestamo,
	reducer,
} from './PrestamoReducer';
import {ListaDeCambios} from './ListaDeCambios';
import {Boton, TextoBoton} from '../Botones';

export function Prestamo(props: {prestamo: TipoPrestamo}) {
	const [estado, dispatch] = useReducer(reducer, estadoInicial);
	const usuario = useSelector(selectUsuario);
	const dispatchRedux = useDispatch();

	let textoPrestamo;
	if (props.prestamo.uidDeudor === usuario.uid) {
		// Nos han prestado un libro
		textoPrestamo = `${props.prestamo.nombrePrestador} te ha prestado el libro \
	el día ${props.prestamo.fechaPrestado.toDate().toLocaleDateString()}`;
	} else {
		// Hemos prestado un libro
		textoPrestamo = `Le has prestado el libro a ${props.prestamo.nombreDeudor} \
	el día ${props.prestamo.fechaPrestado.toDate().toLocaleDateString()}`;
	}
	return (
		<View style={styles.tarjeta}>
			<ModificarPrestamo
				estado={estado}
				dispatch={dispatch}
				prestamo={props.prestamo}
				dispatchRedux={dispatchRedux}
			/>
			<Text>{textoPrestamo}</Text>
			{props.prestamo.fechaDevolucion && !props.prestamo.devuelto && (
				<Text>
					Fecha de devolución estimada:{' '}
					{props.prestamo.fechaDevolucion.toDate().toLocaleDateString()}
				</Text>
			)}
			<TextoEstadoPrestamo prestamo={props.prestamo} />
			{props.prestamo.detalles && <Text>{props.prestamo.detalles}</Text>}
			<VerCambiosPrestamo
				usuario={usuario}
				prestamo={props.prestamo}
				dispatch={dispatch}
				estado={estado}
			/>
			{estado.mostrarCambios && (
				<ListaDeCambios cambios={estado.cambios} usuario={usuario} />
			)}
			<AccionesPrestamo
				dispatchRedux={dispatchRedux}
				usuario={usuario}
				prestamo={props.prestamo}
				dispatch={dispatch}
			/>
		</View>
	);
}

function TextoEstadoPrestamo(props: {prestamo: TipoPrestamo}) {
	let estilo;
	let texto;
	switch (props.prestamo.estado) {
		case EstadoConfirmacion.confirmadoCreacion:
			estilo = styles.textoImportante;
			texto = 'LIBRO NO DEVUELTO';
			break;
		case EstadoConfirmacion.confirmadoDevolucion:
			estilo = styles.textoOk;
			texto = 'LIBRO DEVUELTO';
			break;
		case EstadoConfirmacion.confirmadoModificacion:
			estilo = styles.textoImportante;
			texto = 'LIBRO NO DEVUELTO';
			break;
		case EstadoConfirmacion.pendienteCreacion:
			estilo = styles.textoImportante;
			texto = 'PRÉSTAMO PENDIENTE DE CONFIRMACIÓN';
			break;
		case EstadoConfirmacion.pendienteDevolucion:
			estilo = styles.textoImportante;
			texto = 'DEVOLUCIÓN PENDIENTE DE CONFIRMACIÓN';
			break;
		case EstadoConfirmacion.pendienteModificacion:
			estilo = styles.textoImportante;
			texto = 'MODIFICACIÓN PENDIENTE DE CONFIRMACIÓN';
			break;
		default:
			if (props.prestamo.devuelto) {
				estilo = styles.textoOk;
				texto = 'LIBRO DEVUELTO';
			} else {
				estilo = styles.textoImportante;
				texto = 'LIBRO NO DEVUELTO';
			}
			break;
	}
	return <Text style={estilo}>{texto}</Text>;
}

function AccionesPrestamo(props: {
	dispatchRedux: Dispatch<Action | AccionLibroRedux>;
	usuario: Usuario;
	prestamo: TipoPrestamo;
	dispatch: Dispatch<AccionPrestamo>;
}) {
	return (
		<View style={styles.iconosAccion}>
			<Icon
				name="delete-outline"
				size={25}
				color={colores.texto_oscuro}
				style={styles.icono}
				onPress={() => {
					if (props.prestamo.devuelto) {
						Alert.alert(
							'¿Eliminar registro del préstamo?',
							'Esta operación no se puede deshacer.',
							[
								{
									text: 'Cancelar',
									style: 'cancel',
								},
								{
									text: 'Sí',
									onPress: () => {
										// Eliminamos el libro
										eliminarRegistroPrestamo(props.usuario, props.prestamo);
										// Cargamos el estado de la aplicación
										props.dispatchRedux(obtenerLibros(props.usuario));
									},
								},
							],
							{cancelable: true},
						);
					} else {
						Snackbar.show({
							text:
								'No puedes eliminar el préstamo porque aún no se ha	devuelto el libro',
						});
					}
				}}
				onLongPress={() => {
					Snackbar.show({
						text: 'Eliminar registro',
						duration: Snackbar.LENGTH_SHORT,
					});
				}}
			/>
			{!props.prestamo.devuelto && (
				<View style={styles.iconosAccion}>
					<Icon
						name="more-time"
						size={25}
						color={colores.texto_oscuro}
						style={styles.icono}
						onPress={() => {
							props.dispatch({type: 'actualizar'});
						}}
						onLongPress={() => {
							Snackbar.show({
								text: 'Modificar préstamo',
								duration: Snackbar.LENGTH_SHORT,
							});
						}}
					/>
					<Icon
						name="check-circle-outline"
						size={25}
						color={colores.texto_oscuro}
						style={styles.icono}
						onPress={() => {
							props.dispatch({type: 'devolver'});
						}}
						onLongPress={() => {
							Snackbar.show({
								text: 'Marcar como devuelto',
								duration: Snackbar.LENGTH_SHORT,
							});
						}}
					/>
				</View>
			)}
		</View>
	);
}

function VerCambiosPrestamo(props: {
	usuario: Usuario;
	prestamo: TipoPrestamo;
	dispatch: Dispatch<AccionPrestamo>;
	estado: EstadoPrestamo;
}) {
	return (
		<Boton
			onPress={() => {
				if (!props.estado.mostrarCambios) {
					obtenerCambiosPrestamo(props.prestamo, props.dispatch);
				} else {
					props.dispatch({type: 'ocultarCambios'});
				}
			}}>
			<TextoBoton>
				{!props.estado.mostrarCambios ? 'Ver cambios' : 'Ocultar cambios'}
			</TextoBoton>
		</Boton>
	);
}

const styles = StyleSheet.create({
	tarjeta: {
		flex: 1,
		flexShrink: 0,
		backgroundColor: colores.fondo,
		borderRadius: 8,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginVertical: 4,
		marginHorizontal: 4,
		elevation: 5,
		padding: 4,
	},
	fila: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	iconosAccion: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	icono: {
		paddingVertical: 10,
		paddingHorizontal: 8,
	},
	textoImportante: {
		fontWeight: 'bold',
		color: colores.importante,
	},
	textoOk: {
		fontWeight: 'bold',
		color: colores.principal,
	},
});
