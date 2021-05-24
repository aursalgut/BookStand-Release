import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {Libro} from '../../components';
import {DetallesLibroProps} from '../../navigations';
import {Libro as TipoLibro} from '../../types';

// Pantalla que muestra los detalles del libro y permite realizar
// diversas operaciones con él
export default function DetallesLibro(props: DetallesLibroProps) {
	// Variables con el estado que manejaremos en esta pantalla
	const [libro, setLibro] = useState({});
	const [cargando, setCargando] = useState(true);

	// Hook useEffect para cargar adecuadamente el contenido en los componentes
	useEffect(() => {
		/* En este caso no es necesario una función de cleanup, ya que no realizamos
    ninguna llamada a una función asíncrona */

		// Establecemos el valor del libro
		setLibro(props.route.params);

		if (libro === {} as TipoLibro ) {
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
					<Libro libro={libro as TipoLibro} enBiblioteca={true} />
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
