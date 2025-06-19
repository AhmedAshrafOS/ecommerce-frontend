import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const SearchResults = () => {
  const location = useLocation();
  const { results = [], keyword = '' } = location.state || {};

  return (
    <div className="pt-10 px-4 border-t">
      <div className="text-3xl mb-11 text-center">
        <Title text1="SEARCH" text2="RESULTS" />
        <p className="text-xl text-gray-500 mt-1">
          Showing results for: <span className=" font-medium">{keyword}</span>
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item, idx) => (
            <ProductItem
              key={idx}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.images}
            />
          ))}
        </div>
      ) : (
        <div className="mb-20 ">
                    <p className="text-4xl text-center text-gray-400">No products found.</p>
         </div>

    
      )}
    </div>
  );
};

export default SearchResults;
