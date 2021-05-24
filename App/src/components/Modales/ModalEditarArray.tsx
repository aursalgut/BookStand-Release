import React, {Dispatch} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, FlatList, Modal, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import {BotonSecundario} from '../Botones';
import CampoTexto from '../CampoTexto';
import {colores} from '../../styles';
import {EstadoLibro, AccionLibro} from '../Libro/LibroReducer';
import {CriterioBusquedaTildes, Libro} from '../../types';

// Componente que modela el pop up para editar los campos de array

export function ModalEditarArray(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	return (
		<Modal
			visible={props.estado.modalLVisible}
			animationType="slide"
			transparent={true}>
			<SafeAreaView style={styles.modal}>
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
						}}
					/>
					<BotonSecundario
						onPress={() => {
							// Hacemos una copia profunda del objeto
							const libroActualizado = JSON.parse(
								JSON.stringify(props.estado.libro),
							);
							// Añadimos el elemento a la lista
							if (!libroActualizado[props.estado.campoAEditar]) {
								libroActualizado[props.estado.campoAEditar] = [];
								libroActualizado[props.estado.campoAEditar].push(
									props.estado.textoEnEdicion,
								);
							} else {
								libroActualizado[props.estado.campoAEditar].push(
									props.estado.textoEnEdicion,
								);
							}
							// Actualizamos el libro
							props.dispatch({type: 'libro', libro: libroActualizado});
						}}>
						+ Añadir elemento
					</BotonSecundario>
					<FlatList
						data={
							props.estado.libro[
								props.estado.campoAEditar as keyof Libro
							] as string[]
						}
						renderItem={(item) => (
							<Fila>
								<Text>{item.item}</Text>
								<View style={styles.botonesLista}>
									<Icon
										name="clear"
										size={30}
										color={colores.deshabilitado}
										style={styles.icono}
										onPress={() => {
											// Hacemos una copia profunda del objeto
											const libroActualizado = JSON.parse(
												JSON.stringify(props.estado.libro),
											);
											// Eliminamos el elemento de la lista
											libroActualizado[props.estado.campoAEditar].splice(
												libroActualizado[props.estado.campoAEditar].indexOf(
													item.item,
												),
												1,
											);
											// Actualizamos el libro
											props.dispatch({
												type: 'libro',
												libro: libroActualizado,
											});
										}}
									/>
								</View>
							</Fila>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
					<View style={styles.botones}>
						<BotonSecundario
							onPress={() => {
								props.dispatch({type: 'modalLVisible', modalLVisible: false});
								props.dispatch({type: 'campoAEditar', campoAEditar: ''});
							}}>
							CERRAR
						</BotonSecundario>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

const Fila = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 5px;
`;

const styles = StyleSheet.create({
	icono: {
		paddingRight: 15,
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(52, 52, 52, 0.5)',
	},
	tarjeta: {
		flex: 1,
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
	botones: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	botonesLista: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignSelf: 'flex-end',
		flex: 1,
	},
});
