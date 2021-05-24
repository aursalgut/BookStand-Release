import React, {Dispatch} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colores} from '../../styles';
import {useNavigation} from '@react-navigation/native';
import {PantallasBibliotecaNavigationProps} from '../../navigations/BibliotecaTab';
import {Alert, StyleSheet} from 'react-native';
import {View} from 'react-native';
import {AccionLibro, EstadoLibro} from './LibroReducer';

// Componente que muestra y permite editar la información básica de un libro
// La información básica está compuesta por: título, autor e ISBN
export function CabeceraLibro(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	const navigation = useNavigation<PantallasBibliotecaNavigationProps>();
	return (
		<View style={styles.fila}>
			<View style={styles.izquierda}>
				<Icon
					name="arrow-back"
					size={35}
					color={colores.texto_oscuro}
					style={styles.icono}
					onPress={() => {
						navigation.goBack();
					}}
				/>
			</View>
			<View style={styles.derecha}>
				<Icon
					name={props.estado.editando ? 'clear' : 'edit'}
					size={25}
					color={colores.texto_oscuro}
					style={styles.icono}
					onPress={() => {
						if (!props.estado.editando) {
							props.dispatch({
								type: 'editando',
								editando: !props.estado.editando,
							});
						} else {
							// Si estábamos editando (icono limpiar -> editar)
							Alert.alert(
								'¿Descartar cambios?',
								'Esta operación no se puede deshacer.',
								[
									{
										text: 'Cancelar',
										style: 'cancel',
									},
									{
										text: 'Sí',
										onPress: () => {
											// Descartamos los cambios del libro
											props.dispatch({
												type: 'libro',
												libro: props.estado.backupLibro,
											});
											// Dejamos de editar
											props.dispatch({
												type: 'editando',
												editando: !props.estado.editando,
											});
										},
									},
								],
								{cancelable: true},
							);
						}
					}}
				/>
				<Icon
					name="more-vert"
					size={25}
					color={colores.texto_oscuro}
					style={styles.icono}
					onPress={() => {
						props.dispatch({
							type: 'menuOpcionesVisible',
							menuOpcionesVisible: !props.estado.menuOpcionesVisible,
						});
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	fila: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 5,
	},
	izquierda: {
		flexDirection: 'row',
	},
	derecha: {
		flexDirection: 'row',
	},
	icono: {
		paddingRight: 15,
	},
});
