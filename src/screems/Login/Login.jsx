import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching'

const Login = () => {	
	const navigate = useNavigate()

	const handleSubmitLoginForm = async (e) => {
		try{
			e.preventDefault()
			const form_HTML = e.target
			const form_Values = new FormData(form_HTML)
			const form_fields = {
				'email': '',
				'password': ''
			}
			const form_values_object = extractFormData(form_fields, form_Values)
			const response = await POST(
				'http://localhost:3000/api/auth/login',
				{
					headers: getUnnauthenticatedHeaders(),
					body: JSON.stringify(form_values_object)
				} 
			)
			const access_token = response.payload.token
			sessionStorage.setItem('access_token', access_token)
			sessionStorage.setItem('user_info', JSON.stringify(response.payload.user))
			navigate('/home')
		}
		catch(error){
			//manejan sus errores
		}
	}

	return (
		<div>
			<h1>Inicia sesion</h1>
			<form onSubmit={handleSubmitLoginForm}>
				<div>
					<label htmlFor='email'>Ingrese su email:</label>
					<input name='email' id='email' placeholder='pepe@gmail.com' />
				</div>
				<div>
					<label htmlFor='password'>Ingrese su contraseña:</label>
					<input name='password' id='password' placeholder='pepe@gmail.com' />
				</div>
				<button type='submit'>Iniciar sesion</button>
			</form>
			<span>Si aun no tienes cuenta puedes <Link to='/register'>Registrarte</Link></span>
			<br />
			<span>Has olvidado la contraseña? <Link to='/forgot-password'>Restablecer</Link></span>

		</div>
	)
}

export default Login