import React, {Dispatch} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {BotonSecundario, Boton, TextoBoton} from '../Botones';
import {AccionLibroRedux, obtenerLibros} from '../../redux/librosSlice';
import {agregarLibro} from '../../utils/Biblioteca';
import {Fila, styles} from './LibroEstilo';
import {useSelector} from 'react-redux';
import {selectUsuario} from '../../redux/authSlice';
import {AccionLibro, EstadoLibro} from './LibroReducer';
import {
	PantallaPrincipalNavigationProps,
	PantallasBibliolNavigationProps,
} from '../../navigations';

// Componente que muestra y permite editar la información adicional de un libro
// La información adicional está compuesta por: ubicación, géneros, listas y notas
export function BotonesAccion(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
	dispatchRedux: Dispatch<AccionLibroRedux>;
	navigation:
		| PantallasBibliolNavigationProps
		| PantallaPrincipalNavigationProps;
}) {
	const usuario = useSelector(selectUsuario);
	return (
		<View>
			<View>
				{props.estado.editando && (
					<View>
						<View style={styleLocal.botones}>
							<BotonSecundario
								style={styles.centrado}
								onPress={() => {
									props.dispatch({
										type: 'libro',
										libro: props.estado.backupLibro,
									});
									props.dispatch({type: 'editando', editando: false});
								}}>
								DESCARTAR
							</BotonSecundario>
							<Boton
								onPress={() => {
									const peticionOK = agregarLibro(props.estado.libro, usuario);
									if (props.estado.editando && peticionOK) {
										// Caso en el que estamos editando el libro
										// Actualizamos el estado de los libros de la app
										// para que contemple los nuevos cambios
										props.dispatchRedux(obtenerLibros(usuario));
										// Si la petición se ha realizado correctamente
										// lo notificamos
										Alert.alert(
											'Libro Actualizado',
											'El libro se ha actualizado dcorrectamente',
										);
									} else if (peticionOK) {
										// Caso en el que estamos añadiendo el libro
										// Actualizamos el estado de los libros de la app
										// para que contemple los nuevos cambios
										props.dispatchRedux(obtenerLibros(usuario));
										// Si la petición se ha realizado correctamente
										// lo notificamos
										Alert.alert(
											'Libro Añadido',
											'El libro se ha añadido correctamente',
											[
												{
													text: 'Aceptar',
													onPress: () => {
														props.navigation.goBack();
													},
												},
											],
										);
									} else {
										// Si se ha producido algún error lo notificamos
										Alert.alert('Se ha producido un error');
									}
									// Tras realizar la edición actualizamos el estado a
									// no editando
									props.dispatch({type: 'editando', editando: false});
								}}>
								<TextoBoton>
									{props.estado.editando
										? 'FINALIZAR EDICIÓN'
										: 'FINALIZAR Y AÑADIR'}
								</TextoBoton>
							</Boton>
						</View>
					</View>
				)}
				{!props.estado.enBiblioteca && !props.estado.editando && (
					<Fila style={styles.derecha}>
						{/* Si el libro no está en la biblioteca personal,
                  mostrar un botón para poder añadirlo*/}
						<BotonSecundario
							onPress={() =>
								props.dispatch({type: 'editando', editando: true})
							}>
							EDITAR
						</BotonSecundario>
						<Boton
							onPress={() => {
								const peticionOK = agregarLibro(props.estado.libro, usuario);
								if (peticionOK) {
									// Caso en el que estamos añadiendo el libro
									// Actualizamos el estado de los libros de la app
									// para que contemple los nuevos cambios
									props.dispatchRedux(obtenerLibros(usuario));
									// Si la petición se ha realizado correctamente
									// lo notificamos
									Alert.alert(
										'Libro Añadido',
										'El libro se ha añadido correctamente',
										[
											{
												text: 'Aceptar',
												onPress: () => {
													props.navigation.goBack();
												},
											},
										],
									);
								} else {
									// Si se ha producido algún error lo notificamos
									Alert.alert('Se ha producido un error');
								}
								// Tras realizar la edición actualizamos el estado a
								// no editando
								props.dispatch({type: 'editando', editando: false});
							}}>
							<TextoBoton>AÑADIR</TextoBoton>
						</Boton>
					</Fila>
				)}
			</View>
		</View>
	);
}
const styleLocal = StyleSheet.create({
	botones: {
		flex: 1,
		flexDirection: 'column-reverse',
		alignItems: 'stretch',
	},
});
