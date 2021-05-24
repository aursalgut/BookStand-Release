import React, {Dispatch} from 'react';
import {Alert, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colores} from '../../styles';
import {array2Cadena} from '../../utils';
import {Fila, Nota, styles, TextoNota} from './LibroEstilo';
import {EstadoLibro, AccionLibro} from './LibroReducer';

// Componente que muestra y permite editar la información adicional de un libro
// La información adicional está compuesta por: ubicación, géneros, listas y notas
export function InformacionAdicional(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	return (
		<View>
			<Fila>
				<Icon
					name="location-on"
					size={30}
					color={colores.principal}
					style={styles.icono}
				/>
				<Text
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalTVisible', modalTVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'ubicacion'});
						}
					}}>
					{props.estado.libro?.ubicacion
						? props.estado.libro?.ubicacion
						: 'No se ha añadido ubicación'}
				</Text>
			</Fila>
			<Fila>
				<Icon
					name="category"
					size={30}
					color={colores.principal}
					style={styles.icono}
				/>
				<Text
					numberOfLines={2}
					ellipsizeMode="tail"
					style={styles.textoOverflow}
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalLVisible', modalLVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'generos'});
						}
					}}
					onLongPress={() => {
						if (props.estado.libro?.generos) {
							Alert.alert('Géneros', array2Cadena(props.estado.libro?.generos));
						}
					}}>
					{props.estado.libro?.generos
						? array2Cadena(props.estado.libro?.generos)
						: 'No se han añadido géneros'}
				</Text>
			</Fila>
			<Fila>
				<Icon
					name="list"
					size={30}
					color={colores.principal}
					style={styles.icono}
				/>
				<Text
					numberOfLines={2}
					ellipsizeMode="tail"
					style={styles.textoOverflow}
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalLVisible', modalLVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'listas'});
						}
					}}
					onLongPress={() => {
						if (props.estado.libro?.listas) {
							Alert.alert('Listas', array2Cadena(props.estado.libro?.listas));
						}
					}}>
					{props.estado.libro?.listas
						? array2Cadena(props.estado.libro?.listas)
						: 'No se han añadido listas'}
				</Text>
			</Fila>
			<Nota>
				<Text>Notas</Text>
				<TextoNota
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalTVisible', modalTVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'notas'});
						}
					}}>
					{props.estado.libro?.notas
						? props.estado.libro?.notas
						: 'No hay ninguna nota'}
				</TextoNota>
			</Nota>
		</View>
	);
}
