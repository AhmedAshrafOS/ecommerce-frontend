import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { backendUrl, setShowSearch, showSearch } = useContext(ShopContext);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    setShowSearch(false);
    // start at page 0, showing 12 results per page (adjust as you like)
    navigate(
      `/search-results?keyword=${encodeURIComponent(query)}&page=0&size=12`
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!showSearch) return null;
  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-inherit outline-none text-sm"
        />
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 cursor-pointer"
          onClick={handleSearch}
        />
      </div>
      <img
        src={assets.cross_icon}
        alt="Close"
        className="inline w-3 cursor-pointer"
        onClick={() => setShowSearch(false)}
      />
    </div>
  );
};

export default SearchBar;
