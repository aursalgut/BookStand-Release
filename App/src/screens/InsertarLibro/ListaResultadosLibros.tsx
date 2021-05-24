import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {EntradaLibro, Boton, TextoBoton, Encabezado} from '../../components';
import {StyleSheet, Text} from 'react-native';
import {ListaLibrosProps} from '../../navigations';
import {Libro} from '../../types';
import {contexto} from '../../components/Biblioteca/EntradaLibro';

/* */
export default function ListaResultadosLibros(props: ListaLibrosProps) {
	// Variables con el estado que manejaremos en esta pantalla
	const [libros, setLibros] = useState([] as Libro[]);
	const [cargando, setCargando] = useState(true);
	// const navigation = useNavigation<PantallaPrincipalNavigationProps>();

	// Hook useEffect para cargar adecuadamente el contenido en los componentes
	useEffect(() => {
		/* En este caso no es necesario una función de cleanup, ya que no realizamos
      ninguna llamada a una función asíncrona */

		// Establecemos el valor del libro
		setLibros(props.route.params as Libro[]);

		if (libros === []) {
			// Si el libro se ha cargado, actualizamos la variable cargando =  true
			setCargando(true);
		} else {
			// Si el libro se ha cargado, actualizamos la variable cargando = false
			setCargando(false);
		}
	}, [props.route.params, libros]);

	return (
		<>
			<Encabezado />
			{cargando ? (
				<>
					{/* Si no se han cargado los datos, mostrar mensaje de carga*/}
					<Text style={styles.centrado}>Cargando...</Text>
				</>
			) : (
				<>
					{/* Cuando se han cargado los datos, mostrar detalles del libro*/}
					{libros.length !== 0 && (
						<FlatList
							data={libros}
							keyExtractor={(item, index) => index.toString()}
							renderItem={(libro) => (
								<EntradaLibro
									libro={libro.item}
									contexto={contexto.principal}
								/>
							)}
						/>
					)}
					<Boton
						onPress={() => {
							props.navigation.navigate('Pantalla Principal');
						}}>
						<TextoBoton>CANCELAR</TextoBoton>
					</Boton>
				</>
			)}
		</>
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
