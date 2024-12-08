import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { PUT, getUnnauthenticatedHeaders } from '../../fetching/http.fetching'; // Importamos PUT y los headers no autenticados
import ENVIROMENT from '../../../enviroment.js';
import './ResetPassword.css';

const ResetPassword = () => {
  const { reset_token } = useParams(); // Obtenemos el token de la URL
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitResetForm = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form_HTML = e.target;
    const form_Values = new FormData(form_HTML);
    const form_fields = {
      password: '',
    };

    const form_values_object = extractFormData(form_fields, form_Values);

    if (!form_values_object.password) {
      setError('La contraseña no puede estar vacía.');
      setLoading(false);
      return;
    }

    try {
      console.log('Formulario enviado:', form_values_object);
      console.log('Token de restablecimiento:', reset_token);
      console.log('URL:', `${ENVIROMENT.URL_BACKEND}/api/auth/reset-password/${reset_token}`);
      console.log('Cuerpo enviado:', form_values_object);
      const response = await PUT(
        `${ENVIROMENT.URL_BACKEND}/api/auth/reset-password/${reset_token}`,
        {
          headers: getUnnauthenticatedHeaders(), // Usamos headers no autenticados
          body: JSON.stringify(form_values_object),
        }
        
      );
     

      if (!response.ok) {
        setError(response.message || 'Hubo un error al restablecer la contraseña.');
      } else {
        alert('Contraseña restablecida con éxito.');
      }
    } catch (error) {
      console.error(error);
      setError('Error inesperado al intentar restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="screen">
        <h1 className="screen-title">Restablecer Contraseña</h1>
        <p className="screen-description">
          Completa el formulario con la nueva contraseña para restablecerla.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmitResetForm} className="reset-form">
          <div className="form-field">
            <label htmlFor="password">Ingrese su nueva contraseña:</label>
            <input
              name="password"
              id="password"
              placeholder="Contraseña"
              className="form-input"
              type="password"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Restablecer Contraseña'}
          </button>
        </form>

        <div className="form-links">
          <span>
            Si recuerdas tu contraseña, puedes{' '}
            <Link to="/login" className="form-link">
              iniciar sesión
            </Link>
          </span>
        </div>
        <div className="form-links">
          <span>
            Si aún no tienes cuenta, puedes{' '}
            <Link to="/register" className="form-link">
              registrarte
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
