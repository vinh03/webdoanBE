import React, { useContext, useState } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/loading/Loading";
import Filter from "./Filter";
import LoadMore from "./LoadMore";
import Swal from "sweetalert2";

function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = await axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );

      const destroyProduct = await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });

      // await destroyImg;
      // await destroyProduct;

      Swal.fire({
        position: "center",
        icon: "success",
        title: destroyImg.data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: destroyProduct.data.msg,
        showConfirmButton: false,
        timer: 1500,
      });

      setCallback(!callback);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.msg,
      });
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <>
      <Filter />
      {isAdmin && (
        <div className="delete-all">
          <span>Chọn tất cả</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Xóa tất cả</button>
        </div>
      )}

      <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 justify-between">
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
}

export default Products;
