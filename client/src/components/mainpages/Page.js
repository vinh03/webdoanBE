import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./products/Products";
import Login from "./auth/Login";
import Register from "./auth/Register";
import OrderHistory from "./history/OrderHistory";
import OrderDetail from "./history/OrderDetail";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import Cart from "./cart/Cart";
import DetailProduct from "./detailProduct/DetailProduct";

import NotFound from "./utils/not_found/NotFound";

import { GlobalState } from "../../GlobalState";
import Success from "./success/Success";
import Profile from "./profile/Profile";

function Page() {
  const state = useContext(GlobalState)
  const [isLogged] = state.userAPI.isLogged
  const [isAdmin] = state.userAPI.isAdmin
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/detail/:id" element={<DetailProduct />} />
      <Route path="/login" element={isLogged ? <NotFound/> : <Login />} />
      <Route path="/register" element={isLogged ? <NotFound/> :  <Register />} />

      <Route path="/info" element={isLogged ? <Profile/> :  <NotFound />} />

      <Route path="/category" element={isAdmin ? <Categories /> : <NotFound/> } />
      <Route path="/create_product" element={isAdmin ? <CreateProduct /> : <NotFound/> } />
      <Route path="/edit_product/:id" element={isAdmin ? <CreateProduct /> : <NotFound/> } />
      <Route path="/history" element={isLogged ? <OrderHistory /> : <NotFound/>  } />


      <Route path="/history/:id" element={isLogged ? <OrderDetail /> : <NotFound/>  } />
      <Route path="/success/:id" element={<Success />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Page
