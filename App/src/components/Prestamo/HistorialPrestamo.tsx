import React, {Dispatch, useEffect, useState} from 'react';
import {View, Text, Modal, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colores} from '../../styles';
import {obtenerHistorialPrestamos} from '../../utils/Prestamo';
import {Prestamo} from './Prestamo';
import {Prestamo as TipoPrestamo} from '../../types';
import {useSelector} from 'react-redux';
import {selectUsuario} from '../../redux/authSlice';
import {AccionLibro, EstadoLibro} from '../Libro/LibroReducer';

export function HistorialPrestamo(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	const [historialPrestamo, setHistorial] = useState<TipoPrestamo[]>([]); // Los préstamos que hay
	const usuario = useSelector(selectUsuario);
	useEffect(() => {
		/* La variable montado, sirve para evitar actualizar el estado si los
      componentes aún no se han montado */
		let montado = true;
		obtenerHistorialPrestamos(usuario, props.estado.libro).then(
			(respuesta: TipoPrestamo[]) => {
				if (montado) {
					// Cambiamos el estado cuando el componente está montado
					setHistorial(respuesta);
				}
			},
		);

		/* Devolvemos la función de cleanup en la que se cancela la subscripción
      a la tarea asíncrona para actualizar el estado (montado = false)*/
		return () => {
			montado = false;
		};
	});

	// Variable que renderizará el contenido a mostrar en la pantalla
	let contenido;

	if (!historialPrestamo) {
		// Si estamos cargando los préstamos se mostrará un mensaje de carga
		contenido = (
			<View style={styles.centrada}>
				<Text>Cargando...</Text>
			</View>
		);
	} else if (historialPrestamo.length === 0) {
		// Si nos encontramos con una lista vacía, mostar en pantalla
		contenido = (
			<View style={styles.centrada}>
				<Text>Lista vacía</Text>
			</View>
		);
	} else {
		// Cuando los préstamos estén cargados, mostraremos una lista
		/* Necesitamos keyExtractor para que la lista se cargue de
    forma más eficiente. Los datos que renderizaremos dependerán
    de si tenemos alguna cadena de búsqueda*/
		contenido = (
			<FlatList
				data={historialPrestamo}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({item}) => <Prestamo prestamo={item} />}
			/>
		);
	}

	return (
		<Modal
			visible={props.estado.modalHistorialPrestamo}
			animationType="slide"
			transparent={true}>
			<View style={styles.tarjeta}>
				<View style={styles.fila}>
					<Text>Historial de Préstamos</Text>
					<Icon
						name="close"
						size={25}
						color={colores.principal}
						style={styles.iconoCerrar}
						onPress={() => {
							props.dispatch({
								type: 'modalHistorialPrestamo',
								modalHistorialPrestamo: false,
							});
							props.dispatch({
								type: 'menuOpcionesVisible',
								menuOpcionesVisible: false,
							});
						}}
					/>
				</View>
				<View>{contenido}</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centrada: {
		margin: 20,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	fila: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	tarjeta: {
		flex: 1,
		width: '100%',
		marginTop: 5,
		backgroundColor: 'white',
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 5,
	},
	iconoCerrar: {
		alignSelf: 'flex-end',
	},
});
