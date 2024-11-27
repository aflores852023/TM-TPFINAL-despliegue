export const POST = async (URL_API, params) => {
	try {
		const response = await fetch(URL_API, {
			method: 'POST',
			...params
		});
		// Verificamos si la respuesta fue exitosa
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json(); // Parseamos la respuesta como JSON
	} catch (error) {
		console.log(error);
		console.log('los datos enviados en el post son :', params);
		throw new Error(`Failed to post to ${URL_API}: ${error.message}`);
		
	}
}

export const GET = async (URL_API, params) => {
	try {
		const response = await fetch(URL_API, {
			method: 'GET',
			...params
		});
		// Verificamos si la respuesta fue exitosa
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
			
		}
		return response.json(); // Parseamos la respuesta como JSON
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get from ${URL_API}: ${error.message}`);
		
	}
	
}

export const PUT = async (URL_API, params) => {
	try {
		const response = await fetch(URL_API, {
			method: 'PUT',
			...params
		});
		// Verificamos si la respuesta fue exitosa
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json(); // Parseamos la respuesta como JSON
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to put to ${URL_API}: ${error.message}`);
	}
}

export const DELETE = async (URL_API, params) => {
	try {
		const response = await fetch(URL_API, {
			method: 'DELETE',
			...params
		});
		// Verificamos si la respuesta fue exitosa
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json(); // Parseamos la respuesta como JSON
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete from ${URL_API}: ${error.message}`);
	}
}

/**
 * Devuelve un objeto de Headers con Content-Type establecido como application/json y 
 * x-api-key con la clave pública.
 *
 * @returns {Headers} Un objeto de Headers para ser usado con fetch.
 */
const getUnnauthenticatedHeaders = () => {
	const unnauthenticatedHeaders = new Headers();
	unnauthenticatedHeaders.set('Content-Type', 'application/json');
	unnauthenticatedHeaders.set('x-api-key', '4f5e6g7h8i9j0k1l2m3n');
	return unnauthenticatedHeaders;
}

/**
 * Devuelve un objeto de Headers con Content-Type establecido como application/json, 
 * x-api-key con la clave pública y Authorization con Bearer + el access_token almacenado 
 * en sessionStorage.
 *
 * @returns {Headers} Un objeto de Headers para ser usado con fetch.
 */
const getAuthenticatedHeaders = () => {
	const authenticatedHeaders = new Headers();
	authenticatedHeaders.set('Content-Type', 'application/json');
	authenticatedHeaders.set('x-api-key', '4f5e6g7h8i9j0k1l2m3n');
	authenticatedHeaders.set('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'));
	return authenticatedHeaders;
}

export { getAuthenticatedHeaders, getUnnauthenticatedHeaders };
