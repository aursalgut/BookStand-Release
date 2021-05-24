/* FICHERO QUE CONTIENE EL ESTILO DE TODOS LOS BOTONES  QUE SE
   USARÁN EN LA APLICACIÓN */
import styled from 'styled-components/native';
import {colores} from '../styles';

// Botón básico
// border-radius: 8px;
export const Boton = styled.TouchableOpacity`
	background-color: ${colores.principal};
	padding: 8px;
	align-self: center;
	border-radius: 8px;
	margin-top: 8px;
	margin-bottom: 8px;
	margin-left: 4px;
	margin-right: 4px;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: 16px;
	padding-right: 16px;
	border-color: ${(props) =>
		props.disabled ? colores.deshabilitado : colores.principal};
	border-width: 1.5px;
	border-radius: 8px;
	elevation: 1;
`;

// Botón Ancho
export const BotonAncho = styled.TouchableOpacity`
	background-color: ${(props) =>
		props.disabled ? colores.deshabilitado : colores.principal};
	margin-top: 8px;
	margin-bottom: 8px;
	margin-left: 4px;
	margin-right: 4px;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: 16px;
	padding-right: 16px;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	border-color: ${(props) =>
		props.disabled ? colores.deshabilitado : colores.principal};
	border-width: 1.5px;
	border-radius: 8px;
	elevation: 1;
`;

// Formato que tendrá el texto de los botones
export const TextoBoton = styled.Text`
	color: ${colores.texto_claro};
	font-family: 'Roboto-Medium';
	font-size: 18px;
`;

//  border-radius: 14px;
export const BotonIcon = styled.TouchableOpacity`
	background-color: ${(props) => {
		if (props.style !== undefined) {
			return colores.importante;
		} else if (props.disabled === true) {
			return colores.deshabilitado;
		} else {
			return colores.principal;
		}
	}};
	margin: 8px;
	margin-top: 8px;
	margin-bottom: 8px;
	margin-left: 4px;
	margin-right: 4px;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: 16px;
	padding-right: 16px;
	align-items: center;
	flex-direction: row;
	border-radius: 8px;
	border-color: ${(props) => {
		if (props.style !== undefined) {
			return colores.importante;
		} else if (props.disabled === true) {
			return colores.deshabilitado;
		} else {
			return colores.principal;
		}
	}};
	border-width: 1.5px;
	border-radius: 8px;
	elevation: 1;
`;

// Boton Secundario
//  font-family: 'Roboto-Medium';
export const BotonSecundario = styled.Text`
	color: ${colores.principal};
	background-color: white;
	text-align: center;
	font-family: 'Roboto-Medium';
	margin-top: 8px;
	margin-bottom: 8px;
	margin-left: 4px;
	margin-right: 4px;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: 16px;
	padding-right: 16px;
	font-size: 18px;
	align-self: ${(props) => (props.style ? 'stretch' : 'center')};
	border-color: ${colores.principal};
	border-width: 1.5px;
	border-radius: 8px;
	elevation: 1;
`;
