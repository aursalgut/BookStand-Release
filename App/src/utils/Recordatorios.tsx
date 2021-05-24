import PushNotification from 'react-native-push-notification';

/**
 * Clase que maneja el control de los recordatorios y notificaciones establecidos
 * mediante la librería 'react-native-push-notification'
 */
export class Recordatorios {
	/**
	 * Función que sirve para generar una notificación push
	 * @param titulo título de la notificación
	 * @param cuerpo cuerpo de la notificación
	 */
	static lanzarRecordatorio(titulo: string, cuerpo: string): void {
		PushNotification.localNotification({
			title: titulo,
			message: cuerpo,
			channelId: 'notif',
			largeIcon: '',
		});
		console.log('Notificación lanzada');
	}
}
