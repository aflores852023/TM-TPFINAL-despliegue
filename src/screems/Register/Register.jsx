import React from 'react'
import { Link } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import useForm from '../../Hooks/useForm'
import { POST, getUnnauthenticatedHeaders } from '../../fetching/http.fetching'


const Register = () => {

    const form_fields = {
        'name': '',
        'email': '',
        'password': ''
    }
    const {form_values_state, handleChangeInputValue} = useForm(form_fields)
    //form_values_state.valor = 'pepe' esto esta MAL porque es un estado

    const handleSubmitRegisterForm =async (event) => {
        event.preventDefault()
        const form_HTML = event.target

        const body = await POST(
            'http://localhost:3000/api/auth/register',
            {
                headers: getUnnauthenticatedHeaders(),
                body: JSON.stringify(form_values_object)
            }
        )
        console.log(body)
    }
    return (
        <div>
            <h1>Registrate en nuesta web</h1>
            <form onSubmit={handleSubmitRegisterForm}>
                <div>
                    <label htmlFor='name'>Ingrese su nombre:</label>
                    <input 
                        name='name' 
                        id='name' 
                        placeholder='Pepe Suarez' 
                        onChange={handleChangeInputValue} 
                    />
                </div>
                <div>
                    <label htmlFor='email'>Ingrese su email:</label>
                    <input 
                        name='email' 
                        id='email' 
                        placeholder='pepe@gmail.com' 
                        onChange={handleChangeInputValue} 
                    />
                </div>
                <div>
                    <label htmlFor='password'>Ingrese su contraseña:</label>
                    <input 
                        name='password' 
                        id='password' 
                        placeholder='pepe@gmail.com' 
                        onChange={handleChangeInputValue} 
                    />
                </div>
                <button type='submit'>Registrar</button>
            </form>
            <span>Si ya tienes cuenta puedes ir a <Link to='/login'>login</Link></span>

        </div>
    )
}

export default Register