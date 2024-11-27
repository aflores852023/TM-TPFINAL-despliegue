import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GET } from './../../fetching/http.fetching'; // Reutiliza tu método GET
import ENVIROMENT from '../../../enviroment.js';

const Verify = () => {
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(5); // Inicializa el contador en 5 segundos

    useEffect(() => {
        const verifyUser = async () => {
            const params = new URLSearchParams(location.search); // Obtiene el token de la URL
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token no válido o faltante.');
                return;
            }

            try {
                const response = await GET(`${ENVIROMENT.URL_BACKEND}/api/auth/verify/${token}`);
                if (response.ok) {
                    setStatus('success');
                    setMessage('¡Usuario verificado con éxito!');
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Error al verificar el usuario.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Error inesperado al verificar el usuario.');
            }
        };

        verifyUser();
    }, [location.search]);

    useEffect(() => {
        if (status === 'success') {
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1); // Reduce el contador
            }, 1000);

            // Cierra la pestaña o redirige cuando el contador llega a 0
            const timeout = setTimeout(() => {
                window.close(); // Intenta cerrar la pestaña
                if (!window.closed) {
                    window.location.href = '/'; // Redirige si no puede cerrarla
                }
            }, countdown * 1000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [status, countdown]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h1>Verificación de Usuario</h1>
            {status === 'success' ? (
                <>
                    <p style={{ color: 'green' }}>{message}</p>
                    <p>Esta pestaña se cerrará en {countdown} segundos...</p>
                </>
            ) : status === 'error' ? (
                <p style={{ color: 'red' }}>{message}</p>
            ) : (
                <p>Verificando...</p>
            )}
        </div>
    );
};

export default Verify;
