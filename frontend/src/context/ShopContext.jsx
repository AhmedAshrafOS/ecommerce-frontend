import api from '../api'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios, { HttpStatusCode } from 'axios';
import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = "http://localhost:8080/api/v1";

    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [wishlistItems, setWishlistItems] = useState({});

    useEffect(() => {

        getAllProducts()
        if (!token.length > 0 && localStorage.getItem('token')) {

            setToken(localStorage.getItem('token'))

        }
        else if (token.length > 0) {
            getUserCart(token)
        }
        else {
            const saved = Cookies.get('cartItems');

            
            if (saved) {
                try {

                    let cartData = JSON.parse(saved)
                                       
                    setCartItems(cartData.filter(item=>item))

                    
                    
                } catch { }
            }
        }

    }, [token])


    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems) || {};

        if (token && token.length > 1) {
            try {
                const response = await api.post(
                    `${backendUrl}/cartItems/item`,
                    { productId: itemId, quantity: 1 }
                );

                if (response.status === HttpStatusCode.NoContent) {
                    await getUserCart(token);
                    toast.success("Item added to cart successfully!");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        } 
        else {
            if (cartData[itemId]?.quantity) {
                cartData[itemId].quantity += 1;
                cartData[itemId].totalOriginalPrice =
                    cartData[itemId].quantity * cartData[itemId].originalPrice;
                cartData[itemId].totalFinalPrice =
                    cartData[itemId].quantity * cartData[itemId].finalUnitPrice;
                                        toast.success("Item added to cart successfully!");

            } 
            else {
                try {
                    const resp = await api.get(`${backendUrl}/products/${itemId}`);
                    const prod = resp.data;
                    cartData[itemId] = {
                        productId: prod.productId,
                        productName: prod.name,
                        productImageUrl: prod.productImages[0].imageUrl,
                        originalPrice: prod.price,
                        finalUnitPrice: prod.totalFinalPrice,
                        quantity: 1,
                        totalOriginalPrice: prod.price,
                        totalFinalPrice:  prod.totalFinalPrice,
                    };
                     toast.success("Item added to cart successfully!");

                } catch (err) {
                    console.error(err);
                    toast.error("Failed to fetch product");
                    return;
                }
            }

            setCartItems(cartData);
            Cookies.set('cartItems', JSON.stringify(cartData), { expires: 7 });
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        
        let cartData = structuredClone(cartItems);
        if (token) {
            try {
               const response =  await api.patch(backendUrl + '/cartItems/item', {
                    productId: itemId,
                    quantity: quantity })
                    
                if(response.status == 204){
                        getUserCart(token)
                }
            }
            catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }else{
        cartData[itemId].quantity = quantity;
        setCartItems(cartData);
        }
    };

    const removeItemCart = async (itemId) => {
        if (token && token.length > 1) {
            
            try {
                const response = await api.delete(
                    `${backendUrl}/cartItems/item/${itemId}`
                );
                if (response.status === HttpStatusCode.NoContent) {
                    await getUserCart(token);
                    toast.success("Item removed from cart");
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        } else {
            let updated =structuredClone(cartItems);
            updated =  updated.filter(item=> item.productId !==itemId);            
            setCartItems(updated);
            Cookies.set('cartItems', JSON.stringify(updated), { expires: 7 });
        }
    };

    const getCartCount = () => {
        if(Array.isArray(cartItems)){
              return cartItems.reduce(
                (total, item) => total + (Number(item.quantity) || 0),
                0
            );
        }else{
            return 0;
        }

    }

    const getCartAmount = () => {
        if(Array.isArray(cartItems)){
        const validItems = cartItems.filter(
            item => item != null && !isNaN(Number(item.totalFinalPrice))
        );
        return validItems.reduce(
            (sum, item) => sum + Number(item.totalFinalPrice),
            0
        );
        }
        else{
            return 0
        }

    };

    const getCartSavings = () =>{
        const validItems = cartItems.filter(
            item => item != null && !isNaN(Number(item.totalFinalPrice))
        );

        return validItems.reduce(
            (sum, item) =>
                sum + (
                    Number(item.totalOriginalPrice || 0)
                    - Number(item.totalFinalPrice || 0)
                ),
            0
        );
    }

    const getAllProducts = async () => {
        try {

            const response = await axios.get(backendUrl + '/products', {
                params: {
                    page: 0,
                    size: 10,
                    sort: 'createdDate,desc'
                }
            })
            console.log(response);

            if (response.status === 200 || response.data.success) {
                setProducts(response.data.content || []);
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const getCategoryProducts = async (category) => {
        try {
            setProducts([])
            const response = await axios.get(backendUrl + '/products/category?category=' + category)
            console.log(response);

            if (response.status === 200 || response.data.success) {
                setProducts(response.data.content || []);
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const getProductById = async (productId) => {
        try {
            const resp = await axios.get(`${backendUrl}/products/${productId}`);
            return resp.data; // a ProductResponseDTO
        } catch (err) {
            toast.error("Failed to load product");
            return null;
        }
    };

    const getUserCart = async (token) => {
        if (token) {
            try {

                const response = await api.get(backendUrl + '/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === HttpStatusCode.Ok) {
                    setCartItems(response.data.cartItems);
                }
            }
            catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    };


    const addToWishlist = (id, quantity = 1) => {
        setWishlistItems((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + quantity
        }));
    };

    const removeFromWishlist = (id) => {
        setWishlistItems((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const value = {
        getCategoryProducts,
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts, getUserCart, removeItemCart,
        addToWishlist, wishlistItems, removeFromWishlist,
        getAllProducts,
        getProductById, getCartSavings
    };
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;