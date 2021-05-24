import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

import {EntradaLibro} from '../../components';
import {contexto} from '../../components/Biblioteca/EntradaLibro';
import Encabezado from '../../components/Encabezado';
import {selectUsuario} from '../../redux/authSlice';
import {selectTodosLibros} from '../../redux/librosSlice';
import {colores} from '../../styles';
import {Libro, Prestamo, TipoPrestamo, Usuario} from '../../types';
import {
	buscarPrestamos,
	informacionPrestamo,
	obtenerDatosPrestamo,
} from '../../utils/Prestamo';

export function LibrosPrestados() {
	// Controlamos la vista de las listas
	const [visibleDeudor, setVisDeudor] = useState(true);
	const [visiblePrestador, setVisPrestador] = useState(true);
	const [librosDeudor, setLibrosDeudor] = useState([] as Libro[]);
	const [librosPrestador, setLibrosPrestador] = useState([] as Libro[]);

	// Obtenemos los datos del nuestro almacén global de Redux
	const libros = useSelector(selectTodosLibros);
	const usuario = useSelector(selectUsuario);

	useEffect(() => {
		// Obtenemos los libros prestados...

		// Los libros de los que somos deudores ahora
		setLibrosDeudor(buscarPrestamos(libros, TipoPrestamo.deudor));
		// Los libros de los que somos prestadores ahora
		setLibrosPrestador(buscarPrestamos(libros, TipoPrestamo.prestador));
	}, [libros]);

	return (
		<View style={styles.contenedor}>
			<Encabezado />
			<Pressable
				style={styles.fila}
				onPress={() => setVisDeudor(!visibleDeudor)}>
				<Text style={styles.tituloListas}>
					Libros que me están prestando ({librosDeudor.length.toString()})
				</Text>
				<Icon name={visibleDeudor ? 'expand-less' : 'expand-more'} size={25} />
			</Pressable>
			{visibleDeudor && (
				<FlatList
					data={librosDeudor}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item}) => (
						<EntradaPrestamo
							libro={item}
							contexto={contexto.favoritos}
							usuario={usuario}
						/>
					)}
				/>
			)}
			<Pressable
				style={styles.fila}
				onPress={() => setVisPrestador(!visiblePrestador)}>
				<Text style={styles.tituloListas}>
					Libros que estoy prestando ({librosPrestador.length.toString()})
				</Text>
				<Icon
					name={visiblePrestador ? 'expand-less' : 'expand-more'}
					size={25}
				/>
			</Pressable>
			{visiblePrestador && (
				<FlatList
					data={librosPrestador}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item}) => (
						<EntradaPrestamo
							libro={item}
							contexto={contexto.favoritos}
							usuario={usuario}
						/>
					)}
				/>
			)}
		</View>
	);
}

function EntradaPrestamo(props: {
	libro: Libro;
	contexto: contexto;
	usuario: Usuario;
}) {
	const [textoFecha, setTextoFecha] = useState('');
	const [prestamo, setPrestamo] = useState({} as Prestamo);
	useEffect(() => {
		obtenerDatosPrestamo(props.usuario, props.libro)
			.then((respuesta) => {
				setPrestamo(respuesta);
				setTextoFecha(informacionPrestamo(respuesta));
			})
			.catch(() => {
				setTextoFecha('Sin fecha');
				setPrestamo({} as Prestamo);
			});
	}, []);
	return (
		<View style={styles.tarjeta}>
			<EntradaLibro libro={props.libro} contexto={props.contexto} />
			<View style={styles.filaBagde}>
				{prestamo.estado !== undefined &&
					prestamo.estado.substring(0, 3) === 'PEN' && (
					<Icon
						name={'pending-actions'}
						size={25}
						color={colores.texto_secundario}
						style={styles.icono}
					/>
				)}
				{textoFecha === 'OK' && (
					<Text style={styles.bagdeOk}>
						Fecha de devolución:{' '}
						{prestamo.fechaDevolucion?.toDate().toLocaleDateString()}
					</Text>
				)}
				{textoFecha === 'PROXIMA' && (
					<Text style={styles.badgeProximo}>
						Fecha de devolución:{' '}
						{prestamo.fechaDevolucion?.toDate().toLocaleDateString()}
					</Text>
				)}
				{textoFecha === 'ATRASADA' && (
					<Text style={styles.badgeAtrasado}>{textoFecha}</Text>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		flex: 1,
	},
	tituloListas: {
		fontSize: 16,
		paddingVertical: 4,
	},
	fila: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
	},
	badgeProximo: {
		backgroundColor: colores.proximo,
		color: colores.texto_claro,
		padding: 4,
		marginBottom: 8,
		borderRadius: 8,
	},
	badgeAtrasado: {
		backgroundColor: colores.importante,
		color: colores.texto_claro,
		padding: 4,
		marginBottom: 8,
		borderRadius: 8,
	},
	bagdeOk: {
		backgroundColor: colores.acento,
		color: colores.texto_claro,
		padding: 4,
		marginBottom: 8,
		borderRadius: 8,
	},
	tarjeta: {
		flex: 1,
		backgroundColor: colores.fondo_tarjeta,
		marginHorizontal: 12,
		marginVertical: 4,
		borderRadius: 8,
		paddingBottom: 18,
	},
	icono: {
		padding: 4,
		marginBottom: 8,
	},
	filaBagde: {
		flex: 1,
		position: 'absolute',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignSelf: 'flex-end',
		alignItems: 'center',
		paddingHorizontal: 12,
		bottom: 0,
	},
});
