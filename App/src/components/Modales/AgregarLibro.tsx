import React, {Dispatch, useEffect} from 'react';
import {
	BotonAncho,
	TextoBoton,
	CampoTexto,
	BotonSecundario,
	Boton,
} from '../../components';
import {StyleSheet, Alert, View, Modal, Text} from 'react-native';
import {obtenerLibro} from '../../utils';
import colores from '../../styles/colores';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DimensionModal} from './../../screens/PantallaPrincipal/PantallaPrincipalReducer';
import {buscarPorTitulo} from '../../utils/openLibrary';
import {useNavigation} from '@react-navigation/core';

export function AgregarNuevoLibro(props: {
	estado: {
		modalAgregarLibro: boolean;
		dimensionModal: DimensionModal;
		tipoFormulario: string;
		isbn: string;
		titulo: string;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dispatch: Dispatch<any>;
}) {
	const navigation = useNavigation();
	useEffect(() => {
		// Para renderizar el modal cuando se produzca un cambio
	}, [props.estado.dimensionModal]);
	return (
		<Modal
			style={styles.modal}
			visible={props.estado.modalAgregarLibro}
			animationType="slide"
			transparent={true}>
			<View style={styles.modalView}>
				<View style={styles.tarjeta}>
					<View style={styles.filaCabeceraModal}>
						<Text>Añadir nuevo libro</Text>
						<Icon
							name="clear"
							size={25}
							color={colores.texto_oscuro}
							onPress={() => {
								props.dispatch({
									type: 'cerrarModalAgregarLibro',
								});
							}}
						/>
					</View>
					{props.estado.dimensionModal === DimensionModal.botones && (
						<View>
							<BotonAncho
								style={styles.centrar}
								onPress={() => {
									props.dispatch({
										type: 'modalAgregarLibro',
										modalAgregarLibro: false,
									});
									navigation.navigate('Camara');
								}}>
								<TextoBoton>ESCANEAR LIBRO</TextoBoton>
							</BotonAncho>
							<BotonSecundario
								style={{}}
								onPress={() => {
									props.dispatch({
										type: 'dimensionModal',
										dimensionModal: DimensionModal.formulario,
										tipo: 'ISBN',
									});
								}}>
								BUSCAR DATOS POR ISBN
							</BotonSecundario>
							<BotonSecundario
								style={{}}
								onPress={() => {
									// Pasamos a la pantalla de añadir los datos del libro con una
									// plantilla del libro
									navigation.navigate('Nuevo Libro', {
										isbn: generarID(),
										titulo: 'Añade un título',
									});
									// Ocultamos el modal
									props.dispatch({
										type: 'modalAgregarLibro',
										modalAgregarLibro: false,
									});
								}}>
								AÑADIR DATOS MANUALMENTE
							</BotonSecundario>
							<BotonSecundario
								style={{}}
								onPress={() => {
									props.dispatch({
										type: 'dimensionModal',
										dimensionModal: DimensionModal.formulario,
										tipo: 'Título',
									});
								}}>
								BUSCAR POR TÍTULO
							</BotonSecundario>
						</View>
					)}
					{props.estado.dimensionModal === DimensionModal.formulario && (
						<View>
							<CampoTexto
								removeClippedSubviews={false}
								placeholder={`${props.estado.tipoFormulario} del libro`}
								onChangeText={(campoTexto: string) => {
									if (props.estado.tipoFormulario === 'ISBN') {
										props.dispatch({type: 'isbn', isbn: campoTexto});
									} else if (props.estado.tipoFormulario === 'Título') {
										props.dispatch({type: 'titulo', titulo: campoTexto});
									}
								}}
							/>
							<Boton>
								<TextoBoton
									onPress={async () => {
										if (
											props.estado.tipoFormulario === 'ISBN' &&
											props.estado.isbn !== ''
										) {
											// Realizamos la llamada a la API
											obtenerLibro(props.estado.isbn, navigation);
											// Ocultamos el modal
											props.dispatch({type: 'cerrarModalAgregarLibro'});
										} else if (
											props.estado.tipoFormulario === 'Título' &&
											props.estado.titulo !== ''
										) {
											buscarPorTitulo(props.estado.titulo)
												.then((libros) => {
													navigation.navigate('Lista Libros', libros);
													props.dispatch({type: 'cerrarModalAgregarLibro'});
												})
												.catch((error) => console.log(error));
										} else {
											Alert.alert(
												`Introduce el ${props.estado.tipoFormulario}`,
											);
										}
									}}>
									BUSCAR LIBRO
								</TextoBoton>
							</Boton>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
}

/**
 * generarID es una función que genera una cadena de 20 caracteres alfanuméricos
 * aleatorios. En el código se usa para agregar automáticamente un identificador
 * único para un libro que se crea de forma manual
 * @returns id
 * @author attacomsian https://attacomsian.com/blog/javascript-generate-random-string
 */
function generarID(): string {
	let id = '';
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	// Pick characers randomly
	for (let i = 0; i < 20; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}
// Estilos para los componentes de la pantalla
const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	filaCabeceraModal: {
		margin: 8,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	centrar: {
		justifyContent: 'center',
	},
	modalView: {
		flexWrap: 'wrap',
		flex: 1,
		alignSelf: 'baseline',
		alignContent: 'center',
		justifyContent: 'flex-end',
		width: '100%',
	},
	abajo: {
		flex: 1,
		paddingBottom: 50,
		justifyContent: 'flex-end',
	},
	barraAccion: {
		width: '100%',
		alignItems: 'center',
	},
	botonCircular: {
		backgroundColor: colores.principal,
		borderRadius: 100,
		margin: 24,
		elevation: 4,
		padding: 4,
		alignSelf: 'flex-end',
	},
	modal: {
		flex: 1,
		alignItems: 'baseline',
		justifyContent: 'flex-end',
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
});
