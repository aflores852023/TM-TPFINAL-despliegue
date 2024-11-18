import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuthenticatedHeaders, GET, getUnnauthenticatedHeaders} from '../../fetching/http.fetching'
import useProducts from '../../Hooks/useProducts'




const HomeScreen = () => {
	const user_info = JSON.parse(sessionStorage.getItem('user_info'))
	const {products, isLoadingProducts} = useProducts()
	console.log(products)

	return (
		<div>
			<h1>Bienvenido {user_info.name}</h1>
			<Link to={'/product/new'}>Crear producto</Link>
			{
				isLoadingProducts 
				? <span>Cargando....</span>
				: <ProductsList products={products}/>
			}
		</div>
	)
}

const ProductsList = ({products}) => {

	return (
		products.map(product => {
			return <Product 
				key={product.id} 
				{...product}
			/>
		})
	)
}

const Product = ({title, price, stock, description, image_base_64, id}) => {

	return (
		<div>
			<h2>{title}</h2>
			<img 
                    src={image_base_64} 
                    alt={title} 
                    width={'200'} 
                />
			<span>Precio: ${price}</span>
			<Link to={'/product/' + id}>Ir a detalle</Link>
		</div>
	)
}

export default HomeScreen