import React, {Dispatch} from 'react';
import {Picker} from '@react-native-community/picker';
import {filtrarLibros} from '../../utils/Biblioteca';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {Boton, TextoBoton, BotonSecundario} from '../Botones';
import {colores} from '../../styles';
import {
	AccionBiblioteca,
	EstadoBiblioteca,
} from '../../screens/Biblioteca/BibliotecaReducer';
import {Libro} from '../../types';

/* Componente para mostrar el pop-up de la búsqueda */
export function ModalAjustesBusqueda(props: {
	estado: EstadoBiblioteca;
	dispatch: Dispatch<AccionBiblioteca>;
	libros: Libro[];
}) {
	return (
		<Modal
			visible={props.estado.modalVisible}
			animationType="fade"
			transparent={true}>
			<View style={styles.modal}>
				<View style={styles.tarjeta}>
					<Text style={styles.tituloModal}>Modificar criterio de búsqueda</Text>
					<Picker
						selectedValue={props.estado.criterio}
						mode="dropdown"
						onValueChange={(itemValue) =>
							props.dispatch({
								type: 'cambiarCriterio',
								criterio: itemValue.toString(),
							})
						}>
						<Picker.Item label="Título" value="titulo" />
						<Picker.Item label="Autor" value="autores" />
						<Picker.Item label="Género" value="generos" />
						<Picker.Item label="Ubicación" value="ubicacion" />
						<Picker.Item label="ISBN" value="isbn" />
					</Picker>
					<Picker
						selectedValue={'Mostrar solo...'}
						mode="dropdown"
						onValueChange={(itemValue) => {
							if (itemValue !== 'ninguno') {
								props.dispatch({
									type: 'filtrar',
									criterioFiltrado: itemValue.toString(),
									librosAMostrar: filtrarLibros(
										itemValue.toString(),
										props.libros,
									),
								});
							}
						}}>
						<Picker.Item label="Filtrar por..." value="ninguno" />
						<Picker.Item label="Mostrar solo favoritos" value="favorito" />
						<Picker.Item label="Mostrar solo leídos" value="leido" />
						<Picker.Item label="Mostrar solo prestados" value="prestado" />
					</Picker>
					<Boton
						onPress={() => {
							props.dispatch({type: 'limpiarDatos'});
						}}>
						<TextoBoton>Limpiar criterios de búsqueda</TextoBoton>
					</Boton>
					<BotonSecundario
						onPress={() => {
							props.dispatch({type: 'cerrarCuadroBusqueda'});
						}}>
						CERRAR
					</BotonSecundario>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	contenedor: {
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
