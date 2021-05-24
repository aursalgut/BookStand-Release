import React from 'react';
import styled from 'styled-components/native';
import {colores} from '../styles';

const TextoEncabezado = styled.Text`
	color: ${colores.texto_claro};
	font-family: 'OpenSans-SemiBold';
	font-size: 32px;
`;

const VistaEncabezado = styled.View`
	flex: 1;
	justify-content: center;
	background-color: ${colores.principal};
	align-items: center;
	padding: 20px;
	margin-bottom: 10px;
`;
const EncabezadoLogin = function () {
	return (
		<VistaEncabezado>
			<TextoEncabezado>Book Stand</TextoEncabezado>
		</VistaEncabezado>
	);
};

export default EncabezadoLogin;
