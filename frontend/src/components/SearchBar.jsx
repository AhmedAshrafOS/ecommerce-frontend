import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SearchBar = () => {
  const { backendUrl, setShowSearch,showSearch } = useContext(ShopContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
const results = [];
    try {
      const res = await axios.get(`${backendUrl}/api/search?query=${query}`);
      const results = res.data.products || [];
      navigate('/results', { state: { results, keyword: query } });
      setShowSearch(false);
    } catch (err) {

      navigate('/results', { state: { results, keyword: query } });
      setShowSearch(false);

      toast.error('Search failed. Please try again.');
      console.error('Search failed:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return showSearch ?  (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <img
          className="w-4 cursor-pointer"
          src={assets.search_icon}
          alt="Search"
          onClick={handleSearch}
        />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt="Close"
      />
    </div>
  )
  : null;
};

export default SearchBar;
