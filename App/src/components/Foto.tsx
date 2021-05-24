import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Usuario} from '../types';

export function Foto(props: {usuario: Usuario; size: string}) {
	return (
		<View>
			{/* Si el usuario tiene una foto definida, mostrarla */}
			{props.usuario?.foto && (
				<Image
					style={props.size === 'large' ? styles.large : styles.small}
					source={{uri: props.usuario?.foto?.toString()}}
				/>
			)}
			{/* Si el usuario no tiene una foto definida, no mostrarla*/}
			{!props.usuario.foto && (
				<Image
					style={props.size === 'large' ? styles.large : styles.small}
					source={require('../assets/images/avatar.png')}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	small: {
		width: 40,
		height: 40,
		borderRadius: 250,
	},
	large: {
		width: 250,
		height: 250,
		borderRadius: 250,
	},
});
