// Funciones para realizar peticiones HTTP
//http.fetching.js
export const POST = async (URL_API, params) => {
    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            ...params,
        });

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            // Intentamos obtener el mensaje de error del cuerpo de la respuesta
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        // Parseamos y retornamos la respuesta como JSON
        return response.json();
    } catch (error) {
        console.error('Error en POST:', error.message);
        console.log('Datos enviados:', params);
        throw new Error(`Failed to post to ${URL_API}: ${error.message}`);
    }
};

export const GET = async (URL_API, params) => {
    try {
        const response = await fetch(URL_API, {
            method: 'GET',
            ...params
        });

        console.log('Respuesta completa del servidor:', response);

        // Verificar si la respuesta tiene un método `.json`
        if (!response.ok) {
            const errorText = await response.text(); // Capturar el texto de error para debugging
            console.error('Error en la respuesta:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            throw new Error(`El servidor no devolvió un JSON válido. Content-Type: ${contentType}`);
        }
    } catch (error) {
        console.error('Error en la petición GET:', error.message);
        throw new Error(`Failed to get from ${URL_API}: ${error.message}`);
    }
};

export const PUT = async (URL_API, params) => {
    try {
        const response = await fetch(URL_API, {
            method: 'PUT',
            ...params,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error en PUT a ${URL_API}:`, errorText);
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json(); // Parseamos la respuesta como JSON
        }
        return response; // Devuelve el Response completo si no es JSON
    } catch (error) {
        console.error(`Error en PUT a ${URL_API}:`, error.message);
        throw new Error(`Failed to put to ${URL_API}: ${error.message}`);
    }
};

export const DELETE = async (URL_API, params) => {
    try {
        const response = await fetch(URL_API, {
            method: 'DELETE',
            ...params,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error en DELETE a ${URL_API}:`, errorText);
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json(); // Parseamos la respuesta como JSON
        }
        return response; // Devuelve el Response completo si no es JSON
    } catch (error) {
        console.error(`Error en DELETE a ${URL_API}:`, error.message);
        throw new Error(`Failed to delete from ${URL_API}: ${error.message}`);
    }
};

// Helpers para Headers
const getUnnauthenticatedHeaders = () => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'x-api-key': '4f5e6g7h8i9j0k1l2m3n',
    });
    console.log('Headers sin autenticación:', headers);
    return headers;
};

const getAuthenticatedHeaders = () => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'x-api-key': '4f5e6g7h8i9j0k1l2m3n',
    });
    const token = sessionStorage.getItem('access_token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    } else {
        console.warn('No se encontró access_token en sessionStorage.');
    }
    console.log('Headers con autenticación:', headers);
    return headers;
};

export { getAuthenticatedHeaders, getUnnauthenticatedHeaders };
