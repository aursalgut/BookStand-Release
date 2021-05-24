import React, {Dispatch, useState} from 'react';
import {Alert, Image, View} from 'react-native';
import {array2Cadena} from '../../utils';
import {Fila, styles, Titulo, Autor, Isbn} from './LibroEstilo';
import {AccionLibro, EstadoLibro} from './LibroReducer';

// Componente que muestra y permite editar la información básica de un libro
// La información básica está compuesta por: título, autor e ISBN
export function InformacionBasica(props: {
	estado: EstadoLibro;
	dispatch: Dispatch<AccionLibro>;
}) {
	const [errorImagen, setErrorImagen] = useState(false);
	return (
		<Fila style={{alignItems: 'flex-start'}}>
			<Image
				source={errorImagen ? require('../../assets/images/libro_icon.png') : {
					uri: `http://covers.openlibrary.org/b/isbn/${props.estado.libro.isbn}-M.jpg?default=false`,
				}}
				style={styles.imagenLibro}
				onError={() => {
					console.log('Error al cargar la foto');
					setErrorImagen(true);
				}}
			/>
			<View style={styles.textoOverflow}>
				<Titulo
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalTVisible', modalTVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'titulo'});
						}
					}}>
					{props.estado.libro?.titulo
						? props.estado.libro?.titulo
						: 'Sin título'}
				</Titulo>
				<Autor
					numberOfLines={2}
					ellipsizeMode="tail"
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalLVisible', modalLVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'autores'});
						}
					}}
					onLongPress={() => {
						if (props.estado.libro?.autores) {
							Alert.alert('Autores', array2Cadena(props.estado.libro?.autores));
						}
					}}>
					{props.estado.libro?.autores
						? array2Cadena(props.estado.libro?.autores)
						: 'No hay autores'}
				</Autor>
				<Isbn
					selectable={props.estado.libro.isbn === '' ? true : false}
					onPress={() => {
						if (props.estado.editando) {
							// Actualizamos nuestro estado para permitir que se mueste el modal
							props.dispatch({type: 'modalTVisible', modalTVisible: true});
							props.dispatch({type: 'campoAEditar', campoAEditar: 'isbn'});
						}
					}}>
					ISBN {props.estado.libro?.isbn}
				</Isbn>
			</View>
		</Fila>
	);
}
