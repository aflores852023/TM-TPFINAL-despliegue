const ENVIROMENT = {
    URL_BACKEND: process.env.NODE_ENV === 'production'
        ? 'https://tm-tpfinal-backend-despliegue.vercel.app'
        : 'http://localhost:3000',
};

export default ENVIROMENT