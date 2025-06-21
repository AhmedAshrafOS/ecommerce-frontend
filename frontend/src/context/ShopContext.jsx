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
    const [addresses, setAddresses] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [wishlistData, setWishlistData] = useState([]);
    const [customerProfile, setCustomerProfile] = useState(null);

    useEffect(() => {

        getAllProducts()
        if (!token.length > 0 && localStorage.getItem('token')) {

            setToken(localStorage.getItem('token'))
            fetchProfile();
        }
        else if (token.length > 0) {
            getUserCart(token)
              fetchProfile();
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


    const fetchProfile = async () => {
        if (!token) return;
        try {
        const res = await api.get(`${backendUrl}/users/profile`);

        setCustomerProfile(res.data);
        setAddresses(res.data.addresses || []);
        } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
        }
    };

    const updateProfile = async (updateDTO) => {
        try {
        api.patch(`${backendUrl}/users/update`, updateDTO)
        toast.success("Profile updated");
        fetchProfile();
        } catch (err) {
        console.error(err);
        toast.error("Update failed");
        }
    };

    const createAddress = async (addressReq) => {
        try {
        await api.post(`${backendUrl}/addresses`, addressReq);
        toast.success("Address added");
        fetchProfile();
        } catch (err) {
        console.error(err);
        toast.error("Failed to add address");
        }
    };
    const deleteAddress = async (addressId, index) => {
        try {
        await api.get(
            `${backendUrl}/addresses/${addressId}?addressIndex=${index}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Address removed");
        fetchProfile();
        } catch (err) {
        console.error(err);
        toast.error("Failed to remove address");
        }
    };
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


    const moveToWishList = async (productId) => {
        if (token) {
        try {
            await api.post(
            `${backendUrl}/cartItems/item/toWishlist/${productId}`);
            setCartItems(cartItems.filter(item => item.productId !== productId));
            getWishlist()
            toast.success('Added to wishlist');
        } catch (err) {
            console.error(err);
            toast.error('Could not add to wishlist');
        }
        } 
        else {
        toast.info('You need to login to move to wishlist');

        }
    };

    const getWishlist = async () => {
        if (!token) return
        try {
            const res = await axios.get(
            `${backendUrl}/wishlist` 
            )
            if (res.status === 200) {
            setWishlistData(res.data)
            }
        }
        catch{
            console.error('getWishlist error', err)
            toast.error('Failed to load wishlist')
            throw err
        }
    };
    const value = {
        getCategoryProducts,
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts, getUserCart, removeItemCart,
        moveToWishList, wishlistData,setWishlistData,
        getAllProducts,
        getProductById, getCartSavings,getWishlist,
        customerProfile,
        addresses,
        fetchProfile,
        updateProfile,
        createAddress,
        deleteAddress,
    };
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;