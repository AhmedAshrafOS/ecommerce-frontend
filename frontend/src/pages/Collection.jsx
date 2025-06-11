import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const useQuery = () => new URLSearchParams(useLocation().search);

const categoryFilters = {
  Tablets: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
  Phones: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
  Watches: ['Rolex', 'Armani', 'Bedding'],
  Laptops: ['Apple', 'HP', 'Acer', 'Asus','Dell'],
  Televisions: ['Samsung', 'LG', 'Sony', 'Apple'],
  Cameras: ['Sony', 'Canon', 'Nikon', 'Fujifilm'],
};

const Collection = () => {
  const query = useQuery();
  const urlCategory = query.get('category');

  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toggleSubCategory = (e) => {
    const value = e.target.value;

    
    if (subcategory.includes(value)) {
      setSubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subcategory.length > 0) {
             

      productsCopy = productsCopy.filter((item) =>
        
        subcategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let sorted = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(sorted.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(sorted.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

useEffect(() => {
  if (urlCategory) {
    setCategory([urlCategory]);
    setSubCategory([]); // Reset subcategories when main category changes
  }
}, [urlCategory]);

  useEffect(() => {
    applyFilter();
  }, [category, subcategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const subcategoriesToShow =
    urlCategory && categoryFilters[urlCategory]
      ? categoryFilters[urlCategory]
      : [];

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
        </p>
        <img
          className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
          src={assets.dropdown_icon}
          alt=""
        />

        {/* Category Display */}
        <div
          className={`border border-gray-300 p-4 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORY</p>
          <div className="text-sm text-gray-700 font-light">
            <span className="bg-gray-200 px-2 py-1 rounded text-gray-600">
              {urlCategory || 'All'}
            </span>
          </div>
        </div>

        {/* Subcategory Filters */}
        {subcategoriesToShow.length > 0 && (
          <div
            className={`border border-gray-300 p-4 py-3 mt-6 ${
              showFilter ? '' : 'hidden'
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">FILTER BY TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {subcategoriesToShow.map((subcat, idx) => (
                <label key={idx} className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={subcat}
                    onChange={toggleSubCategory}
                  />
                  {subcat}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Display */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={'ALL'} text2={'PRODUCTS'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.images}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
