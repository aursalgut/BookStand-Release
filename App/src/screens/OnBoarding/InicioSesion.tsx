/* eslint-disable no-shadow */
import React from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {colores} from '../../styles';
import {
	BotonAncho,
	BotonIcon,
	TextoBoton,
	EncabezadoLogin,
	CampoTexto,
} from '../../components';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Autenticacion} from './../../utils';
/* Pantalla principal */
const InicioSesion = function () {
	const dispatch = useDispatch();
	const [email, setEmail] = React.useState('');
	const [passwd, setPasswd] = React.useState('');

	return (
		<Vista>
			<EncabezadoLogin />
			<CampoTexto
				placeholder="Correo electrónico"
				onChangeText={(email: string) => {
					setEmail(email);
				}}
			/>
			<CampoTexto
				placeholder="Contraseña"
				secureTextEntry={true}
				onChangeText={(passwd: string) => {
					setPasswd(passwd);
				}}
			/>
			<View style={styles.vistaBotones}>
				<BotonAncho
					onPress={() => Autenticacion.inicioSesion(email, passwd, dispatch)}
					disabled={email === '' || passwd === ''}>
					<TextoBoton>Iniciar sesión</TextoBoton>
				</BotonAncho>
				<BotonIcon
					disabled={email === '' || passwd === ''}
					onPress={() => {
						Autenticacion.registroConEmail(email, passwd, dispatch);
					}}>
					<Icon
						name="email"
						size={25}
						color={colores.texto_claro}
						style={styles.icono}
					/>
					<TextoBoton>Registro con correo</TextoBoton>
				</BotonIcon>
				<BotonIcon
					onPress={() => {
						Autenticacion.inicioConGoogle(dispatch);
					}}>
					<Icon
						name="google"
						size={25}
						color={colores.texto_claro}
						style={styles.icono}
					/>
					<TextoBoton>Inicia con Google</TextoBoton>
				</BotonIcon>
			</View>
		</Vista>
	);
};

export default InicioSesion;

/* Estilos y componentes */
const Vista = styled.KeyboardAvoidingView`
	flex: 1;
`;
const styles = StyleSheet.create({
	icono: {
		paddingHorizontal: 15,
	},
	vistaBotones: {
		justifyContent: 'flex-end',
		padding: 10,
	},
});
