import {useNavigation} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import {Barcode, RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {PantallaPrincipalNavigationProps} from '../../navigations';
import colores from '../../styles/colores';
import {obtenerLibro} from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {selectTodosLibros} from '../../redux/librosSlice';
import {Libro} from '../../types';

export function Camara() {
	// Para navegar hacia la pantalla de Nuevo Libro
	const navigation = useNavigation<PantallaPrincipalNavigationProps>();
	const libros = useSelector(selectTodosLibros);
	// Función para renderizar todos los códigos de barras que capture
	// la cámara
	function renderBarcodes(barcodes: Barcode[] = []) {
		return (
			<Pressable style={styles.textContainer} pointerEvents="none">
				{barcodes.map(renderBarcode)}
			</Pressable>
		);
	}

	function renderBarcode(props: Barcode) {
		return (
			<Fragment key={props.data}>
				{/* Solo renderizamos los códigos de barras que sean ISBN */}
				{props.type === 'ISBN' && (
					<TouchableOpacity style={[styles.text]}>
						<Text
							style={[styles.textBlock]}>{`${props.data} ${props.type}`}</Text>
					</TouchableOpacity>
				)}
			</Fragment>
		);
	}

	const [{cameraRef, barcodes}, {barcodeRecognized}] = useCamera({
		barcodes: [],
	});

	return (
		<View style={styles.container}>
			<RNCamera
				ref={cameraRef}
				style={styles.camara}
				type="back"
				captureAudio={false}
				androidCameraPermissionOptions={{
					title: 'Permission to use camera',
					message: 'We need your permission to use your camera',
					buttonPositive: 'Ok',
					buttonNegative: 'Cancel',
				}}
				onGoogleVisionBarcodesDetected={barcodeRecognized}>
				{/* BOTÓN PARA HACER FOTO*/}
				<View style={styles.contenedorBoton}>
					<Pressable
						style={styles.botonCaptura}
						onPress={() => {
							// Obtenemos el código del ISBN
							const codigos = barcodes.filter(
								(barcode) => barcode.type === 'ISBN',
							);
							if (codigos.length !== 0) {
								// Primero comprobamos que no tenemos el libro en la biblioteca
								const busqueda = libros.filter((libro: Libro) => {
									return libro.isbn === codigos[0].data;
								});
								if (busqueda.length === 0) {
									/* Si al buscar entre los libros de la biblioteca no hay
									resultado, podemos añadir el libro directamente */
									obtenerLibro(codigos[0].data, navigation);
								} else {
									Alert.alert(
										'Libro en la biblioteca',
										'El libro que intentas añadir ya se encuentra en la biblioteca',
									);
								}
							}
						}}>
						<Icon name="camera" size={30} color={colores.principal} />
					</Pressable>
				</View>
				{/* Cuando está activado el reconocimiento de texto/código de
        barras, lo renderizamos */}
				{renderBarcodes(barcodes.filter((barcode) => barcode.type === 'ISBN'))}
				<View style={styles.vistaCodigo} />
			</RNCamera>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camara: {
		flex: 1,
	},
	contenedorBoton: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		flexWrap: 'wrap',
		alignContent: 'center',
		padding: 15,
	},
	botonCaptura: {
		padding: 20,
		borderRadius: 100,
		backgroundColor: colores.texto_claro,
		justifyContent: 'center',
		borderColor: colores.principal,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 5,
		borderWidth: 5,
	},
	textContainer: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		top: 0,
	},
	text: {
		flex: 1,
		padding: 10,
		marginHorizontal: '20%',
		marginVertical: '80%',
		justifyContent: 'center',
		textAlign: 'center',
		alignContent: 'center',
	},
	textBlock: {
		fontSize: 20,
		color: 'black',
		fontWeight: 'bold',
		textAlign: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		elevation: 1,
	},
	vistaCodigo: {
		position: 'absolute',
		top: '40%',
		left: '15%',
		right: '15%',
		bottom: '40%',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: colores.principal,
		backgroundColor: colores.fondoEscaner,
		borderWidth: 4,
		borderRadius: 12,
	},
});

export default Camara;
