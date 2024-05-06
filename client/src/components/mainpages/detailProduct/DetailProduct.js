import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import { formatCurrency } from "../utils/formatcurrency/FormatCurrency";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const addCart = state.userAPI.addCart;
  const [products] = state.productsAPI.products;
  const [detailProduct, setDetailProduct] = useState([]);

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailProduct(product);
      });
    }
  }, [params.id, products]);

  if (detailProduct.length === 0) return null;

  return (
    <>
      <div className="detail">
        {detailProduct.images && <img className="rounded-lg shadow-xl" src={detailProduct.images.url} alt="" />}
        <div className="box-detail">
          <div className="row">
            <h2 className="font-bold">{detailProduct.title}</h2>
            <h6 className="text-sm font-bold5">#id: {detailProduct.product_id}</h6>
          </div>
          <span className="detail-price">{formatCurrency(detailProduct.price)}</span>
          <p>{detailProduct.description}</p>
          <p className="font-normal">{detailProduct.content}</p>
          <p className="detail-sold">Đã bán: {detailProduct.sold}</p>
          <Link
            to="/cart"
            className="px-6 py-2 bg-green-600 rounded-lg text-white max-w-fit flex shadow-lg"
            onClick={() => addCart(detailProduct)}
          >
            Mua ngay
          </Link>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 justify-between">
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
