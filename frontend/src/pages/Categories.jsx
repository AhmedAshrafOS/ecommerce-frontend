// src/pages/CategoriesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Tablets', image: 'https://images.unsplash.com/photo-1622531636820-5d727319e45d?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Phones', image: 'https://images.unsplash.com/photo-1727941035071-910fd07135bb?q=80&w=3176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1684234737917-5c6f223a8a8f?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Televisions', image: 'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Cameras', image: 'https://images.unsplash.com/photo-1470940511639-1068d7764233?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    navigate(`/collection?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {categories.map((cat, idx) => (
        <div
          key={idx}
          className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition-all"
          onClick={() => handleClick(cat.name)}
        >
          <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover  rounded-t-lg" />
          <div className="p-4 bg-transparent text-center font-semibold text-gray-700">{cat.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
