import React, { useContext, useEffect, useState } from 'react';
import { useParams }                                from 'react-router-dom';
import axios                                        from 'axios';
import { ShopContext }                              from '../context/ShopContext';
import { assets }                                   from '../assets/assets';
import RelatedProducts                              from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const {
    backendUrl,
    currency,
    addToCart,
    getCategoryProducts
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage]             = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await axios.get(
          `${backendUrl}/products/${productId}`
        );
        const data = resp.data; // ProductResponseDetailsDTO
          console.log(resp.data);
          
        setProductData(data);
        setImage(data.productImages[0]?.imageUrl || '');
        // preload related products
        getCategoryProducts(data.category);
      } catch (err) {
        console.error('Failed to fetch product details', err);
      }
    };
    load();
  }, [productId, backendUrl]);

  if (!productData) {
    // you can replace this with a spinner if you like
    return <div className="pt-20 text-center">Loading…</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Left Section: Images */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[20%] w-full gap-2">
            {productData.productImages.map((img, idx) => (
              <img
                key={idx}
                onClick={() => setImage(img.imageUrl)}
                src={img.imageUrl}
                className={`w-24 h-24 object-cover cursor-pointer border ${
                  image === img.imageUrl
                    ? 'border-orange-500'
                    : 'border-gray-200'
                }`}
                alt={`Thumbnail ${idx + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              className="w-full h-auto border border-gray-200"
              alt="Main Product"
            />
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">
            {productData.name}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            {/* simple 4 filled stars + 1 dull, adjust per averageRating if desired */}
            {[1,2,3,4].map(i => (
              <img key={i} src={assets.star_icon} className="w-3.5" alt="Star" />
            ))}
            <img src={assets.star_dull_icon} className="w-3.5" alt="Dull Star" />
            <p className="pl-2">{productData.reviewCount}</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price.toFixed(2)}
          </p>
          <p className="mt-5 text-gray-500">
            {productData.features}
          </p>

          <button
            onClick={() => addToCart(productData.productId)}
            className="relative group overflow-hidden bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-6"
          >
            <span className="absolute inset-0 bg-red-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10">ADD TO CART</span>
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Specs: {productData.specs}</p>
            <p>Stock: {productData.stockQuantity}</p>
            <p>Brand: {productData.brandName}</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">
            Reviews ({productData.reviewCount})
          </p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{productData.features}</p>
          <p>{productData.specs}</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        brand={productData.brandName}
      />
    </div>
  );
};

export default Product;
