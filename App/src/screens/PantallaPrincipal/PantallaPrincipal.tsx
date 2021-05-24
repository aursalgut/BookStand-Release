import React, {Dispatch, useEffect, useReducer} from 'react';
import {Encabezado} from '../../components';
import {PantallaPrincipalNavigationProps} from '../../navigations';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View, Pressable} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {login, selectUsuario} from '../../redux/authSlice';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {FeedNotificaciones} from './FeedNotificaciones';
import colores from '../../styles/colores';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
	AccionPrincipal,
	estadoInicial,
	EstadoPrincipal,
	reducer,
} from './PantallaPrincipalReducer';
import {obtenerNotificaciones} from '../../utils/Notificaciones';
import {comprobarPrestamos} from '../../utils/Prestamo';
import BackgroundTimer from 'react-native-background-timer';
import {selectTodosLibros} from '../../redux/librosSlice';
import {AgregarNuevoLibro} from '../../components/Modales/AgregarLibro';
import PushNotification from 'react-native-push-notification';

// Pantalla principal de la aplicación
export default function PantallaInicio() {
	const usuario = useSelector(selectUsuario);
	const libros = useSelector(selectTodosLibros);
	const [estado, dispatch] = useReducer(reducer, {
		...estadoInicial,
		navigation: useNavigation<PantallaPrincipalNavigationProps>(),
		dispatchRedux: useDispatch(),
		usuario: usuario,
	});

	useEffect(() => {
		console.log('Comprobación de los recordatorios ' + new Date().toString());
		PushNotification.getDeliveredNotifications((resultado) => {
			if (resultado.length === 0) {
				console.log('Calculamos los préstamos');
				comprobarPrestamos(libros, usuario);
			} else {
				console.log(
					'Como las notificaciones siguen sin descartarse, no se recalculan los préstamos',
				);
			}
		});
	}, []);

	BackgroundTimer.stopBackgroundTimer();
	// useEffect con [] hace que el efecto se produzca solo una vez en el primer
	// renderizado del componente App
	useEffect(() => {
		// Escuchamos la llegada de mensajes de notificaciones
		const unsubscribe = messaging().onMessage(async () => {
			// Cuando recibimos un mensaje FCM, actualizamos las notificaciones
			setTimeout(
				() => obtenerNotificaciones(estado.usuario.uid, dispatch),
				1500,
			);
		});

		return unsubscribe;
	});

	// Cargamos el token del FCM para enviar las notificaciones al dispositivo
	useEffect(() => {
		// Para iOS, necesitamos registrar primero el dispositivo
		messaging().registerDeviceForRemoteMessages();
		// Obtenemos el token del mensaje
		messaging()
			.getToken()
			.then((token) => {
				if (estado.usuario.token !== token) {
					// Actualizamos la base de datos del usuario
					firestore()
						.collection('usuarios')
						.doc(estado.usuario.uid)
						.update({token: token});
					// Actualizamos el estado de la aplicación
					estado.dispatchRedux(login({...estado.usuario, token: token}));
					console.log('Token FCM: ' + token);
				}
			});
	}, []);

	// Efecto para recargar las notificaciones
	useEffect(() => {
		let montado = true;
		if (montado) {
			obtenerNotificaciones(estado.usuario.uid, dispatch);
		}
		// Devolvemos la función de cleanup
		return () => {
			montado = false;
		};
	}, []);

	return (
		<View style={styles.contenedor}>
			<Encabezado />
			<FeedNotificaciones estado={estado} dispatch={dispatch} />
			<AgregarNuevoLibro estado={estado} dispatch={dispatch} />
			<BarraAccion estado={estado} dispatch={dispatch} />
		</View>
	);
}

function BarraAccion(props: {
	estado: EstadoPrincipal;
	dispatch: Dispatch<AccionPrincipal>;
}) {
	return (
		<View style={styles.barraAccion}>
			<Pressable
				onPress={() => {
					props.dispatch({type: 'modalAgregarLibro', modalAgregarLibro: true});
				}}
				style={styles.botonCircular}>
				<Icon name="add" color={colores.texto_claro} size={45} />
			</Pressable>
		</View>
	);
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
		backgroundColor: colores.fondo_modal,
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
