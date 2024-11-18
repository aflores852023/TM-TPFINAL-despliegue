import React from 'react'
import { Link } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import { POST, getUnnauthenticatedHeaders} from '../../fetching/http.fetching'



const ForgotPassword = () => {

	const handleSubmitLoginForm = async (e) => {
		try {
			e.preventDefault()
			const form_HTML = e.target
			const form_Values = new FormData(form_HTML)
			const form_fields = {
				'email': ''
			}
			const form_values_object = extractFormData(form_fields, form_Values)
			console.log(form_values_object)
			const body = await POST('http://localhost:3000/api/auth/forgot-password', 
			{
				headers: getUnnauthenticatedHeaders(),
				body: JSON.stringify(form_values_object)
			})
			//const body = await sendEmailForgot(form_values_object)
			//Si hubiera algun error, lo imprimen usando el valor de body
			//Por ejemplo, pueden cambiar el estado para que aparezca un error
			//De ser necesario cambien como responde su backend
			if (!body.ok) {
				//setError()
			}
			console.log({ body })
		}
		catch (error){
			//Errores se manejan aqui
		}
	}

	return (
		<div>
			<h1>Olvide mi contraseña</h1>
			<p>Enviaremos un mail a tu email de usuario para enviarte los pasos de restablecimiento de la contraseña.</p>
			<form onSubmit={handleSubmitLoginForm}>
				<div>
					<label htmlFor='email'>Ingrese su email:</label>
					<input name='email' id='email' placeholder='pepe@gmail.com' />
				</div>
				<button type='submit'>Enviar mail</button>
			</form>
			<span>Si tienes cuenta puedes <Link to='/login'>iniciar sesion</Link></span>
			<span>Si aun no tienes cuenta puedes <Link to='/register'>Registrarte</Link></span>

		</div>
	)
}

export default ForgotPassword