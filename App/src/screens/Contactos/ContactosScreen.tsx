import React, {useEffect, useReducer} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Boton, CampoTexto, Encabezado, TextoBoton} from '../../components';
import {Contacto} from '../../types';
import {
	buscarUsuario,
	obtenerMisContactos,
} from './Social';
import {reducer, estadoInicial} from './ContactosReducer';
import {useSelector} from 'react-redux';
import {selectUsuario} from '../../redux/authSlice';
import {ListaUsuarios} from './ListaUsuarios';
import {colores} from '../../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ContactosScreen() {
	const [estado, dispatch] = useReducer(reducer, estadoInicial);
	const usuario = useSelector(selectUsuario);

	useEffect(() => {
		// Al principio, cuando carguemos la pantalla, cargamos los contactos
		obtenerMisContactos(usuario.uid, dispatch);
	});
	// Cada vez que se produzcan cambios a la cadena, realizamos la búsqueda
	useEffect(() => {
		// Evitamos llamadas innecesarias cuando la cadena de búsqueda esté vacía
		if (estado.cadenaBusqueda) {
			buscarUsuario(usuario.uid, estado.cadenaBusqueda, dispatch);
			dispatch({type: 'buscando', buscando: true});
		}
	}, [estado.cadenaBusqueda, usuario.uid]);

	useEffect(() => {
		// Cada vez que se produzcan cambios en los usuarios, refrescamos
		// No es necesario realizar ninguna acción, se pone en un hook distinto para
		// separar los efectos
	}, [estado.usuarios]);

	return (
		<View style={styles.contenedor}>
			<Encabezado />
			{!estado.buscando && <Text style={styles.titulo}>Mis contactos</Text>}
			{estado.buscando && (
				<View style={styles.barraBusqueda}>
					<CampoTexto
						placeholder={'Buscar por nombre'}
						value={estado.cadenaBusqueda}
						onChangeText={(texto: string) =>
							dispatch({
								type: 'modificarCadenaBusqueda',
								cadenaBusqueda: texto,
							})
						}
					/>
					<Icon
						name="cancel"
						size={30}
						color={colores.principal_oscuro}
						onPress={() => {
							dispatch({
								type: 'actualizarUsuarios',
								usuarios: [] as Contacto[],
							});
							dispatch({type: 'modificarCadenaBusqueda', cadenaBusqueda: ''});
							dispatch({type: 'buscando', buscando: false});
						}}
					/>
				</View>
			)}
			<ListaUsuarios
				usuarios={estado.buscando ? estado.usuarios : estado.contactos}
				usuario={usuario}
			/>
			{!estado.buscando && (
				<Boton
					style={styles.botonBuscar}
					onPress={() => {
						dispatch({type: 'buscando', buscando: true});
					}}>
					<TextoBoton>Buscar usuarios</TextoBoton>
				</Boton>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	titulo: {
		fontSize: 20,
		marginHorizontal: 12,
		color: colores.texto_oscuro,
		marginBottom: 4,
	},
	botonBuscar: {
		position: 'absolute',
		bottom: 12,
		right: 12,
	},
	barraBusqueda: {
		flexDirection: 'row',
		backgroundColor: colores.fondo_tarjeta,
		alignItems: 'center',
		marginHorizontal: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		elevation: 1,
		justifyContent: 'space-between',
	},
});
