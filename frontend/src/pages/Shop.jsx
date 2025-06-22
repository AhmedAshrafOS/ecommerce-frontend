import React, { useEffect,useState,useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';
import axios, { HttpStatusCode } from 'axios';

const categories = ['TABLETS', 'PHONES', 'WATCHES', 'LAPTOPS', 'TELEVISIONS', 'CAMERAS'];

const Shop = () => {
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState({});

    useEffect(() => {
    categories.forEach(async (cat) => {
      try {
        const res = await axios.get(`${backendUrl}/products/category`, {
          params: { category: cat, page: 0, size: 5 }
        });
        
        setTopProducts(prev => ({ ...prev, [cat]: res.data.content }));
      } catch (err) {
        console.error(`Failed to load ${cat}`, err);
      }
    });

  }, [backendUrl]);
  return (
    <div className="border-t pt-10 px-4 sm:px-10">
        <div className="text-left text-2xl py-2">
            <Title text1="EXPLORE" text2="CATEGORIES" />
        </div>
    
      {categories.map((category, index) => {
        return (
          <div key={index} className="my-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{category}</h2>
              <button
       
                onClick={() => navigate(`/collection?category=${category}`)}
                className="text-sm font-medium underline text-blue-600 hover:text-blue-800"
              >
                Shop this category
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topProducts[category]&&topProducts[category][0]  ? (
                topProducts[category].map((item, idx) => (
                 <ProductItem key={item.productId} id={item.productId} imageUrl={item.productImage.imageUrl} name={item.name} price={item.price} discountPercentage = {item.discountPercentage} />

                ))
              ) : (
                <p className="text-gray-400 col-span-full">No products found in this category.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Shop;
