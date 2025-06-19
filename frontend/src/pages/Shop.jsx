import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const categories = ['TABLETS', 'PHONES', 'WATCHES', 'LAPTOPS', 'TELEVISIONS', 'CAMERAS'];

const Shop = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="border-t pt-10 px-4 sm:px-10">
        <div className="text-left text-2xl py-2">
            <Title text1="EXPLORE" text2="CATEGORIES" />
        </div>
 
      {categories.map((category, index) => {
        const categoryProducts = products
          .filter((p) => p.category === category)
          .slice(0, 5);

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
              {categoryProducts.length > 0 ? (
                categoryProducts.map((item, idx) => (
                 <ProductItem key={index} id={item.productId} imageUrl={item.productImage.imageUrl} name={item.name} price={item.price} discountPercentage = {item.discountPercentage} />

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
