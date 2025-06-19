import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useLocation }                     from 'react-router-dom';
import { ShopContext }                     from '../context/ShopContext';
import Title                               from '../components/Title';
import ProductItem                         from '../components/ProductItem';

const useQuery = () => new URLSearchParams(useLocation().search);

const categoryFilters = {
  TABLETS:    ['Apple','Samsung','Xiaomi','Oppo'],
  PHONES:     ['Apple','Samsung','Xiaomi','Oppo'],
  WATCHES:    ['Rolex','Armani','Bedding'],
  LAPTOPS:    ['Apple','HP','Acer','Asus','Dell'],
  TELEVISIONS:['Samsung','LG','Sony','Apple'],
  CAMERAS:    ['Sony','Canon','Nikon','Fujifilm'],
};

const Collection = () => {
  const query       = useQuery();
  const urlCategory = query.get('category');
  const {
    getCategoryProducts,
    products,
    currency,
    search,
    showSearch
  } = useContext(ShopContext);

  const [showFilter,   setShowFilter]   = useState(false);
  const [filtered,     setFiltered]     = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [sortType,     setSortType]     = useState('relevant');

  // 1) on category change
  useEffect(() => {
    if (urlCategory) {
      getCategoryProducts(urlCategory);
      setBrandFilters([]);
    }
  }, [urlCategory]);

  // 2) apply search & brand filters
  useEffect(() => {
    let list = [...products];
    if (showSearch && search) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (brandFilters.length) {
      list = list.filter(p =>
        brandFilters.includes(p.brandName)
      );
    }
    setFiltered(list);
  }, [products, search, showSearch, brandFilters]);

  // 3) derive sorted list, not state
  const sortedProducts = useMemo(() => {
    const copy = [...filtered];
    if (sortType === 'low-high')  copy.sort((a,b)=>a.price-b.price);
    if (sortType === 'high-low') copy.sort((a,b)=>b.price-a.price);
    return copy;
  }, [filtered, sortType]);

  // toggle a brand checkbox
  const toggleBrand = e => {
    const v = e.target.value;
    setBrandFilters(prev =>
      prev.includes(v)
        ? prev.filter(x => x !== v)
        : [...prev, v]
    );
  };

  const brandsToShow = categoryFilters[urlCategory] || [];

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t">
      {/* ─── Filters Sidebar ─── */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(f => !f)}
          className="mb-2 text-xl cursor-pointer flex items-center gap-2"
        >
          FILTERS
        </p>
        <div className={`${showFilter?'':'hidden'} sm:block`}>
          <div className="border p-4 mb-6">
            <p className="mb-2 text-sm font-medium">CATEGORY</p>
            <span className="bg-gray-200 px-2 py-1 rounded text-gray-600">
              {urlCategory || 'All'}
            </span>
          </div>
          {brandsToShow.length>0 && (
            <div className="border p-4">
              <p className="mb-2 text-sm font-medium">FILTER BY BRAND</p>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {brandsToShow.map((b,i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      value={b}
                      onChange={toggleBrand}
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Products Grid ─── */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <Title text1="ALL" text2="PRODUCTS" />
          <select
            value={sortType}
            onChange={e => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 py-1"
          >
            <option value="relevant">Relevant</option>
            <option value="low-high">Low → High</option>
            <option value="high-low">High → Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map(item => (
            <ProductItem
              key={item.productId}
              id={item.productId}
              imageUrl={item.productImage.imageUrl}
              name={item.name}
              price={item.price}
              discountPercentage={item.discountPercentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
