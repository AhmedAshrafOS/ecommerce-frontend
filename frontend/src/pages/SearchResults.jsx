import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const SearchResults = () => {
  const { backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const pageNum = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "12", 10);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${backendUrl}/search`, {
        params: { keyword, page: pageNum, size: pageSize },
      });
      console.log(res.data);
      
      const pageData = res.data;
      setResults(pageData.content || []);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      toast.error("Search failed. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
    console.log(results);
    
  }, [keyword, pageNum, pageSize]);

  const goToPage = (newPage) => {
    setSearchParams({ keyword, page: newPage, size: pageSize });
  };

  return (
    <div className="pt-10 px-4 border-t">
      <div className="text-3xl mb-11 text-center">
        <Title text1="SEARCH" text2="RESULTS" />
        <p className="text-xl text-gray-500 mt-1">
          Showing results for: <span className="font-medium">{keyword}</span>
        </p>
      </div>

      {results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((item) => (
              <ProductItem
                key={item.productId}
                id={item.productId}
                imageUrl={item.productImage?.imageUrl}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => goToPage(Math.max(pageNum - 1, 0))}
              disabled={pageNum === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {pageNum + 1} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(Math.min(pageNum + 1, totalPages - 1))}
              disabled={pageNum + 1 >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="mb-20">
          <p className="text-4xl text-center text-gray-400">
            No products found.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
