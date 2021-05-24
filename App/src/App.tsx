import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store, persistedStore} from './redux';
import {useSelector} from 'react-redux';
import {InicioSesion} from './screens';
import {selectUID} from './redux/authSlice';
import {PersistGate} from 'redux-persist/es/integration/react';
import {PantallasUsuarios} from './navigations';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {
	PushNotificationObject,
} from 'react-native-push-notification';

// Navegador de Stack global para la aplicación
const Stack = createStackNavigator();

/* Componente que exportaremos como nuestra aplicación. Es un Wrapper del
  componente 'real' de nuestra aplicación (AppInside). El motivo por el que
  es necesario el wrapper es para poder inicializar correctamente  el store de
  Redux.*/
export default function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistedStore} loading={null}>
				<AppInside />
			</PersistGate>
		</Provider>
	);
}
/* Componente de nuestra aplicación. Usa el selector de autenticación auth
  que nos permite cambiar entre las pantallas que ven los usuarios
  autenticados y las que no (siendo estas últimas las pantallas de inicio de
  sesión y crear cuentas)*/
function AppInside() {
	// Obtenemos el ID del Usuario que está registrado
	const uid = useSelector(selectUID);

	// useEffect con [] hace que el efecto se produzca solo una vez en el primer
	// renderizado del componente App
	useEffect(() => {
		// Escuchamos la llegada de mensajes de notificaciones
		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			// Obtenemos el contenido de la notificación del mensaje recibido
			const notification = remoteMessage.notification;
			console.log('Se ha recibido un mensaje: ' + notification);

			// Personalizamos cómo se mostrará nuestra notificación
			const pushNotif: PushNotificationObject = {
				message: notification?.body as string,
				title: notification?.title as string,
				largeIcon: '',
			};

			// Mostramos la notificación
			PushNotification.localNotification(pushNotif);
		});

		return unsubscribe;
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator headerMode="none">
				{!uid ? (
					<>
						<Stack.Screen name="InicioSesion" component={InicioSesion} />
					</>
				) : (
					<>
						<Stack.Screen
							name="Pantallas Usuarios"
							component={PantallasUsuarios}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
