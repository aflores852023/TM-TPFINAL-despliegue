import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching';
import ENVIROMENT from '../../../enviroment.js';
import './Login.css';

const Login = () => {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmitLoginForm = async (e) => {
		try {
			e.preventDefault();
			setErrorMessage(''); // Resetea el mensaje de error

			const form_HTML = e.target;
			const form_Values = new FormData(form_HTML);
			const form_fields = {
				email: '',
				password: ''
			};

			const form_values_object = extractFormData(form_fields, form_Values);

			// Enviar la solicitud al backend
			const response = await POST(
				`${ENVIROMENT.URL_BACKEND}/api/auth/login`,
				{
					headers: getUnnauthenticatedHeaders(),
					body: JSON.stringify(form_values_object)
				}
			);

			// Validar si la autenticación fue exitosa
			if (response.ok) {
				const access_token = response.payload.token;
				sessionStorage.setItem('access_token', access_token);
				sessionStorage.setItem('user_info', JSON.stringify(response.payload.user));
				navigate('/Home');
			} else {
				// Mostrar mensaje de error si la autenticación falla
				setErrorMessage(response.message || 'Credenciales incorrectas. Intenta nuevamente.');
			}
		} catch (error) {
			// Manejar errores de red u otros
			console.error(error);
			setErrorMessage('Ocurrió un error inesperado. Por favor, intenta más tarde.');
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h1 className="login-title">Inicia sesión en Slack</h1>
				<p className="login-subtitle">Usa el correo electrónico que utilizas en el trabajo.</p>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<form onSubmit={handleSubmitLoginForm} className="login-form">
					<div className="form-field">
						<label htmlFor="email">Correo electrónico:</label>
						<input
							name="email"
							id="email"
							placeholder="nombre@work-email.com"
							className="form-input"
							type="email"
						/>
					</div>
					<div className="form-field">
						<label htmlFor="password">Contraseña:</label>
						<input
							name="password"
							id="password"
							placeholder="********"
							className="form-input"
							type="password"
						/>
					</div>
					<button type="submit" className="submit-button">Iniciar sesión con el correo electrónico</button>
				</form>
				<div className="login-separator">O BIEN</div>
				<div className="login-links">
					<p>
						<Link to="/forgot-password" className="form-link">¿Has olvidado tu contraseña?</Link>
					</p>
					<p>
						<Link to="/register" className="form-link">¿No tienes una cuenta? Regístrate</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
