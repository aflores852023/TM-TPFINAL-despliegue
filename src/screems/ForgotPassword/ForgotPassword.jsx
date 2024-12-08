import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching';
import ENVIROMENT from '../../../enviroment.js';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // hook de react-router-dom para redirección

  const validateEmail = (email) => {
    // Expresión regular para validar correos electrónicos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();

    // Extraer valores del formulario
    const form_HTML = e.target;
    const form_Values = new FormData(form_HTML);
    const form_fields = { email: '' };
    const form_values_object = extractFormData(form_fields, form_Values);
    const email = form_values_object.email;

    // Validar que el campo email no esté vacío y sea válido
    if (!email) {
      setError('El campo de email no puede estar vacío.');
      setMessage('');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un email válido.');
      setMessage('');
      return;
    }

    try {
      const response = await POST(`${ENVIROMENT.URL_BACKEND}/api/auth/forgot-password`, {
        headers: getUnnauthenticatedHeaders(),
        body: JSON.stringify(form_values_object),
      });
        // Redirige a la home
      if (response.ok) {
        setMessage('Si el email está registrado, se enviará un correo con instrucciones para restablecer tu contraseña.');
        setError(''); // Limpia errores previos
        form_HTML.reset(); // Limpia el formulario
        setMessage('Por favor verifique su correo para restablecer su contraseña.'); // Limpia mensajes previos

        // Redirigir a la página de inicio
        setTimeout(() => {
        navigate('/login'); // Redirige a la home
        }, 2000); // Redirige después de 2 segundos para dar tiempo a leer el mensaje
      }
      else
      {
        setTimeout(() => {
          navigate('/login'); // Redirige a la home
          }, 2000); // Redirige después de 2 segundos para dar tiempo a leer el mensaje
      }
    } catch (error) {
      console.error(error);
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      setMessage('Por favor verifique su correo para restablecer su contraseña.'); // Limpia mensajes previos
      navigate('/login'); // Redirige a la home
    }
  };

  return (
    <div className="screen-container">
      <div className="screen">
        <h1 className="screen-welcome">Olvidé mi contraseña</h1>
        <p className="screen-subtitle">
          Enviaremos un correo electrónico a tu cuenta para enviarte los pasos de restablecimiento de la contraseña.
        </p>

        {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form className="screen-form" onSubmit={handleSubmitLoginForm}>
          <div className="screen-form-group">
            <label htmlFor="email" className="screen-form-label">
              Ingrese su email:
            </label>
            <input
              name="email"
              id="email"
              className="screen-input"
              placeholder="pepe@gmail.com"
              type="email"
            />
          </div>
          <button type="submit" className="screen-button">
            Enviar mail
          </button>
        </form>
        <div className="screen-links">
          <span>
            Si ya tienes cuenta, puedes <Link to="/login" className="screen-link">iniciar sesión</Link>.
          </span>
          <br />
          <span>
            Si aún no tienes cuenta, puedes <Link to="/register" className="screen-link">registrarte</Link>.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
