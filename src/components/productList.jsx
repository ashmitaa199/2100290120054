import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import Filters from './Filters';

const ProductList = ({ topN }) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    company: '',
    rating: '',
    priceRange: '',
    availability: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`API_URL/products?limit=${topN}`);
        const uniqueProducts = response.data.map((product, index) => ({
          ...product,
          uniqueId: `${product.company}-${product.category}-${index}`
        }));
        setProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [topN]);

  const filteredProducts = products.filter(product => {
    return (
      (!filters.category || product.category === filters.category) &&
      (!filters.company || product.company === filters.company) &&
      (!filters.rating || product.rating >= filters.rating) &&
      (!filters.priceRange || (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1])) &&
      (!filters.availability || product.available === (filters.availability === 'available'))
    );
  });

  return (
    <div className="container">
      <h1 className="my-4">Top {topN} Products</h1>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="row">
        {filteredProducts.map(product => (
          <ProductItem key={product.uniqueId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;