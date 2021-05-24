import React, {Dispatch} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {BotonIcon, TextoBoton} from '../Botones';
import {colores} from '../../styles';
import {Alert} from 'react-native';
import {AccionLibroRedux, obtenerLibros} from '../../redux/librosSlice';
import {eliminarLibro} from '../../utils/Biblioteca';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import {selectUsuario} from '../../redux/authSlice';
import {
	PantallaPrincipalNavigationProps,
	PantallasBibliolNavigationProps,
} from '../../navigations';
import {AccionLibro, EstadoLibro} from './LibroReducer';
import {TipoPrestamo} from '../../types';

export function MenuOpciones(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
	dispatchRedux: Dispatch<AccionLibroRedux>;
	navigation:
		| PantallasBibliolNavigationProps
		| PantallaPrincipalNavigationProps;
}) {
	const usuario = useSelector(selectUsuario);
	return (
		<Modal
			style={styles.modal}
			visible={props.estado.menuOpcionesVisible}
			animationType="slide"
			transparent={true}>
			<View style={styles.modalView}>
				<View style={styles.tarjeta}>
					<View style={styles.fila}>
						<Text>Opciones</Text>
						<Icon
							name="close"
							size={25}
							color={colores.principal}
							style={styles.iconoCerrar}
							onPress={() =>
								props.dispatch({
									type: 'menuOpcionesVisible',
									menuOpcionesVisible: false,
								})
							}
						/>
					</View>
					<BotonIcon
						onPress={() => {
							if (
								(props.estado.libro.prestado === TipoPrestamo.ninguno ||
									props.estado.libro.prestado === null ||
									props.estado.libro.prestado === undefined) &&
								props.estado.libro.esPropietario !== false
							) {
								// Si el libro no está siendo prestado y somos su propietario,
								// lo podemos prestar
								props.dispatch({type: 'modalPrestamo', modalPrestamo: true});
							} else if (props.estado.libro.esPropietario === false) {
								// Si no somos el propietario del libro
								Snackbar.show({
									text: 'No puedes prestar un libro que no es tuyo',
									duration: Snackbar.LENGTH_SHORT,
								});
							} else {
								// En otro caso (somos propietario y libro está prestado)
								Snackbar.show({
									text:
										'No puedes añadir un préstamo si el libro ya está siendo prestado',
									duration: Snackbar.LENGTH_SHORT,
								});
							}
						}}>
						<Icon
							name="book"
							size={25}
							color={colores.texto_claro}
							style={styles.icono}
						/>
						<TextoBoton>Añadir préstamo</TextoBoton>
					</BotonIcon>
					<BotonIcon
						onPress={() => {
							props.dispatch({
								type: 'modalHistorialPrestamo',
								modalHistorialPrestamo: true,
							});
						}}>
						<Icon
							name="history"
							size={25}
							color={colores.texto_claro}
							style={styles.icono}
						/>
						<TextoBoton>Ver historial de préstamos</TextoBoton>
					</BotonIcon>
					<BotonIcon
						style={{backgroundColor: colores.importante}}
						onPress={() => {
							if (
								props.estado.libro.prestado !== TipoPrestamo.deudor &&
								props.estado.libro.prestado !== TipoPrestamo.prestador
							) {
								Alert.alert(
									'¿Eliminar ' + props.estado.libro.titulo + '?',
									'Esta operación no se puede deshacer.',
									[
										{
											text: 'Cancelar',
											style: 'cancel',
										},
										{
											text: 'Sí, eliminar',
											onPress: () => {
												// Eliminamos el libro
												eliminarLibro(usuario, props.estado.libro);
												// Actualizamos el estado de la aplicación
												props.dispatchRedux(obtenerLibros(usuario));
												// Cerramos el menú
												props.dispatch({
													type: 'menuOpcionesVisible',
													menuOpcionesVisible: false,
												});
												// Navegamos hacia la pantalla
												props.navigation.goBack();
											},
										},
									],
									{cancelable: true},
								);
							} else {
								Snackbar.show({
									text: 'No puedes eliminar un libro que está siendo prestado',
									duration: Snackbar.LENGTH_SHORT,
								});
							}
						}}>
						<Icon
							name="delete"
							size={25}
							color={colores.texto_claro}
							style={styles.icono}
						/>
						<TextoBoton>Eliminar libro</TextoBoton>
					</BotonIcon>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: 'baseline',
		justifyContent: 'flex-end',
	},
	fila: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'center',
	},
	modalView: {
		flexWrap: 'wrap',
		flex: 1,
		alignSelf: 'baseline',
		alignContent: 'center',
		justifyContent: 'flex-end',
		width: '100%',
	},
	tarjeta: {
		width: '100%',
		marginTop: 20,
		backgroundColor: 'white',
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		padding: 20,
		alignItems: 'stretch',
		justifyContent: 'flex-end',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 5,
	},
	icono: {
		paddingRight: 15,
	},
	iconoCerrar: {
		paddingBottom: 20,
		justifyContent: 'flex-end',
	},
	importante: {},
});
