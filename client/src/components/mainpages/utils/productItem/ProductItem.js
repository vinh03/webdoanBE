import React from "react";
import imageNotfound from "./notfoundimage/not-found.jpg";
import BtnRender from "./BtnRender";
import { formatCurrency  } from "../../utils/formatcurrency/FormatCurrency"
function ProductItem({
  product,
  isAdmin,
  deleteProduct,
  handleCheck
}) {

  return (
    <div className="product_card rounded">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img
        src={product.images.url}
        alt={product.title}
        onError={(e) => {
          e.target.src = imageNotfound;
        }}
      />
      <div className="product_box">
        <h2 className="font-bold text-xl" title={product.title}>{product.title}</h2>
        <span className="font-bold text-2xl">{formatCurrency(product.price)}</span>
        <p className="font-thin text-md">{product.content}</p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
}

export default ProductItem;
