import React, {Dispatch, useEffect, useState} from 'react';
import {
	FlatList,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import Inbox from '../../assets/images/inbox.svg';
import {PantallaPrincipalNavigationProps} from '../../navigations';
import {selectTodosLibros} from '../../redux/librosSlice';
import colores from '../../styles/colores';
import {
	Contacto,
	Libro,
	Notificacion as NotificacionType,
	Prestamo,
	TipoNotificacion,
} from '../../types';
import {
	marcarNotificacionLeida,
	obtenerNotificaciones,
} from '../../utils/Notificaciones';
import {
	aceptarActualizacionPrestamo,
	aceptarPrestamo,
	rechazarActualizacionPrestamo,
	rechazarPrestamo,
} from '../../utils/Prestamo';
import {aceptarContacto} from '../Contactos/Social';
import {AccionPrincipal, EstadoPrincipal} from './PantallaPrincipalReducer';
import { firebase } from '@react-native-firebase/firestore';

export function FeedNotificaciones(props: {
	estado: EstadoPrincipal;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	const sinNotificaciones: NotificacionType[] = [
		{
			titulo: 'No hay notificaciones',
			fecha: firebase.firestore.Timestamp.now(),
		},
	];
	useEffect(() => {
		// Refrescamos el componente
	}, [props.estado.notificaciones]);

	return (
		<View style={styles.contenedor}>
			<FlatList
				data={
					props.estado.notificaciones.length !== 0
						? props.estado.notificaciones
						: sinNotificaciones
				}
				keyExtractor={(item, index) => index.toString()}
				refreshControl={
					<RefreshControl
						refreshing={props.estado.refrescando}
						onRefresh={() => {
							// Controlamos la animación para refrescar los datos de la API
							// Activamos la animación
							props.dispatch({type: 'refrescando', refrescando: true});
							// Recargamos los datos
							obtenerNotificaciones(props.estado.usuario.uid, props.dispatch);
							// Tras 2s, deshabilitamos la animación
							setTimeout(
								() => props.dispatch({type: 'refrescando', refrescando: false}),
								1500,
							);
						}}
					/>
				}
				renderItem={({item}) =>
					props.estado.notificaciones.length !== 0 ? (
						<Notificacion
							datos={item}
							uid={props.estado.usuario.uid}
							dispatch={props.dispatch}
						/>
					) : (
						<View style={styles.contenedorFeedVacio}>
							<Inbox width={225} height={225} />
							<Text style={styles.textoFeedVacio}>
								{sinNotificaciones[0].titulo}
							</Text>
						</View>
					)
				}
			/>
		</View>
	);
}

function Notificacion(props: {
	datos: NotificacionType;
	uid: string;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	return (
		<View style={styles.tarjeta}>
			<View style={styles.columna}>
				<View>
					<Text style={styles.tituloFeed}>{props.datos.titulo}</Text>
					<Text>{props.datos.cuerpo}</Text>
				</View>
				{props.datos.tipo === TipoNotificacion.info && (
					<AccionesInfo
						datos={props.datos}
						uid={props.uid}
						dispatch={props.dispatch}
					/>
				)}
				{props.datos.tipo === TipoNotificacion.solicitudAmistad && (
					<AccionesSolicitud
						datos={props.datos}
						uid={props.uid}
						dispatch={props.dispatch}
					/>
				)}
				{props.datos.tipo === TipoNotificacion.confirmacionPrestamo && (
					<AccionesConfirmarPrestamo
						datos={props.datos}
						uid={props.uid}
						dispatch={props.dispatch}
					/>
				)}
				{props.datos.tipo === TipoNotificacion.actualizacionPrestamo && (
					<AccionesActualizarPrestamo
						datos={props.datos}
						uid={props.uid}
						dispatch={props.dispatch}
					/>
				)}
				{props.datos.tipo === TipoNotificacion.devolucionLibro && (
					<AccionesDevolucion
						datos={props.datos}
						uid={props.uid}
						dispatch={props.dispatch}
					/>
				)}
			</View>
		</View>
	);
}

function AccionesSolicitud(props: {
	datos: NotificacionType;
	uid: string;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	return (
		<View style={styles.filaBotones}>
			<Pressable
				style={styles.botonSecundario}
				onPress={() => {
					// Marcamos la notificación como leída
					marcarNotificacionLeida(props.uid, props.datos);

					// Y actualizamos las notificaciones
					obtenerNotificaciones(props.uid, props.dispatch);
				}}>
				<Text style={styles.textoBotonSecundario}>ELIMINAR</Text>
			</Pressable>
			<Pressable
				style={styles.botonPrincipal}
				onPress={() => {
					// Aceptamos la petición de amistad
					aceptarContacto(props.uid, props.datos.origen as Contacto);
					// Marcamos la notificación como leída
					marcarNotificacionLeida(props.uid, props.datos);
					// Y actualizamos las notificaciones
					obtenerNotificaciones(props.uid, props.dispatch);
				}}>
				<Text style={styles.textoClaro}>ACEPTAR</Text>
			</Pressable>
		</View>
	);
}

function AccionesConfirmarPrestamo(props: {
	datos: NotificacionType;
	uid: string;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	return (
		<View style={styles.filaBotones}>
			<Pressable
				style={styles.botonSecundario}
				onPress={() => {
					// Denegamos el préstamo
					rechazarPrestamo(props.uid, props.datos.prestamo as Prestamo);
					// Marcamos la notificación como leída
					marcarNotificacionLeida(props.uid, props.datos);

					// Y actualizamos las notificaciones
					obtenerNotificaciones(props.uid, props.dispatch);
				}}>
				<Text style={styles.textoBotonSecundario}>ELIMINAR</Text>
			</Pressable>
			<Pressable
				style={styles.botonPrincipal}
				onPress={() => {
					// Aceptamos el préstamo
					aceptarPrestamo(props.uid, props.datos.prestamo as Prestamo);
					// Marcamos la notificación como leída
					marcarNotificacionLeida(props.uid, props.datos);
					// Y actualizamos las notificaciones
					obtenerNotificaciones(props.uid, props.dispatch);
				}}>
				<Text style={styles.textoClaro}>CONFIRMAR</Text>
			</Pressable>
		</View>
	);
}

function AccionesInfo(props: {
	datos: NotificacionType;
	uid: string;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	return (
		<View style={styles.contenedorAcciones}>
			<Pressable
				style={styles.botonPrincipal}
				onPress={() => {
					// Marcamos la notificación como leída
					marcarNotificacionLeida(props.uid, props.datos);

					// Y actualizamos las notificaciones
					obtenerNotificaciones(props.uid, props.dispatch);
				}}>
				<Icon name="done" size={20} color={colores.texto_claro} />
			</Pressable>
		</View>
	);
}

function AccionesActualizarPrestamo(props: {
	datos: NotificacionType;
	uid: string;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	const [mostrarDetalles, setMostrarDetalles] = useState(false);
	return (
		<>
			<Pressable
				onPress={() => {
					setMostrarDetalles(!mostrarDetalles);
				}}>
				{!props.datos.prestamo?.devuelto && (
					<>
						<Text style={styles.textoDetalles}>
							{mostrarDetalles ? 'Ocultar detalles' : 'Mostrar detalles'}
						</Text>

						{mostrarDetalles && (
							<View style={styles.contenedorDetalles}>
								<Text>{props.datos.prestamo?.detalles}</Text>
								{props.datos.prestamo?.fechaDevolucion &&
									!props.datos.prestamo?.devuelto && (
									<Text>
											Fecha de devolución estimada:{' '}
										{props.datos.prestamo?.fechaDevolucion
											.toDate()
											.toLocaleDateString()}
									</Text>
								)}
							</View>
						)}
					</>
				)}
			</Pressable>

			<View style={styles.filaBotones}>
				<Pressable
					style={styles.botonSecundario}
					onPress={() => {
						rechazarActualizacionPrestamo(
							props.uid,
							props.datos.prestamo as Prestamo,
						);
						// Marcamos la notificación como leída
						marcarNotificacionLeida(props.uid, props.datos);

						// Y actualizamos las notificaciones
						obtenerNotificaciones(props.uid, props.dispatch);
					}}>
					<Text style={styles.textoBotonSecundario}>RECHAZAR</Text>
				</Pressable>
				<Pressable
					style={styles.botonPrincipal}
					onPress={() => {
						// Aceptamos el préstamo
						aceptarActualizacionPrestamo(
							props.uid,
							props.datos.prestamo as Prestamo,
						);
						// Marcamos la notificación como leída
						marcarNotificacionLeida(props.uid, props.datos);
						// Y actualizamos las notificaciones
						obtenerNotificaciones(props.uid, props.dispatch);
					}}>
					<Text style={styles.textoClaro}>ACEPTAR</Text>
				</Pressable>
			</View>
		</>
	);
}

function AccionesDevolucion(props: {
	datos: NotificacionType;
	uid: string;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	const navigation = useNavigation<PantallaPrincipalNavigationProps>();
	const libros = useSelector(selectTodosLibros);
	const [libro, setLibro] = useState({} as Libro);
	useEffect(() => {
		libros.forEach((lib: Libro) => {
			if (lib.isbn === props.datos.prestamo?.isbn) {
				setLibro(lib);
			}
		});
	}, []);

	return (
		<View style={styles.filaBotones}>
			<Pressable
				style={styles.botonSecundario}
				onPress={() => {
					// Marcamos la notificación como leída
					marcarNotificacionLeida(props.uid, props.datos);

					// Y actualizamos las notificaciones
					obtenerNotificaciones(props.uid, props.dispatch);
				}}>
				<Text style={styles.textoBotonSecundario}>LEÍDO</Text>
			</Pressable>
			<Pressable
				style={styles.botonPrincipal}
				onPress={() =>
					navigation.navigate('Biblioteca', {
						screen: 'Todos',
						params: {
							screen: 'Detalles libro',
							params: {...libro},
						},
					})
				}>
				<Text style={styles.textoClaro}>VER LIBRO</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
		margin: 16,
	},
	fila: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	filaBotones: {
		marginVertical: 4,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	columna: {},
	tarjeta: {
		flex: 1,
		flexShrink: 0,
		backgroundColor: 'white',
		borderRadius: 8,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginVertical: 4,
		marginHorizontal: 4,
		elevation: 1,
	},
	tituloFeed: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	textoClaro: {
		color: colores.texto_claro,
	},
	textoDetalles: {
		paddingTop: 4,
		fontStyle: 'italic',
	},
	botonPrincipal: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderRadius: 10,
		borderWidth: 1.5,
		borderColor: colores.texto_claro,
		backgroundColor: colores.principal,
		padding: 10,
	},
	textoFeedVacio: {
		color: colores.texto_secundario,
	},
	contenedorFeedVacio: {
		alignItems: 'center',
	},
	botonSecundario: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: 12,
	},
	textoBotonSecundario: {
		color: colores.principal,
		fontWeight: 'bold',
	},
	contenedorAcciones: {
		alignSelf: 'flex-end',
	},
	contenedorDetalles: {
		borderTopWidth: 1,
		marginTop: 8,
		paddingTop: 4,
	},
});
