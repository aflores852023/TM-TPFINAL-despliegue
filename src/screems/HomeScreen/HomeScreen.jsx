import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthenticatedHeaders, GET, getUnnauthenticatedHeaders } from '../../fetching/http.fetching';
import useProducts from '../../Hooks/useProducts';
import '../../screems/screen-style.css'

const HomeScreen = () => {
  const user_info = JSON.parse(sessionStorage.getItem('user_info'));
  const { products, isLoadingProducts } = useProducts();

  return (
    <div className="screen-container">
      <div className="screen">
        <h1 className="screen-welcome">Bienvenido {user_info.name}</h1>
        <Link to={'/product/new'} className="screen-link">
          Crear producto
        </Link>
        
        {isLoadingProducts ? (
          <span className="screen-loading">Cargando....</span>
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </div>
  );
};

const ProductsList = ({ products }) => {
  return (
    <div className="products-list">
      {products.map(product => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
};

const Product = ({ title, price, stock, description, image_base_64, id }) => {
  return (
    <div className="product-card">
      <h2 className="product-title">{title}</h2>
      <img 
        src={image_base_64} 
        alt={title} 
        className="product-image" 
      />
      <span className="product-price">Precio: ${price}</span>
      <Link to={'/product/' + id} className="product-link">
        Ir a detalle
      </Link>
    </div>
  );
};

export default HomeScreen;
