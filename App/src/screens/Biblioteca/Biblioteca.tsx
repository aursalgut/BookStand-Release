import React from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	Text,
	RefreshControl,
	Pressable,
} from 'react-native';
import {
	Encabezado,
	ModalAjustesBusqueda,
	EntradaLibro,
	MensajeFiltro,
	BotonSecundario,
} from '../../components';
import {useReducer} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	obtenerLibros,
	selectErrorLibro,
	selectStatusLibros,
	selectTodosLibros,
} from '../../redux/librosSlice';
import {BarraBusqueda} from '../../components';
import {EstadoBiblioteca, reducer} from './BibliotecaReducer';
import {selectUsuario} from '../../redux/authSlice';
import {contexto} from '../../components/Biblioteca/EntradaLibro';
import {colores} from '../../styles';
import Reminder from '../../assets/images/reminder.svg';
import {useNavigation} from '@react-navigation/core';
import {PantallaPrincipalNavigationProps} from '../../navigations';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AgregarNuevoLibro} from '../../components/Modales/AgregarLibro';
import {DimensionModal} from '../PantallaPrincipal/PantallaPrincipalReducer';

/* Pantalla que muestra los libros de un usuario en forma de lista */
export default function Biblioteca() {
	// Obtenemos los datos del nuestro almacén global de Redux
	const libros = useSelector(selectTodosLibros); // los libros que hay
	const librosStatus = useSelector(selectStatusLibros); // el estado que tienen
	const error = useSelector(selectErrorLibro); // los errores que tienen
	const navigation = useNavigation<PantallaPrincipalNavigationProps>();

	// Estado inicial de la pantalla
	const estadoInicial: EstadoBiblioteca = {
		filtrado: false, // indica si debemos mostrar los resultados de la búsqueda o no
		criterio: 'titulo', // criterio de búsqueda a tener en cuenta
		cadenaBusqueda: '', // cadena de búsqueda
		criterioFiltrado: 'ninguno',
		librosAMostrar: libros, // libros que satisfacen las condiciones de búsqueda
		modalVisible: false, // Muestra u oculta el pop-up para los ajustes de la búsqueda
		libros: libros, // Contiene todos los libros sin filtro
		refrescando: false, // Para controlar el refresco de los libros con la bbdd
		titulo: '',
		isbn: '',
		tipoFormulario: '',
		dimensionModal: DimensionModal.botones,
		modalAgregarLibro: false,
	};

	/* A partir de este hook, cada vez que queramos cambiar el estado del
  componente, lo haremos mediante la función dispatch. El valor se almacenará
  en la variable estado */
	const [estado, dispatch] = useReducer(reducer, estadoInicial);
	const dispatchRedux = useDispatch();
	const usuario = useSelector(selectUsuario);
	// Variable que renderizará el contenido a mostrar en la pantalla
	let contenido;
	if (librosStatus === 'succeeded') {
		// Cuando los libros estén cargados, mostraremos una lista
		/* Necesitamos keyExtractor para que la lista se cargue de
    forma más eficiente. Los datos que renderizaremos dependerán
    de si tenemos alguna cadena de búsqueda*/
		if (libros.length === 0) {
			contenido = (
				<View style={styles.bibliotecaVacia}>
					<Reminder width={200} height={150} />
					<Text style={styles.textoVacio}>
						Los libros que añadas aparecerán aquí. Para añadir un libro, ve a la
						pantalla principal y presiona el botón con el símbolo +
					</Text>
					<BotonSecundario
						onPress={() => {
							navigation.navigate('Pantalla Principal');
						}}>
						AÑADIR LIBROS
					</BotonSecundario>
				</View>
			);
		} else {
			contenido = (
				<FlatList
					data={estado.filtrado ? estado.librosAMostrar : libros}
					keyExtractor={(item, index) => index.toString()}
					refreshControl={
						<RefreshControl
							refreshing={estado.refrescando}
							onRefresh={() => {
								// Controlamos la animación para refrescar los datos de la API
								// Activamos la animación
								dispatch({type: 'refrescando', refrescando: true});
								// Recargamos los datos
								dispatchRedux(obtenerLibros(usuario));
								// Tras 2s, deshabilitamos la animación
								setTimeout(
									() => dispatch({type: 'refrescando', refrescando: false}),
									2000,
								);
							}}
						/>
					}
					renderItem={({item}) => (
						<EntradaLibro libro={item} contexto={contexto.todosLibros} />
					)}
				/>
			);
		}
	} else if (librosStatus === 'error') {
		// Si se ha producido un error o está cargando, mostraremos el mensaje
		// de error o de carga
		contenido = (
			<Pressable
				onPress={() => {
					// Recargamos los datos
					dispatchRedux(obtenerLibros(usuario));
				}}>
				<Text>{librosStatus === 'error' ? error : librosStatus}</Text>
			</Pressable>
		);
	} else if (librosStatus === 'idle') {
		// Cargamos los datos inicialmente en la aplicación
		dispatchRedux(obtenerLibros(usuario));
	}

	return (
		<View style={styles.contenedor}>
			<ModalAjustesBusqueda
				estado={estado}
				dispatch={dispatch}
				libros={libros}
			/>
			<Encabezado />
			<BarraBusqueda estado={estado} dispatch={dispatch} libros={libros} />
			{estado.filtrado && <MensajeFiltro estado={estado} />}
			<View style={styles.contenedor}>{contenido}</View>
			<Pressable
				onPress={() => {
					dispatch({type: 'modalAgregarLibro', modalAgregarLibro: true});
				}}
				style={styles.botonCircular}>
				<Icon name="add" color={colores.texto_claro} size={45} />
			</Pressable>
			<AgregarNuevoLibro estado={estado} dispatch={dispatch} />
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	bibliotecaVacia: {
		flex: 1,
		margin: 24,
		alignContent: 'center',
		alignItems: 'center',
	},
	textoVacio: {
		marginTop: 24,
		color: colores.texto_secundario,
		textAlign: 'center',
	},
	barraAccion: {
		width: '100%',
		alignItems: 'center',
	},
	botonCircular: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: colores.principal,
		borderRadius: 100,
		margin: 24,
		elevation: 4,
		padding: 4,
		alignSelf: 'flex-end',
	},
});
