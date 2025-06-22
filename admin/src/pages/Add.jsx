import React, { useState } from 'react'
import { assets } from '../assets/assets';
import axios from 'axios';
import api from '../api';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [specs, setSpecs] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [category, setCategory] = useState("Tablets")
  const [brand, setBrand] = useState("Apple")

  const categoryFilters = {
        Tablets: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
        Phones: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
        Watches: ['Rolex', 'Armani', 'Bedding'],
        Laptops: ['Apple', 'HP', 'Acer', 'Asus','Dell'],
        Televisions: ['Samsung', 'LG', 'Sony', 'Apple'],
        Cameras: ['Sony', 'Canon', 'Nikon', 'Fujifilm'],
    };


  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const imagesUrls = [image1, image2, image3, image4].filter(image => image !== false);

      formData.append("name", name)
      formData.append("features", features)
      formData.append("specs", specs)
      formData.append("price", price)
      formData.append("stockQuantity", stockQuantity)
      formData.append("category", category.toUpperCase())
      formData.append("brandName", brand)
      formData.append("lowStockThreshold", 5)
      
    imagesUrls.forEach(image => {
        formData.append("imagesUrls", image);
      });
      
      const response = await api.post(
        `${backendUrl}api/v1/products`,
        formData
      );
      if(response.status === 201){
        toast.success("Product added successfully")
        setName('')
        setFeatures('')
        setSpecs('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setStockQuantity('')
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch (error){
      console.log(error);
      toast.error(error.message)
    }
  }
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 mb-[5vh]' action="">
      <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-2 gap-8 overflow-hidden'>
          <label htmlFor="image1" className='col-span-1'>
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=> setImage1(e.target.files[0])} type="file" id='image1' />
          </label>
          <label htmlFor="image2" className='col-span-1'>
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e)=> setImage2(e.target.files[0])} type="file" id='image2' />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e)=> setImage3(e.target.files[0])} type="file" id='image3' />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e)=> setImage4(e.target.files[0])} type="file" id='image4' />
          </label>
        </div>

    <div className='w-full'>
      <p className='mb-2'>Product name</p>
      <input onChange={(e)=> setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 ' type="text" placeholder='Type here' required/>
    </div>
    <div className='w-full'>
      <p className='mb-2'>Product features</p>
      <textarea onChange={(e)=> setFeatures(e.target.value)} value={features} className='w-full max-w-[500px] px-3 py-2 ' type="text" placeholder='Write features here' required/>
    </div>
        <div className='w-full'>
      <p className='mb-2'>Product specs</p>
      <textarea onChange={(e)=> setSpecs(e.target.value)} value={specs} className='w-full max-w-[500px] px-3 py-2 ' type="text" placeholder='Write specs here' required/>
    </div>
    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

      {/* Product Category */}
      <div>
        <p className='mb-2'>Product category</p>
        <select onChange={(e) => {
          setCategory(e.target.value);
          setBrand(categoryFilters[e.target.value][0]); 
        }} value={category} className='w-full px-3 py-2'>
          {Object.keys(categoryFilters).map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Brand (Dependent) */}
      <div>
        <p className='mb-2'>Brand name</p>
        <select onChange={(e) => setBrand(e.target.value)} value={brand} className='w-full px-3 py-2'>
          {categoryFilters[category]?.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>
      </div>


      <div>
        <p className='mb-2'>Product price</p>
        <input onChange={(e)=> setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder="25" />
      </div>
            <div>
        <p className='mb-2'>Product stock</p>
        <input onChange={(e)=> setStockQuantity(e.target.value)} value={stockQuantity} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder="100" />
      </div>
    </div>


    <button className='w-28 py-3 mt-4 bg-black text-white over'>ADD</button>

    </form>
  )
}

export default Add;
