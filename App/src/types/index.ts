/* eslint-disable @typescript-eslint/no-explicit-any */
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';


/**
 * Tipo enumerado para diferenciar entre estado de pendiente confirmación del
 * propio préstamo,pendiente de devolución y pendiente de modificación 
 */
export enum EstadoConfirmacion {
	pendienteCreacion = 'PEND_CREACION',
	confirmadoCreacion = 'OK_CREACION',
	denegadoCreacion = 'DEN_CREACION',
	pendienteModificacion = 'PEND_MODIFICACION',
	confirmadoModificacion = 'OK_MODIFICACION',
	degenadoModidicacion = 'DEN_MODIFICACION',
	pendienteDevolucion = 'PEND_DEVOLUCION',
	confirmadoDevolucion = 'OK_DEVOLUCION',
	denegadoDevolucion = 'DEN_DEVOLUCION',
	ocioso = 'OCIOSO',
}

/**
 * Tipo enumerado para representar el estado de un contacto en el sistema
 */
export enum EsContacto {
	si = 'SI',
	no = 'NO',
	pendiente = 'PENDIENTE',
}

/** Tipo enumerado para representar los diferentes tipos de préstamo en el 
 * sistema en función de la relación que tenga el usuario con el libro (si es
 * quien lo presta o a quien se lo prestan)
 */
export enum TipoPrestamo {
	ninguno = 'NINGUNO',
	deudor = 'DEUDOR',
	prestador = 'PRESTADOR',
}

/**
 * Tipo enumerado para representar los diferentes tipos de notificaciones que
 * se pueden recibir en el sistema
 */
export enum TipoNotificacion {
	solicitudAmistad = 'SOLICITUD_AMISTAD',
	info = 'INFO',
	confirmacionPrestamo = 'CONFIRMACION_PRESTAMO',
	rechazarPrestamo = 'RECHAZAR_PRESTAMO',
	rechazarDevolucion = 'RECHAZAR_DEVOLUCION',
	rechazarModificacion = 'RECHAZAR_MODIFICACION',
	actualizacionPrestamo = 'ACTUALIZACION_PRESTAMO',
	devolucionLibro = 'DEVOLUCION_LIBRO',
}

/**
 * Tipo enumerado para representar los diferentes criterios de búsqueda en la
 * interfaz de usuario con las tildes.
 */
export enum CriterioBusquedaTildes {
	titulo = 'título',
	isbn = 'ISBN',
	ubicacion = 'ubicación',
	notas = 'notas',
	autores = 'autores',
	generos = 'géneros',
	listas = 'listas',
}

// Constantes que definen el tipo de los criterios de búsqueda
export const CriterioBusquedaCadena = ['titulo', 'isbn', 'ubicacion', 'notas'];
export const CriterioBusquedaArray = ['autores', 'generos', 'listas'];

/**
 * Tipo que representa a un usuario en el sistema BookStand
 */
export type Usuario = {
	nombre?: string | null;
	correo?: string | null;
	uid: string;
	foto?: string | null;
	correoVerificado?: boolean;
	registroCorreo?: boolean;
	token?: string;
};

/**
 * Tipo que representa un libro en nuestro sistema
 */
export type Libro = {
	titulo?: string;
	autores?: string[];
	isbn: string;
	leido?: boolean;
	favorito?: boolean;
	notas?: string;
	ubicacion?: string;
	generos?: string[];
	listas?: string[];
	prestado?: TipoPrestamo; // Informa si hay préstamo y la relación del usuario
	esPropietario?: boolean;
	error?: boolean; // Sirve para modelar que los datos se han obtenido de la api
};

/**
 * Tipo que representa un préstamo en el sistema
 */
export type Prestamo = {
	id: string;
	isbn: string;
	uidPrestador: string;
	nombrePrestador: string | null | undefined;
	uidDeudor: string;
	nombreDeudor: string | null | undefined;
	fechaPrestado: FirebaseFirestoreTypes.Timestamp | Date | any;
	fechaDevolucion?: FirebaseFirestoreTypes.Timestamp | Date | any;
	devuelto: boolean;
	detalles?: string;
	titulo?: string;
	estado: EstadoConfirmacion;
};

/**
 * Tipo que representa a un contacto en el sistema
 */
export type Contacto = {
	uid: string;
	nombre: string;
	foto?: string;
	esContacto?: EsContacto;
};

/**
 * Tipo que representa una notificación en el sistema
 */
export type Notificacion = {
	id?: string;
	fecha: FirebaseFirestoreTypes.Timestamp; // fechaEnvío
	origen?: Contacto; // Contacto que genera la notificacion usuario
	titulo: string;
	cuerpo?: string;
	tipo?: TipoNotificacion;
	leida?: boolean;
	prestamo?: Prestamo;
};

