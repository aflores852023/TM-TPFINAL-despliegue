import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching';
import ENVIROMENT from '../../../enviroment.js';
import '../../screems/screen-style.css';

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
		<div className="screen-container">
			<div className="screen">
				<h1 className="screen-title">Inicia sesión</h1>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<form onSubmit={handleSubmitLoginForm} className="login-form">
					<div className="form-field">
						<label htmlFor="email">Ingrese su email:</label>
						<input name="email" id="email" placeholder="pepe@gmail.com" className="form-input" />
					</div>
					<div className="form-field">
						<label htmlFor="password">Ingrese su contraseña:</label>
						<input name="password" id="password" placeholder="********" className="form-input" type="password" />
					</div>
					<button type="submit" className="submit-button">Iniciar sesión</button>
				</form>
				<div className="form-links">
					<span>Si aún no tienes cuenta, puedes <Link to="/register" className="form-link">Registrarte</Link></span>
					<br />
					<span>¿Has olvidado la contraseña? <Link to="/forgot-password" className="form-link">Restablecer</Link></span>
				</div>
			</div>
		</div>
	);
};

export default Login;
