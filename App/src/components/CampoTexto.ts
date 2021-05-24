import styled from 'styled-components/native';
import {colores} from './../styles';

//  border-radius: 10px;
// margin-top: 10px;
// margin-bottom: 10px;
// margin-left: 20px;
// margin-right: 20px;
const CampoTexto = styled.TextInput`
  background-color: ${colores.fondo_tarjeta};
  border-radius: 8px;
  padding: 15px;
  font-size: 18px;
`;

export default CampoTexto;
