import axios, { HttpStatusCode } from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import api from '../api'
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0); // current page
  const [totalPages, setTotalPages] = useState(0);

  const fetchList = async () => {
    try {
      const response = await api.get(backendUrl + 'api/v1/products', {

        params: {
          page: page,
          size: 5,
        }
      });

      if (response.status === HttpStatusCode.Ok) {
          const content = response.data.content;
          
          if (Array.isArray(content)&& content.length > 0) {
            setList(content);
              } else {
            setList([]);
            }
          
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page]);

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        backendUrl + `api/v1/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === HttpStatusCode.NoContent) {
        toast.success("Product deleted");
        fetchList();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
        <p className='mb-2'>All Products List</p>
        <div className='flex flex-col gap-2'>
          {/* Header Row */}
          <div className='hidden md:flex items-center justify-between py-1 px-2 border bg-gray-100 text-sm font-bold'>
            <p className='w-16'>Image</p>
            <p className='flex-1'>Name</p>
            <p className='w-28'>Category</p>
            <p className='w-28'>Brand</p>
            <p className='w-16'>Stock</p>
            <p className='w-20 text-center'>Price</p>
            <p className='w-10 text-center'>Action</p>
          </div>

          {/* Product Rows */}
          {list.map((item, index) => (
            <div
              key={index}
              className='flex flex-wrap md:flex-nowrap items-center gap-2 py-1 px-2 border text-sm'
            >
              <img className='w-12 h-12 object-cover' src={item.productImage.imageUrl||''} alt={item.name} />
              <p className='flex-1'>{item.name}</p>
              <p className='w-28'>{item.category}</p>
              <p className='w-28'>{item.brandName}</p>
              <p className='w-16'>{item.stockQuantity}</p>
              <p className='w-20 text-center'>
                {currency}
                {item.price}
              </p>
              <p
                onClick={() => removeProduct(item.productId)}
                className='w-10 text-right md:text-center cursor-pointer text-lg text-red-500'
              >
                X
              </p>
            </div>
          ))}
        </div>


      {/* Pagination Controls */}
      <div className='flex justify-center gap-2 mt-4'>
        <button
          disabled={page === 0}
          onClick={() => setPage(prev => prev - 1)}
          className='px-3 py-1 border rounded disabled:opacity-50'
        >
          Prev
        </button>
        <span className='px-3 py-1'>Page {page + 1} of {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className='px-3 py-1 border rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </>
  );
};

export default List;
