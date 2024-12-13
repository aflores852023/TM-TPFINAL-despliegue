import React from 'react';
import styles from './VerificationSuccess.module.css';

const VerificationSuccess = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>¡Verificación Exitosa!</h1>
      <p className={styles.message}>
        Tu correo electrónico ha sido verificado con éxito. Ahora puedes iniciar sesión y explorar nuestras funcionalidades.
      </p>
      <a className={styles.link} href="/login">Ir a Iniciar Sesión</a>
    </div>
  );
};

export default VerificationSuccess;
