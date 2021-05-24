import { firebase, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {Modal, StyleSheet, Switch, Text, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';

import {selectUsuario} from '../../redux/authSlice';
import {AccionLibroRedux, obtenerLibros} from '../../redux/librosSlice';
import {colores} from '../../styles';
import {Prestamo, Usuario} from '../../types';
import {actualizarPrestamo} from '../../utils/Prestamo';
import {Boton, TextoBoton} from '../Botones';
import CampoTexto from '../CampoTexto';
import {CabeceraModal} from '../Modales/Modal';
import {AccionPrestamo, EstadoPrestamo} from './PrestamoReducer';

export function ModificarPrestamo(props: {
	estado: EstadoPrestamo;
	dispatch: Dispatch<AccionPrestamo>;
	prestamo: Prestamo;
	dispatchRedux: Dispatch<AccionLibroRedux>;
}) {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState(new Date());
	const [detalles, setDetalles] = useState('');
	const [hayFechaDev, sethayFechaDev] = useState(false);
	const toggleSwitch = () => sethayFechaDev((previousState) => !previousState);
	const usuario = useSelector(selectUsuario);

	return (
		<Modal
			visible={props.estado.modalVisible}
			animationType="fade"
			transparent={true}>
			<View style={styles.modal}>
				<View style={styles.tarjeta}>
					<CabeceraModal
						titulo={
							props.estado.devolver ? 'Devolver préstamo' : 'Modificar préstamo'
						}
						accionCerrar={{type: 'cerrarModal'}}
						dispatch={props.dispatch}
					/>
					<IncluirFechaDevolucion
						hayFechaDev={hayFechaDev}
						toggleSwitch={toggleSwitch}
						date={date}
						setShowDatePicker={setShowDatePicker}
					/>
					<DateTimePickerModal
						isVisible={showDatePicker}
						mode="date"
						onConfirm={(fecha) => {
							setShowDatePicker(false);
							setDate(fecha);
						}}
						onCancel={() => setShowDatePicker(false)}
					/>
					<CampoTexto
						style={styles.contenedorNota}
						multiline={true}
						placeholder={'Añade un comentario...'}
						onChangeText={(texto) => {
							setDetalles(texto);
						}}
					/>
					<BotonesModalModificarPrestamo
						estado={props.estado}
						dispatch={props.dispatch}
						usuario={usuario}
						prestamo={props.prestamo}
						dispatchRedux={props.dispatchRedux}
						hayFechaDev={hayFechaDev}
						date={firebase.firestore.Timestamp.fromDate(date)}
						detalles={detalles}
					/>
				</View>
			</View>
		</Modal>
	);
}

function IncluirFechaDevolucion(props: {
	hayFechaDev: boolean;
	toggleSwitch: Dispatch<SetStateAction<boolean>>;
	setShowDatePicker: Dispatch<SetStateAction<boolean>>;
	date: Date;
}) {
	return (
		<>
			<View style={styles.fila}>
				<Switch
					trackColor={{
						false: colores.track_switch_des,
						true: colores.track_switch,
					}}
					thumbColor={
						props.hayFechaDev ? colores.thumb_swith : colores.thumb_swith_des
					}
					ios_backgroundColor={colores.thumb_swith}
					onValueChange={props.toggleSwitch}
					value={props.hayFechaDev}
				/>
				<Text style={styles.textoSeleccionUsuario}>
					Incluir fecha de devolución
				</Text>
			</View>
			{props.hayFechaDev && (
				<View style={styles.fila}>
					<Text
						style={styles.fecha}
						onPress={() => {
							props.setShowDatePicker(true);
						}}>
						{props.date.toDateString()}
					</Text>
				</View>
			)}
		</>
	);
}

function BotonesModalModificarPrestamo(props: {
	estado: EstadoPrestamo;
	dispatch: Dispatch<AccionPrestamo>;
	usuario: Usuario;
	prestamo: Prestamo;
	detalles: string;
	hayFechaDev: boolean;
	date: FirebaseFirestoreTypes.Timestamp;
	dispatchRedux: Dispatch<AccionLibroRedux>;
}) {
	return (
		<>
			{props.estado.devolver && (
				<Boton
					onPress={() => {
						actualizarPrestamo(props.usuario, {
							...props.prestamo,
							fechaDevolucion: props.hayFechaDev ? props.date : undefined,
							detalles: props.detalles !== '' ? props.detalles : undefined,
							devuelto: true,
						});

						// Actualizamos el estado de la aplicación
						props.dispatchRedux(obtenerLibros(props.usuario));

						// Cerramos el modal
						props.dispatch({type: 'cerrarModal'});

						Snackbar.show({
							text:
								'Se ha enviado un mensaje de confirmación para la devolución',
						});
					}}>
					<TextoBoton>Devolver libro</TextoBoton>
				</Boton>
			)}
			{props.estado.actualizar && (
				<Boton
					onPress={() => {
						actualizarPrestamo(props.usuario, {
							...props.prestamo,
							fechaDevolucion: props.hayFechaDev ? props.date : undefined,
							detalles: props.detalles !== '' ? props.detalles : undefined,
							devuelto: false,
						});

						// Actualizamos el estado de la aplicación
						props.dispatchRedux(obtenerLibros(props.usuario));

						// Cerramos el modal
						props.dispatch({type: 'cerrarModal'});

						Snackbar.show({
							text:
								'Se ha enviado un mensaje de confirmación para la modificación',
						});
					}}>
					<TextoBoton>Modificar préstamo</TextoBoton>
				</Boton>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colores.fondo_modal,
		padding: 24,
	},
	tarjeta: {
		alignItems: 'center',
		width: '100%',
		margin: 16,
		padding: 16,
		backgroundColor: 'white',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 5,
	},
	tituloModal: {
		fontSize: 16,
	},
	fecha: {
		fontSize: 16,
		fontFamily: 'RobotoSlab-Regular',
		margin: 4,
	},
	fila: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: 5,
	},
	textoSeleccionUsuario: {
		fontSize: 16,
		alignSelf: 'center',
		padding: 8,
	},
	cabecera: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	iconoCerrar: {
		alignSelf: 'flex-end',
	},
	contenedorNota: {
		width: '100%',
		alignItems: 'center',
		borderTopWidth: 1,
		borderColor: colores.deshabilitado,
		margin: 12,
		padding: 12,
	},
});
