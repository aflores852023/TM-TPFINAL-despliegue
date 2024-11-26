import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import ENVIROMENT from '../../../enviroment.js';
import '../../screems/screen-style.css'

const ResetPassword = () => {
  const { reset_token } = useParams();

  const handleSubmitResetForm = (e) => {
    e.preventDefault();
    const form_HTML = e.target;
    const form_Values = new FormData(form_HTML);
    const form_fields = {
      password: ''
    };

    const form_values_object = extractFormData(form_fields, form_Values);
    fetch(`${ENVIROMENT.URL_BACKEND}/api/auth/reset-password/` + reset_token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json' // Aca le indicamos al back que lo que enviamos es un JSON
      },
      body: JSON.stringify(form_values_object)
    })
      .then((response) => {
        console.log({ response });
        return response.json();
      })
      .then((body) => {
        if (!body.ok) {
          // setError() (Podrías manejar el error de una forma más detallada)
        }
        console.log({ body });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="screen-container">
      <div className="screen">
        <h1 className="screen-title">Restablecer Contraseña</h1>
        <p className="screen-description">
          Completa el formulario con la nueva contraseña para restablecerla.
        </p>
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
          <button type="submit" className="submit-button">
            Restablecer Contraseña
          </button>
        </form>
        <div className="form-links">
          <span>
            Si recuerdas tu contraseña, puedes <Link to="/login" className="form-link">iniciar sesión</Link>
          </span>
        </div>
        <div className="form-links">
          <span>
            Si aún no tienes cuenta, puedes <Link to="/register" className="form-link">registrarte</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
