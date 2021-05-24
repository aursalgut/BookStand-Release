import React, {Dispatch} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {colores} from '../../styles';
import {AccionPrestamo} from '../Prestamo/PrestamoReducer';

export function CabeceraModal(props: {
	titulo: string;
	accionCerrar: AccionPrestamo;
	dispatch: Dispatch<AccionPrestamo>;
}) {
	return (
		<View style={styles.cabecera}>
			<Text style={styles.tituloModal}>{props.titulo}</Text>
			<Icon
				name="close"
				size={25}
				color={colores.principal}
				style={styles.iconoCerrar}
				onPress={() => {
					props.dispatch(props.accionCerrar);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	tituloModal: {
		fontSize: 16,
	},
	cabecera: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	iconoCerrar: {
		alignSelf: 'flex-end',
	},
});
