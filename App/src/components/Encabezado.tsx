import React from 'react';
import styled from 'styled-components/native';
import {colores} from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {PantallaPrincipalNavigationProps} from '../navigations';
import {selectUsuario} from '../redux/authSlice';
import {useSelector} from 'react-redux';
import {Foto} from './Foto';

const VistaEncabezado = styled.View`
	flex-direction: row;
	background-color: ${colores.fondo};
	align-items: center;
	justify-content: space-evenly;
`;

export const TextoEncabezado = styled.Text`
	color: ${colores.principal};
	padding: 20px;
	font-family: 'OpenSans-SemiBold';
	font-size: 32px;
`;

const Encabezado = function () {
	const navigation = useNavigation<PantallaPrincipalNavigationProps>();
	const usuario = useSelector(selectUsuario);
	return (
		<VistaEncabezado>
			<TouchableOpacity>
				<Icon
					name="menu"
					size={40}
					color="black"
					onPress={() => navigation.openDrawer()}
				/>
			</TouchableOpacity>
			<TextoEncabezado>BookStand</TextoEncabezado>
			<TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
				<Foto usuario={usuario} size={'small'} />
			</TouchableOpacity>
		</VistaEncabezado>
	);
};

export default Encabezado;
