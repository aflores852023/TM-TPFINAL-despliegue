import React from 'react';
import { Link } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching';
import ENVIROMENT from '../../../enviroment.js';
import './screen-style.css';

const ForgotPassword = () => {

  const handleSubmitLoginForm = async (e) => {
    try {
      e.preventDefault();
      const form_HTML = e.target;
      const form_Values = new FormData(form_HTML);
      const form_fields = { 'email': '' };
      const form_values_object = extractFormData(form_fields, form_Values);
      console.log(form_values_object);
      
      const body = await POST(`${ENVIROMENT.URL_BACKEND}/api/auth/forgot-password`, {
        headers: getUnnauthenticatedHeaders(),
        body: JSON.stringify(form_values_object),
      });
      
      if (!body.ok) {
        // setError()  // Manejo de errores si es necesario
      }
      console.log({ body });
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <div className="screen-container">
      <div className="screen">
        <h1 className="screen-welcome">Olvidé mi contraseña</h1>
        <p className="screen-subtitle">
          Enviaremos un correo electrónico a tu cuenta para enviarte los pasos de restablecimiento de la contraseña.
        </p>
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
              required
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
