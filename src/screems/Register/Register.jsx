import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useForm from '../../Hooks/useForm';
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching';
import ENVIROMENT from '../../../enviroment.js';
import '../../screems/screen-style.css'; // Importamos los estilos

const Register = () => {
    const navigate = useNavigate();

    const form_fields = {
        name: '',
        email: '',
        password: ''
    };
    const { form_values_state, handleChangeInputValue } = useForm(form_fields);

    const [errorMessage, setErrorMessage] = useState(''); // Estado para los mensajes de error
    const [loading, setLoading] = useState(false); // Estado de carga

    const handleSubmitRegisterForm = async (event) => {
        event.preventDefault();

        // Validación local: verificar que todos los campos estén completos
        if (!form_values_state.name || !form_values_state.email || !form_values_state.password) {
            setErrorMessage('Por favor, complete todos los campos.');
            return;
        }

        // Validación local: formato del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form_values_state.email)) {
            setErrorMessage('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        setErrorMessage(''); // Limpiar errores previos
        setLoading(true); // Activar estado de carga

        try {
            // Petición al backend para registrar
            const response = await POST(
                `${ENVIROMENT.URL_BACKEND}/api/auth/register`,
                {
                    headers: getUnnauthenticatedHeaders(),
                    body: JSON.stringify(form_values_state)
                }
            );

            // Si el correo ya existe, mostramos un error
            if (response.status === 'error' && response.message.includes('ya existe')) {
                setErrorMessage('El correo electrónico ya está registrado.');
                setLoading(false);
                return;
            }

            // Si todo sale bien, redirigimos al login
            navigate('/login');
        } catch (error) {
            setErrorMessage('Ocurrió un error durante el registro. Inténtelo nuevamente.');
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">Regístrate en nuestra web</h1>
                <form onSubmit={handleSubmitRegisterForm}>
                    <div className="register-group">
                        <label className="register-label" htmlFor="name">Nombre:</label>
                        <input
                            className="register-input"
                            name="name"
                            id="name"
                            placeholder="Pepe Suarez"
                            onChange={handleChangeInputValue}
                        />
                    </div>
                    <div className="register-group">
                        <label className="register-label" htmlFor="email">Correo electrónico:</label>
                        <input
                            className="register-input"
                            name="email"
                            id="email"
                            placeholder="pepe@gmail.com"
                            onChange={handleChangeInputValue}
                        />
                    </div>
                    <div className="register-group">
                        <label className="register-label" htmlFor="password">Contraseña:</label>
                        <input
                            className="register-input"
                            name="password"
                            id="password"
                            type="password"
                            placeholder="********"
                            onChange={handleChangeInputValue}
                        />
                    </div>
                    {errorMessage && (
                        <p className="register-error">{errorMessage}</p>
                    )}
                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
                <span className="register-footer">
                    Si ya tienes cuenta, puedes ir a <Link to="/login">Login</Link>
                </span>
            </div>
        </div>
    );
};

export default Register;
