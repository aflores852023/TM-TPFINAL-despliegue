import React from 'react';
import styles from './AlreadyVerified.module.css';

const AlreadyVerified = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Correo Ya Verificado</h1>
      <p className={styles.message}>
        Tu correo electrónico ya ha sido verificado anteriormente. Puedes iniciar sesión para continuar.
      </p>
      <a className={styles.link} href="/login">Ir a Iniciar Sesión</a>
    </div>
  );
};

export default AlreadyVerified;
