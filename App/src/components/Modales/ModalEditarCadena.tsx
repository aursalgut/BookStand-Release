import React, {Dispatch} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {BotonSecundario, Boton, TextoBoton} from '../Botones';
import CampoTexto from '../CampoTexto';
import {colores} from '../../styles';
import {AccionLibro, EstadoLibro} from '../Libro/LibroReducer';
import {CriterioBusquedaTildes} from '../../types';

// Componente que modela el popup para editar los campos de cadena

export function ModalEditarCadena(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	return (
		<Modal
			visible={props.estado.modalTVisible}
			animationType="fade"
			transparent={true}>
			<View style={styles.modal}>
				<View style={styles.tarjeta}>
					<Text style={styles.tituloModal}>
						Modificar{' '}
						{
							CriterioBusquedaTildes[
								props.estado.campoAEditar as keyof typeof CriterioBusquedaTildes
							]
						}
					</Text>
					<CampoTexto
						placeholder={'Introduce un nuevo valor'}
						onChangeText={(texto) => {
							props.dispatch({type: 'textoEnEdicion', textoEnEdicion: texto});
							console.log(props.estado.textoEnEdicion);
						}}
					/>
					<View style={styles.botones}>
						<BotonSecundario
							onPress={() => {
								props.dispatch({type: 'modalTVisible', modalTVisible: false});
								props.dispatch({type: 'campoAEditar', campoAEditar: ''});
							}}>
							CANCELAR
						</BotonSecundario>
						<Boton
							onPress={() => {
								/* Editamos el campo del libro adecuado realizando una copia profunda
                (copiar un objeto sin arrastrar dependencias) para evitar modificar libro
                sin el uso de useState y romper el patrón */
								const libroActualizado = JSON.parse(
									JSON.stringify(props.estado.libro),
								);
								console.log(libroActualizado);
								// Asociamos el valor del campo de texto al atributo
								libroActualizado[props.estado.campoAEditar] =
									props.estado.textoEnEdicion;
								console.log(libroActualizado);

								// Actualizamos el libro
								props.dispatch({type: 'libro', libro: libroActualizado});

								// Cerramos el modal
								props.dispatch({type: 'modalTVisible', modalTVisible: false});
								props.dispatch({type: 'campoAEditar', campoAEditar: ''});
							}}>
							<TextoBoton>ACEPTAR</TextoBoton>
						</Boton>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(52, 52, 52, 0.5)',
	},
	tarjeta: {
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
	botones: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
});
