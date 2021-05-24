import React, {Dispatch, useReducer} from 'react';
import {Modal, StyleSheet, View, Text, Pressable, Alert} from 'react-native';
import {TextoBoton, BotonSecundario, Boton} from '../Botones';
import {colores} from '../../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import {selectUsuario} from '../../redux/authSlice';
import {EstadoConfirmacion, Prestamo} from '../../types';
import {agregarPrestamo} from '../../utils/Prestamo';
import {AccionLibroRedux, obtenerLibros} from '../../redux/librosSlice';
import {AccionLibro, EstadoLibro} from '../Libro/LibroReducer';
import {estadoInicial, reducer} from './AgregarPrestamoReducer';
import {ListaUsuarios} from '../../screens/Contactos/ListaUsuarios';
import {obtenerListaContactos} from '../../screens/Contactos/Social';
import {Foto} from '../Foto';
import Snackbar from 'react-native-snackbar';

// Modal que mostrará los pasos para permitir al usuario añadir
// un préstamo
// Este modal solo se mostrará cuando el usuario es propietario del
// libro y cuando no lo tiene actualmente prestado
// TODO: Snackbar para indicar que se ha enviado la solicitud de confirmación
// TODO: Marcar cuando no tienes contactos para prestar el libro
export function AgregarPrestamo(props: {
	estadoLibro: EstadoLibro;
	dispatchLibro: Dispatch<AccionLibro>;
	dispatchRedux: Dispatch<AccionLibroRedux>;
}) {
	const [estadoAgregarPrestamo, dispatch] = useReducer(reducer, {
		...estadoInicial,
		usuario: useSelector(selectUsuario),
	});

	/**
	 * cerrar: función que cierra todos los modales a la vista y limpia el estado
	 * del modal AgregarPrestamo
	 */
	function cerrar() {
		props.dispatchLibro({
			type: 'modalPrestamo',
			modalPrestamo: false,
		});
		props.dispatchLibro({
			type: 'menuOpcionesVisible',
			menuOpcionesVisible: false,
		});
		dispatch({type: 'limpiarEstado'});
	}

	async function onAddPress() {
		const prestamo: Prestamo = {
			id: '', // Id que le asignará el propio firestore
			isbn: props.estadoLibro.libro.isbn, // ISBN del libro a prestar
			titulo: props.estadoLibro.libro.titulo, // Título del libro
			uidPrestador: estadoAgregarPrestamo.usuario.uid, // El usuario que presta el libro
			nombrePrestador: estadoAgregarPrestamo.usuario.nombre,
			uidDeudor: estadoAgregarPrestamo.deudor.uid, // La persona a la que le prestan el libro
			nombreDeudor: estadoAgregarPrestamo.deudor.nombre,
			fechaPrestado: estadoAgregarPrestamo.fechaPrestamo, // Fecha en la que se prestó el libro
			devuelto: false, // Por defecto el libro aún no ha sido devuelto
			estado: EstadoConfirmacion.pendienteCreacion,
		};

		// Cuando agregamos un libro por primera vez, estará pendiente de confirmación
		// Si además tenemos fecha de devolución...
		if (estadoAgregarPrestamo.confechaDevolucion) {
			prestamo.fechaDevolucion = estadoAgregarPrestamo.fechaDevolucion;
		}

		// Añadimos el préstamo a nuestra BBDD
		agregarPrestamo(estadoAgregarPrestamo.usuario, prestamo);
		// Actualizamos los libros de la biblioteca
		props.dispatchRedux(obtenerLibros(estadoAgregarPrestamo.usuario));
	}

	return (
		<Modal
			visible={props.estadoLibro.modalPrestamo}
			animationType="slide"
			transparent={true}>
			<View style={styles.modal}>
				<View style={styles.tarjeta}>
					<View style={styles.cabecera}>
						<Text style={styles.tituloModal}>Añadir préstamo</Text>
						<Icon
							name="close"
							size={25}
							color={colores.principal}
							style={styles.iconoCerrar}
							onPress={() => cerrar()}
						/>
					</View>
					<View>
						{/* SELECCIÓN DE USUARIO */}
						<Pressable
							onPress={async () => {
								obtenerListaContactos(estadoAgregarPrestamo.usuario.uid).then(
									(contactos) => {
										dispatch({
											type: 'listaContactos',
											listaContactos: contactos,
										});
										dispatch({type: 'selUsuarios', selUsuarios: true});
									},
								);
							}}>
							{estadoAgregarPrestamo.deudor.foto && (
								<View style={styles.centrarFoto}>
									<Foto usuario={estadoAgregarPrestamo.deudor} size="small" />
								</View>
							)}
							<Text style={styles.textoSeleccionUsuario}>
								{estadoAgregarPrestamo.deudor.nombre
									? estadoAgregarPrestamo.deudor.nombre
									: 'Selecciona el usuario...'}
							</Text>
						</Pressable>
						{estadoAgregarPrestamo.selUsuarios && (
							<ListaUsuarios
								usuarios={estadoAgregarPrestamo.listaContactos}
								usuario={estadoAgregarPrestamo.usuario}
								dispatch={dispatch}
							/>
						)}
						{/* SELECCIÓN DE FECHA*/}
						<Pressable
							style={styles.contenedorFecha}
							onPress={() => {
								dispatch({type: 'selFechaPrestamo', selFechaPrestamo: true});
							}}>
							<Text>Fecha de préstamo</Text>
							<Text style={styles.fecha}>
								{estadoAgregarPrestamo.fechaPrestamo.toDateString()}
							</Text>
						</Pressable>
						{estadoAgregarPrestamo.selFechaPrestamo && (
							<DateTimePickerModal
								isVisible={estadoAgregarPrestamo.selFechaPrestamo}
								mode="date"
								onConfirm={(fechaP) => {
									dispatch({type: 'selFechaPrestamo', selFechaPrestamo: false});
									dispatch({type: 'fechaPrestamo', fechaPrestamo: fechaP});
								}}
								onCancel={() =>
									dispatch({type: 'selFechaPrestamo', selFechaPrestamo: false})
								}
							/>
						)}
						{/* FECHA DEVOLUCIÓN*/}
						{!estadoAgregarPrestamo.confechaDevolucion && (
							<Pressable
								style={styles.contenedorFecha}
								onPress={() => {
									dispatch({
										type: 'confechaDevolucion',
										confechaDevolucion: true,
									});
								}}>
								<Text style={styles.tituloFechaDev}>
									¿Establecer una fecha aproximada de devolución?
								</Text>
								<Text style={styles.descripcionFechaDev}>
									Enviaremos un recordatorio a quien se lo hayas prestado para
									que no se le olvide devolvértelo. Podrás cambiar la fecha más
									adelante.
								</Text>
							</Pressable>
						)}
						{estadoAgregarPrestamo.confechaDevolucion && (
							<View>
								<Pressable
									style={styles.contenedorFecha}
									onPress={() => {
										dispatch({
											type: 'selFechaDevolucion',
											selFechaDevolucion: true,
										});
									}}>
									<Text>Fecha de devolución</Text>
									<Text style={styles.fecha}>
										{estadoAgregarPrestamo.fechaDevolucion.toDateString()}
									</Text>
								</Pressable>
								<Pressable
									onPress={() => {
										dispatch({
											type: 'confechaDevolucion',
											confechaDevolucion: false,
										});
									}}>
									<Text style={styles.quitarFechaDevolucion}>
										QUITAR FECHA DEVOLUCÓN
									</Text>
								</Pressable>
								{estadoAgregarPrestamo.selFechaDevolucion && (
									<DateTimePickerModal
										isVisible={estadoAgregarPrestamo.selFechaDevolucion}
										mode="date"
										onConfirm={(fechaD) => {
											dispatch({
												type: 'selFechaDevolucion',
												selFechaDevolucion: false,
											});
											dispatch({
												type: 'fechaDevolucion',
												fechaDevolucion: fechaD,
											});
										}}
										onCancel={() =>
											dispatch({
												type: 'selFechaDevolucion',
												selFechaDevolucion: false,
											})
										}
									/>
								)}
							</View>
						)}
						<View style={styles.filaBotones}>
							<BotonSecundario onPress={() => cerrar()}>
								CANCELAR
							</BotonSecundario>
							<Boton
								onPress={() => {
									if (estadoAgregarPrestamo.deudor.uid === undefined) {
										Alert.alert(
											'Selecciona un usuario',
											'Debes seleccionar el usuario a quien vas a prestar el libro. Si aún no tienes contactos en la aplicación, añádelos desde la pantalla "Mis contactos"',
										);
									} else {
										onAddPress();
										cerrar();
										setTimeout(
											() =>
												Snackbar.show({
													text: 'Se ha enviado una confirmación del préstamo',
													duration: Snackbar.LENGTH_SHORT,
												}),
											300,
										);
									}
								}}>
								<TextoBoton>AÑADIR</TextoBoton>
							</Boton>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	boton: {
		marginVertical: 5,
		marginHorizontal: 10,
	},
	modal: {
		flex: 1,
		alignItems: 'baseline',
		justifyContent: 'flex-end',
		backgroundColor: colores.fondo_modal,
	},
	tarjeta: {
		width: '100%',
		marginTop: 20,
		backgroundColor: 'white',
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		padding: 16,
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
		padding: 5,
	},
	filaBotones: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
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
	centrarFoto: {
		alignSelf: 'center',
	},
	contenedorFecha: {
		alignItems: 'center',
		borderTopWidth: 1,
		borderColor: colores.deshabilitado,
		marginTop: 12,
		paddingTop: 12,
	},
	quitarFechaDevolucion: {
		padding: 8,
		color: colores.importante,
		alignSelf: 'center',
		fontWeight: 'bold',
	},
	tituloFechaDev: {
		fontSize: 14,
		fontWeight: 'bold',
		color: colores.texto_secundario,
		textAlign: 'center',
	},
	descripcionFechaDev: {
		fontSize: 12,
		color: colores.texto_secundario,
		textAlign: 'center',
	},
});
