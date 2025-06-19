import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProviderrrr = ({ children }) => {
  const backendUrl = "http://localhost:8080/api/v1";
  const currency = "$";
  const delivery_fee = 10;

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState({});
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  // ensure axios always sends our JWT
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
    localStorage.setItem("token", token);
  }, [token]);

  // --- AUTH ---
  const login = async (credentials) => {
    try {
      const resp = await axios.post(`${backendUrl}/auth/login`, credentials, {
        withCredentials: true,
      });
      setToken(resp.data.token);
      toast.success("Logged in!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const register = async (userInfo) => {
    try {
      await axios.post(`${backendUrl}/auth/register`, userInfo, {
        withCredentials: true,
      });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try {
      setToken("");
      setCartItems({});
      toast.info("Logged out");
      navigate("/login");
      await axios.api(`${backendUrl}/auth/logout`, {}, { withCredentials: true });

    } catch (err) {
      console.log('Error happend while delete refresh token', err);
      
    }
  };

  // --- PRODUCTS ---
  const fetchProducts = async (params = {}) => {
    try {
      const resp = await axios.get(`${backendUrl}/products`, { params });
      setProducts(resp.data.content || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  // --- CART ---
  const fetchCart = async () => {
    if (!token) return;
    try {
      const resp = await axios.get(`${backendUrl}/cart`);
      setCartItems(resp.data.items || {});
    } catch {
      toast.error("Cannot load cart");
    }
  };

    // --- CART ---
  const addToCart = async (productId, qty = 1) => {
    setCartItems((c) => ({ ...c, [productId]: (c[productId] || 0) + qty }));
    if (!token) return;
    try {
      await axios.post(`${backendUrl}/cart/add`, { productId, quantity: qty });
      toast.success("Added to cart");
    } catch {
      toast.error("Cart update failed");
    }
  };

  const updateCart = async (productId, quantity) => {
    setCartItems((c) => ({ ...c, [productId]: quantity }));
    if (!token) return;
    try {
      await axios.patch(`${backendUrl}/cart/update`, { productId, quantity });
    } catch {
      toast.error("Cart update failed");
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((c) => {
      const copy = { ...c };
      delete copy[productId];
      return copy;
    });
    if (!token) return;
    try {
      await axios.delete(`${backendUrl}/cart/remove`, { data: { productId } });
      toast.info("Removed from cart");
    } catch {
      toast.error("Remove failed");
    }
  };

  // --- WISHLIST ---
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const resp = await axios.get(`${backendUrl}/wishlist`);
      setWishlistItems(resp.data.items || {});
    } catch {
      toast.error("Cannot load wishlist");
    }
  };

  const addToWishlist = async (productId) => {
    setWishlistItems((w) => ({ ...w, [productId]: true }));
    if (!token) return;
    try {
      await axios.post(`${backendUrl}/wishlist/add`, { productId });
      toast.success("Added to wishlist");
    } catch {
      toast.error("Wishlist failed");
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems((w) => {
      const copy = { ...w };
      delete copy[productId];
      return copy;
    });
    if (!token) return;
    try {
      await axios.delete(`${backendUrl}/wishlist/remove`, { data: { productId } });
      toast.info("Removed from wishlist");
    } catch {
      toast.error("Wishlist remove failed");
    }
  };

  // --- ORDERS ---
  const fetchOrders = async (params = {}) => {
    if (!token) return;
    try {
      const resp = await axios.get(`${backendUrl}/orders`, { params });
      setOrders(resp.data.content || []);
    } catch {
      toast.error("Cannot load orders");
    }
  };

  const placeOrder = async (orderData) => {
    if (!token) return;
    try {
      const resp = await axios.post(`${backendUrl}/orders/place`, orderData);
      toast.success("Order placed!");
      navigate(`/orders/${resp.data.orderNumber}`);
    } catch {
      toast.error("Order failed");
    }
  };

  const rateOrderItem = async ({ orderNumber, itemName, rating }) => {
    if (!token) return;
    try {
      await axios.post(`${backendUrl}/orders/${orderNumber}/rate`, { itemName, rating });
      toast.success("Thank you for rating!");
    } catch {
      toast.error("Rating failed");
    }
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchProducts();
  }, [token]);

  // useEffect(() => {
  //   fetchCart();
  //   fetchWishlist();
  //   fetchOrders({ page: 0, size: 5 });
  // }, [token]);

  return (
    <ShopContext.Provider
      value={{
        backendUrl,
        currency,
        delivery_fee,
        token,
        setToken,
        login,
        register,
        logout,
        products,
        fetchProducts,
        cartItems,
        fetchCart,
        addToCart,
        updateCart,
        removeFromCart,
        wishlistItems,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        orders,
        fetchOrders,
        placeOrder,
        rateOrderItem,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        navigate,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// export default ShopContextProvider;
