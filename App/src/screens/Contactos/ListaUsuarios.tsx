import React, {Dispatch, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Pressable} from 'react-native';
import {FlatList} from 'react-native';
import {Foto} from '../../components/Foto';
import {Contacto, EsContacto, Usuario} from '../../types';
import {colores} from '../../styles';
import {marcarContactoPendiente, eliminarContacto} from './Social';
import Snackbar from 'react-native-snackbar';
import {AccionAgregarPrestamo} from '../../components/Prestamo/AgregarPrestamoReducer';

export function ListaUsuarios(props: {
	usuarios: Contacto[];
	usuario: Usuario;
	dispatch?: Dispatch<AccionAgregarPrestamo>;
}) {
	return (
		<SafeAreaView>
			<FlatList
				data={props.usuarios.length !== 0 ? props.usuarios : [{} as Contacto]}
				renderItem={(item) => {
					let renderItem;
					if (props.dispatch !== undefined && props.usuarios.length !== 0) {
						renderItem = (
							<EntradaSeleccionUsuario
								contacto={item.item}
								usuario={props.usuario}
								dispatch={props.dispatch}
							/>
						);
					} else if (props.usuarios.length === 0) {
						renderItem = (
							<Text style={styles.sinUsuarios}>
								No se han encontrado usuarios
							</Text>
						);
					} else {
						renderItem = (
							<EntradaUsuario contacto={item.item} usuario={props.usuario} />
						);
					}
					return renderItem;
				}}
				keyExtractor={(item, index) => index.toString()}
			/>
		</SafeAreaView>
	);
}

function EntradaSeleccionUsuario(props: {
	contacto: Contacto;
	usuario: Usuario;
	dispatch: Dispatch<AccionAgregarPrestamo>;
}) {
	return (
		<View style={styles.contenedor}>
			<Pressable
				style={styles.fila}
				onPress={() => {
					props.dispatch({type: 'deudor', deudor: props.contacto});
					props.dispatch({type: 'selUsuarios', selUsuarios: false});
				}}>
				<Foto usuario={props.contacto} size="small" />
				<Text style={styles.nombreUsuario}>{props.contacto.nombre}</Text>
			</Pressable>
		</View>
	);
}

function EntradaUsuario(props: {contacto: Contacto; usuario: Usuario}) {
	const [esContacto, setEsContacto] = useState(props.contacto.esContacto);
	return (
		<View style={styles.contenedor}>
			<View style={styles.fila}>
				<Foto usuario={props.contacto} size="small" />
				<Text style={styles.nombreUsuario}>{props.contacto.nombre}</Text>
			</View>
			{esContacto === EsContacto.si && (
				<Pressable
					style={styles.botonEliminar}
					onPress={() => {
						eliminarContacto(props.usuario.uid, props.contacto.uid);
						setEsContacto(EsContacto.no);
						Snackbar.show({
							duration: Snackbar.LENGTH_SHORT,
							text: 'Contacto eliminado',
						});
					}}>
					<Text style={styles.textoClaro}>Eliminar</Text>
				</Pressable>
			)}
			{esContacto === EsContacto.no && (
				<Pressable
					style={styles.botonAgregarContacto}
					onPress={() => {
						marcarContactoPendiente(props.usuario.uid, props.contacto);
						setEsContacto(EsContacto.pendiente);
						Snackbar.show({
							duration: Snackbar.LENGTH_SHORT,
							text: 'Solicitud enviada',
						});
					}}>
					<Text style={styles.textoClaro}>Añadir</Text>
				</Pressable>
			)}
			{esContacto === EsContacto.pendiente && (
				<Pressable style={styles.botonPendiente}>
					{/* TODO: OnPress cancelar la petición de amistad*/}
					<Text style={styles.textoOscuro}>Pendiente</Text>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: 'white',
		alignItems: 'center',
		marginVertical: 5,
		marginHorizontal: 10,
		borderRadius: 10,
		padding: 10,
	},
	fila: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	nombreUsuario: {
		marginStart: 10,
	},
	botonPendiente: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderRadius: 10,
		borderWidth: 1.5,
		borderColor: 'black',
		padding: 10,
	},
	botonEliminar: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderRadius: 10,
		borderWidth: 1.5,
		borderColor: colores.texto_claro,
		backgroundColor: colores.importante,
		padding: 10,
	},
	textoClaro: {
		color: colores.texto_claro,
	},
	textoOscuro: {
		color: colores.texto_oscuro,
	},
	botonAgregarContacto: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderRadius: 10,
		borderWidth: 1.5,
		borderColor: colores.texto_claro,
		backgroundColor: colores.acento,
		padding: 10,
	},
	sinUsuarios: {
		fontSize: 16,
		textAlign: 'center',
		margin: 8,
	},
});
