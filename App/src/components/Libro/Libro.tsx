import React, {useReducer} from 'react';
import {View} from 'react-native';
import {useEffect} from 'react';
import {ModalEditarCadena} from '../Modales/ModalEditarCadena';
import {ModalEditarArray} from '../Modales/ModalEditarArray';
import {reducer, estadoInicial} from './LibroReducer';
import {styles, Tarjeta} from './LibroEstilo';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {InformacionBasica} from './InformacionBasica';
import {IconosDeEstado} from './IconosDeEstado';
import {InformacionAdicional} from './InformacionAdicional';
import {BotonesAccion} from './BotonesAccion';
import {Libro as TipoLibro} from '../../types';
import {AgregarPrestamo} from '../Prestamo/AgregarPrestamo';
import {CabeceraLibro} from './CabeceraLibro';
import {MenuOpciones} from './MenuOpciones';
import {HistorialPrestamo} from '../Prestamo/HistorialPrestamo';
import {
	PantallaPrincipalNavigationProps,
	PantallasBibliolNavigationProps,
} from '../../navigations';
/* Componente para mostrar los datos de un libro */

// TODO: Definir lo que hacen los botones de atrás dependiendo de la pantalla
// de la que vengamos
function Libro(props: {libro: TipoLibro; enBiblioteca: boolean}) {
	// Despachador de Redux para actualizar el estado de la aplicación
	const dispatchRedux = useDispatch();

	// Hook Use reducer. Es un hook que nos permite gestionar el estado de componentes
	// más complejos de forma más sencilla que utilizando múltiples hooks useState
	// Además, nos permite actualizar el estado del componente padre desde sus hijos,
	// lo que resulta útil a la hora de modularizar nuestros componentes
	const [estado, dispatch] = useReducer(reducer, {
		...estadoInicial,
		libro: props.libro,
		backupLibro: props.libro,
		enBiblioteca: props.enBiblioteca,
	});
	const navigation:
		| PantallasBibliolNavigationProps
		| PantallaPrincipalNavigationProps = useNavigation();

	// useEffect: hook que nos permite cargar los datos antes de representar el componente
	// son observadores de las variables datos, libro, primeraCarga
	useEffect(() => {
		if (estado.primeraCarga) {
			// Solo nos hace falta cargar una vez los datos antes de mostrar el componente
			// Sin este condicional, los 'props' machacaría constantemente el nuevo valor
			// que asignamos a libro durante la edición
			dispatch({type: 'libro', libro: props.libro});
			dispatch({type: 'enBiblioteca', enBiblioteca: props.enBiblioteca});
			dispatch({type: 'backupLibro', backupLibro: props.libro});
			dispatch({type: 'primeraCarga', primeraCarga: false});
		}
		// Cuando actualicemos el valor de libro el resto de las veces, por defecto, RN
		// vuelve a renderizar los componentes, por lo que no tenemos que hacer nada más
	}, [props, estado.primeraCarga]);

	return (
		<View style={styles.contenedor}>
			{props.enBiblioteca ? (
				<>
					<CabeceraLibro estado={estado} dispatch={dispatch} />
				</>
			) : (
				<></>
			)}
			<MenuOpciones
				estado={estado}
				dispatch={dispatch}
				dispatchRedux={dispatchRedux}
				navigation={navigation}
			/>
			<ModalEditarCadena estado={estado} dispatch={dispatch} />
			<ModalEditarArray estado={estado} dispatch={dispatch} />
			<AgregarPrestamo
				estadoLibro={estado}
				dispatchLibro={dispatch}
				dispatchRedux={dispatchRedux}
			/>
			<HistorialPrestamo estado={estado} dispatch={dispatch} />
			<Tarjeta>
				<InformacionBasica estado={estado} dispatch={dispatch} />
				<IconosDeEstado estado={estado} dispatch={dispatch} />
				<InformacionAdicional estado={estado} dispatch={dispatch} />
				<BotonesAccion
					estado={estado}
					dispatch={dispatch}
					dispatchRedux={dispatchRedux}
					navigation={navigation}
				/>
			</Tarjeta>
		</View>
	);
}

export default Libro;
