import React from 'react';
import {
	Alert,
	Image,
	Linking,
	PermissionsAndroid,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {jsonToCSV} from 'react-papaparse';
import {useSelector} from 'react-redux';

import {version as app_version} from '../../package.json';
import {Encabezado} from '../components';
import {selectTodosLibros} from '../redux/librosSlice';
import {colores} from '../styles';

export default function Acerca() {
	const libros = useSelector(selectTodosLibros);
	return (
		<View>
			<Encabezado />
			<View style={styles.descarga}>
				<Pressable
					onPress={() => {
						PermissionsAndroid.request(
							PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
						)
							.then((response) => {
								if (response === PermissionsAndroid.RESULTS.GRANTED) {
									// console.log('Creamos el JSON');
									const json = JSON.stringify(libros);
									const csv = jsonToCSV(json);
									const path =
										RNFS.DownloadDirectoryPath + '/Biblioteca_BookStand.csv';

									RNFS.writeFile(path, csv, {encoding: 'utf8'})
										.then(() => {
											// Una vez creado el fichero
											if (Platform.OS === 'android') {
												RNFS.scanFile(path).then(() => {
													/* Lo hemos escaneado para que lo detecte el sistema 
													de archivos de Android y aparezca inmediatamente en
													el sistema de archivos */
													Alert.alert(
														'Se han descargado los datos',
														'Comprueba la carpeta Descargas de tu dispositivo',
													);
												});
											}
										})
										.catch((error) =>
											console.log('No se ha podido crear el archivo', error),
										);
								} else {
									Alert.alert(
										'Se necesitan permisos de escritura para descargar los datos',
									);
								}
							})
							.catch();
					}}>
					<Text style={styles.tituloDescarga}>
						Descargar datos de la biblioteca
					</Text>
					<Text style={styles.textoDescarga}>
						Descarga todos los datos de los libros en formato CSV
					</Text>
					<Icon
						style={styles.iconoDescarga}
						name="file-download"
						size={30}
						color={colores.texto_claro}
					/>
				</Pressable>
			</View>
			<View style={styles.separador} />
			<View style={styles.info}>
				<Text style={styles.titulo}>Acerca de BookStand</Text>
				<Text>Versión: {app_version}</Text>
				<Text>Creada por Aurora Salvador</Text>
			</View>
			<View>
				<Pressable
					style={styles.openLibrary}
					onPress={() => {
						Linking.openURL('https://openlibrary.org/');
					}}>
					<Image
						style={styles.logoOpenLib}
						source={require('./../assets/images/OpenLibrary.png')}
					/>
					<Text style={styles.textoSecundario}>
						La información y las imágenes de las cubiertas de los libros están
						proporcionadad por Open Library.
					</Text>
				</Pressable>
				<Pressable
					style={styles.enlace}
					onPress={() => {
						Linking.openURL('https://github.com/aursalgut/BookStand-Release');
					}}>
					<Image
						source={require('../assets/images/GitHub-Mark.png')}
						style={styles.imagenGithub}
					/>
					<Text style={styles.textoGithub}>
						El código de esta aplicación está disponible en Github
					</Text>
				</Pressable>
				<Pressable
					style={styles.enlace}
					onPress={() =>
						Linking.openURL('https://forms.gle/tHMfArSoEeP9hrVM9')
					}>
					<Icon name="question-answer" size={30} />
					<Text style={styles.textoSecundario}>
						Enviar comentarios y feedback
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	titulo: {
		fontSize: 20,
	},
	info: {
		marginHorizontal: 20,
		marginVertical: 8,
	},
	logoOpenLib: {
		height: 50,
		width: 200,
		alignSelf: 'center',
		marginVertical: 8,
	},
	openLibrary: {
		marginHorizontal: 12,
		padding: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colores.deshabilitado,
		backgroundColor: colores.fondo_tarjeta,
		elevation: 1,
	},
	descarga: {
		marginHorizontal: 12,
		marginBottom: 12,
		padding: 8,
		borderRadius: 8,
		borderColor: colores.deshabilitado,
		backgroundColor: colores.acento,
		elevation: 5,
	},
	tituloDescarga: {
		paddingTop: 8,
		fontSize: 16,
		fontWeight: 'bold',
		color: colores.texto_claro,
	},
	textoDescarga: {
		color: colores.texto_claro,
	},
	iconoDescarga: {
		position: 'absolute',
		alignSelf: 'flex-end',
	},
	separador: {
		borderTopColor: colores.deshabilitado,
		borderTopWidth: 1.25,
		marginVertical: 12,
	},
	enlace: {
		flexDirection: 'row',
		borderRadius: 8,
		borderColor: colores.deshabilitado,
		borderWidth: 1,
		paddingVertical: 12,
		paddingHorizontal: 12,
		marginHorizontal: 12,
		marginTop: 12,
		backgroundColor: colores.fondo_tarjeta,
		alignItems: 'center',
		elevation: 1,
	},
	textoSecundario: {
		marginHorizontal: 8,
		color: colores.texto_secundario,
	},
	textoGithub: {
		flex: 1,
		marginHorizontal: 8,
		color: colores.texto_secundario,
	},
	imagenGithub: {
		height: 32,
		width: 32,
	},
	botonRecordatorios: {
		backgroundColor: colores.texto_secundario,
		color: colores.texto_claro,
		fontSize: 16,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		marginHorizontal: 12,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 5,
	},
	textoRecordatorio: {
		color: colores.texto_claro,
		fontSize: 16,
		marginStart: 8,
	},
	cabeceraModal: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 16,
		marginHorizontal: 16,
		alignItems: 'center',
	},
	fondoModal: {
		flex: 1,
		marginTop: 80,
		borderRadius: 16,
		elevation: 10,
		backgroundColor: colores.fondo_tarjeta,
	},
	textoCabecera: {
		fontSize: 20,
		color: colores.texto_oscuro,
	},
});
