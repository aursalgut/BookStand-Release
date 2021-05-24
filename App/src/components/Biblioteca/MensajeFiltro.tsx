import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {EstadoBiblioteca} from '../../screens/Biblioteca/BibliotecaReducer';

export function MensajeFiltro(props: {estado: EstadoBiblioteca}) {
	const [mostrar, setMostrar] = useState(false);
	useEffect(() => {
		if (props.estado.criterioFiltrado === 'ninguno') {
			setMostrar(false);
		} else {
			setMostrar(true);
		}
	}, [props.estado.criterioFiltrado]);
	return (
		<View style={styles.centrado}>
			{mostrar && (
				<Text>{`Filtrado por ${props.estado.criterioFiltrado}`}</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	centrado: {
		alignItems: 'center',
	},
});
