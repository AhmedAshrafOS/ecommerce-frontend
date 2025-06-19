import React from 'react';

const Banner = ({ image, alt = 'Promo Banner', link = null }) => {
  const content = (
    <img
      src={image}
      alt={alt}
      className="w-full object-cover rounded-md shadow-md"
    />
  );

  return (
    <div className="my-10 px-4 sm:px-8">
      {link ? <a href={link} target="_blank" rel="noopener noreferrer">{content}</a> : content}
    </div>
  );
};

export default Banner;
