import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';



export const ShopContext = createContext(); 




const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = "http://localhost:4000"; // Change this to your backend URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [wishlistItems, setWishlistItems] = useState({});
    const navigate = useNavigate();

    const addToCart = async (itemId) => {


        
        let cartData = structuredClone(cartItems) || {};
        
 
        
            if (cartData[itemId] && cartData[itemId].quantity) {
                cartData[itemId].quantity += 1;
            } else {
                cartData[itemId] = { quantity: 1 };
            }
        setCartItems(cartData);
        if(token){
            try{

                console.log(backendUrl + '/api/cart/add');
                
                await axios.post(backendUrl + '/api/cart/add', {itemId}, {headers:{token}})
            }
            catch(error){
                console.log(error);
                toast.error(error.message)
            }
        }
        
    }
       
    const getCartCount = () => {
        let totalCount = 0;
       
      
        for(const item in cartItems){
            if(cartItems[item].quantity > 0){
                totalCount += cartItems[item].quantity;
            }
            
        }
        return totalCount;
    }
    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId].quantity= quantity;
        setCartItems(cartData);
        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/update', {itemId, quantity}, {headers: {token}})
            }
            catch(error){
                console.log(error);
                toast.error(error.message)
            }
        }
    }
    const removeItemCart = async (itemId) => {
            
        const updatedCartItems = { ...cartItems };

        delete updatedCartItems[itemId];
        setCartItems(updatedCartItems);
      

        
        if(token){
            try{
                
                await axios.delete(backendUrl + '/api/cart/delete', {
                data: { itemId },
                headers: { token }
                })

            }
            catch(error){
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
                catch (error){

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch (error){
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try{
            
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}})
              for(const item in response.data.message){
             console.log(response.data.message[item]);
             console.log( typeof response.data.message[item]);
             
        
              }
     
            console.log("-----------");
            if(response.data.success){
                setCartItems(response.data.message);
            }
        }
        catch (error){
            console.log(error)
            toast.error(error.message)
        }
    }

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

    useEffect(()=>{
        getProductsData()
    }, [token])

    useEffect(()=>{
        
        if(!token && localStorage.getItem('token')){
            
            setToken(localStorage.getItem('token'))
         
        }
        else{
            getUserCart(token);
        }

    }, [token])

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts,getUserCart,removeItemCart,
        addToWishlist, wishlistItems, removeFromWishlist
    } 
    return ( 
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider> 
    ) 
} 
export default ShopContextProvider;