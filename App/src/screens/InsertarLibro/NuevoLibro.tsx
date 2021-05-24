import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Libro, Boton, TextoBoton} from '../../components';
import {StyleSheet, Text} from 'react-native';
import {NuevoLibroProps} from '../../navigations';
import {Libro as TipoLibro} from '../../types';

/* Pantalla NuevoLibro que contiene los detalles de un libro que se quiere
  añadir y permite su edición antes de añadirlo a la base de datos.

  Parámetros: libro
    Recibe un parámetro que contiene un objeto libro que será el que contendrá
      los detalles a mostrar. Acceso con: props.route.params (React Navigation)*/
export default function NuevoLibro(props: NuevoLibroProps) {
	// Variables con el estado que manejaremos en esta pantalla
	const [libro, setLibro] = useState({});
	const [cargando, setCargando] = useState(true);
	// const navigation = useNavigation<PantallaPrincipalNavigationProps>();

	// Hook useEffect para cargar adecuadamente el contenido en los componentes
	useEffect(() => {
		/* En este caso no es necesario una función de cleanup, ya que no realizamos
      ninguna llamada a una función asíncrona */

		// Establecemos el valor del libro
		setLibro(props.route.params);

		if (libro === {}) {
			// Si el libro se ha cargado, actualizamos la variable cargando =  true
			setCargando(true);
		} else {
			// Si el libro se ha cargado, actualizamos la variable cargando = false
			setCargando(false);
		}
	}, [props.route.params, libro]);

	return (
		<ScrollView style={styles.contenedor}>
			{cargando ? (
				<>
					{/* Si no se han cargado los datos, mostrar mensaje de carga*/}
					<Text style={styles.centrado}>Cargando...</Text>
				</>
			) : (
				<>
					{/* Cuando se han cargado los datos, mostrar detalles del libro*/}
					<Libro libro={libro as TipoLibro} enBiblioteca={false} />
					<Boton
						onPress={() => {
							props.navigation.navigate('Pantalla Principal');
						}}>
						<TextoBoton>CANCELAR</TextoBoton>
					</Boton>
				</>
			)}
		</ScrollView>
	);
}

// Estilos para los componentes
const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	centrado: {
		flex: 1,
		alignSelf: 'center',
	},
});
