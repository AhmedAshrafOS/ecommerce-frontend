import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Collection from './pages/Collection'; 
import Categories from './pages/Categories'; 
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerfiyEmail';
import SearchBar from './components/SearchBar';
import SearchResults from './pages/SearchResults';
import { ToastContainer, toast ,Slide} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSuccess from './pages/OrderSuccess';
import CustomerProfile from './pages/CustomerProfile';
import ResetPassword from './pages/ResetPassword';
const App = () => {
  return (
    <>
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        transition={Slide} 
      />
      <NavBar />
      <SearchBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/orders/:orderId" element={<OrderSuccess />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
   
    </div>
    <br/>
       <Footer/>
    </>

  );
};

export default App;
