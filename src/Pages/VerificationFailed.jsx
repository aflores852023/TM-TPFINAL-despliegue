import React from 'react';
import styles from './VerificationFailed.module.css';

const VerificationFailed = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verificación Fallida</h1>
      <p className={styles.message}>
        No pudimos verificar tu correo electrónico. Esto podría deberse a que el enlace ha expirado o ya fue utilizado.
      </p>
      <a className={styles.link} href="/register">Reintentar Registro</a>
    </div>
  );
};

export default VerificationFailed;
