import React, {Dispatch, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Action} from '@reduxjs/toolkit';

import {
	Boton,
	BotonIcon,
	BotonSecundario,
	TextoBoton,
} from '../../components/Botones';
import CampoTexto from '../../components/CampoTexto';
import {logout} from '../../redux/authSlice';
import colores from '../../styles/colores';
import {Usuario} from '../../types';
import {Autenticacion} from '../../utils';
import * as Usuarios from '../../utils/Usuarios';
import {AccionPerfil, EstadoPerfil} from './PerfilReducer';

// Componente que representa en pantalla el nombre del usuario
export function NombreUsuario(props: {usuario: Usuario}) {
	return (
		<View>
			{props.usuario.nombre && (
				<Text style={styles.nombreUsuario}>{props.usuario.nombre}</Text>
			)}
		</View>
	);
}

/*  Componente que renderiza las acciones que puede realizar un usuario en forma
    de botones. Dichas acciones son: 
      - Cambiar nombre de usuario
      - Cerrar sesión */
export function BotonesAccion(props: {
	estado: EstadoPerfil;
	dispatchRedux: Dispatch<Action>;
	dispatch: Dispatch<AccionPerfil>;
}) {
	return (
		<View>
			<BotonIcon
				onPress={() => {
					// Cambiar nombre de usuario
					props.dispatch({
						type: 'editarNombreVisible',
						editarNombreVisible: true,
					});
					// Usuarios.actualizarDatosUsuario(props.estado.datosUsuario);
				}}>
				<Icon
					name="edit"
					size={20}
					style={styles.icono}
					color={colores.texto_claro}
				/>
				<TextoBoton>
					{props.estado.datosUsuario.nombre ? 'Cambia ' : 'Establece '}tu nombre
					de usuario
				</TextoBoton>
			</BotonIcon>
			<BotonIcon
				onPress={() => {
					// Eliminamos el Token para que no se puedan enviar mensajes cuando
					// el usuario tiene la sesión cerrada
					Autenticacion.cerrarSesion(
						props.dispatchRedux,
						props.estado.datosUsuario.uid,
					);
				}}>
				<Icon
					name="logout"
					size={20}
					style={styles.icono}
					color={colores.texto_claro}
				/>
				<TextoBoton>Cerrar Sesión</TextoBoton>
			</BotonIcon>
			<BotonIcon
				onPress={() => {
					ImagePicker.launchImageLibrary(
						{
							mediaType: 'photo',
							includeBase64: false,
							maxHeight: 500,
							maxWidth: 500,
						},
						(response) => {
							if (!response.didCancel) {
								// Si no se ha cancelado la selección de la imagen, la subimos
								Usuarios.subirFotoPerfil(
									props.estado.datosUsuario,
									response,
									props.dispatchRedux,
								);
							} else {
								console.log('Se ha cancelado');
							}
						},
					);
				}}>
				<Icon
					name="image"
					size={20}
					style={styles.icono}
					color={colores.texto_claro}
				/>
				<TextoBoton>Cambiar foto de perfil</TextoBoton>
			</BotonIcon>
			<BotonIcon
				style={{
					backgroundColor: colores.importante,
					borderColor: colores.importante,
				}}
				onPress={() =>
					Alert.alert(
						'Vas a eliminar tu cuenta',
						'Se eliminarán todos tus datos de la aplicación. Esta operación no se puede deshacer.',
						[
							{
								text: 'Cancelar',
								style: 'cancel',
							},
							{
								text: 'Sí, eliminar',
								onPress: () => {
									Autenticacion.eliminarCuenta(props.estado.datosUsuario.uid);
									props.dispatchRedux(logout());
								},
							},
						],
						{cancelable: true},
					)
				}>
				<Icon
					name="delete"
					size={20}
					style={styles.icono}
					color={colores.texto_claro}
				/>
				<TextoBoton>ELIMINAR CUENTA</TextoBoton>
			</BotonIcon>
		</View>
	);
}

export function ModalEditarNombre(props: {
	estado: EstadoPerfil;
	dispatch: Dispatch<AccionPerfil>;
	dispatchRedux: Dispatch<Action>;
}) {
	const [nombreUsuario, setNombre] = useState('');
	return (
		<Modal
			visible={props.estado.editarNombreVisible}
			animationType="slide"
			transparent={true}
			style={styles.contenedor}>
			<View style={styles.tarjeta}>
				<Text style={styles.tituloModal}>Modificar nombre de usuario</Text>
				<Text style={styles.descripcionModal}>
					Este nombre será público para todos los usuarios de la aplicación
				</Text>
				<CampoTexto
					style={styles.campoTexto}
					placeholder={'Nombre de usuario'}
					onChangeText={(texto) => {
						setNombre(texto);
						// Cambiar nombre
					}}
				/>
				<View style={styles.fila}>
					<BotonSecundario
						onPress={() => {
							props.dispatch({
								type: 'editarNombreVisible',
								editarNombreVisible: false,
							});
						}}>
						DESCARTAR
					</BotonSecundario>
					<Boton
						onPress={() => {
							// Añadimos nuestro nombre al estado de la pantalla
							props.dispatch({
								type: 'actualizarDatosUsuario',
								datosUsuario: {
									...props.estado.datosUsuario,
									nombre: nombreUsuario,
								},
							});
							// Actualizamos el nombre en el servidor
							Usuarios.actualizarDatosUsuario(
								{...props.estado.datosUsuario, nombre: nombreUsuario},
								props.dispatchRedux,
							);
							// Cerramos el POP-UP
							props.dispatch({
								type: 'editarNombreVisible',
								editarNombreVisible: false,
							});
						}}>
						<TextoBoton>ACEPTAR</TextoBoton>
					</Boton>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	imagen: {
		width: 250,
		height: 250,
		borderRadius: 250,
	},
	campoTexto: {
		alignSelf: 'stretch',
	},
	contenedor: {
		flex: 1,
	},
	vistaPantalla: {
		alignItems: 'center',
	},
	nombreUsuario: {
		fontSize: 20,
	},
	tituloModal: {
		fontSize: 18,
		color: colores.principal_oscuro,
	},
	fila: {
		flexDirection: 'row',
	},
	descripcionModal: {
		fontSize: 12,
		alignSelf: 'center',
		textAlign: 'center',
	},
	tarjeta: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginVertical: 20,
		marginHorizontal: 20,
		backgroundColor: 'white',
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		borderBottomEndRadius: 20,
		borderBottomStartRadius: 20,
		justifyContent: 'flex-end',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 5,
	},
	icono: {
		paddingRight: 15,
	},
});
