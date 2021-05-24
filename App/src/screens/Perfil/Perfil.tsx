import React, {useReducer} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';

import {BotonesAccion, Encabezado, NombreUsuario} from '../../components';
import {selectUsuario} from '../../redux/authSlice';
import {Usuario} from '../../types';
import {ModalEditarNombre} from './ComponentesPerfil';
import {estadoInicial, reducer} from './PerfilReducer';

export default function Perfil() {
	// const [fotoPerfil, setFotoPerfil] = useState();
	const usuario: Usuario = useSelector(selectUsuario);
	const [estado, dispatch] = useReducer(reducer, {
		...estadoInicial,
		datosUsuario: usuario,
	});
	const dispatchRedux = useDispatch();

	return (
		<ScrollView style={styles.contenedor}>
			<Encabezado />
			<View style={styles.vistaPantalla}>
				<ModalEditarNombre
					estado={estado}
					dispatch={dispatch}
					dispatchRedux={dispatchRedux}
				/>
				<View>
					{/* Si el usuario tiene una foto definida, mostrarla */}
					{usuario?.foto && (
						<Image
							style={styles.imagenPerfil}
							source={{uri: usuario?.foto?.toString()}}
						/>
					)}
					{!usuario.foto && (
						<Image
							style={styles.imagenPerfil}
							source={require('../../assets/images/avatar.png')}
						/>
					)}
				</View>
				<NombreUsuario usuario={estado.datosUsuario} />
				<Text>{estado.datosUsuario.correo}</Text>
				<BotonesAccion
					estado={estado}
					dispatch={dispatch}
					dispatchRedux={dispatchRedux}
				/>
				<View />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	vistaPantalla: {
		alignItems: 'center',
	},
	imagenPerfil: {
		width: 250,
		height: 250,
		borderRadius: 250,
	},
});
