import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { FaStripe } from "react-icons/fa";
import { formatCurrency } from "../utils/formatcurrency/FormatCurrency";
import { TruncatedText } from "../utils/truncated/TruncatedText";
import Swal from "sweetalert2";

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const addToCart = async (updatedCart) => {
    await axios.patch(
      "/user/addcart",
      { cart: updatedCart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const handleCheckout = async () => {
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.title,
          images: [item.images.url],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    try {
      // Create a checkout session
      const { data } = await axios.post(
        "/api/payment",
        { lineItems },
        {
          headers: { Authorization: token },
        }
      );

      // Initialize Stripe
      const stripe = await stripePromise;

      // Redirect to Checkout
      await stripe.redirectToCheckout({ sessionId: data.id });

      // setCart([])
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce(
        (prev, item) => prev + item.price * item.quantity,
        0
      );
      setTotal(total);
    };
    getTotal();
  }, [cart]);

  const increment = (id) => {
    const updatedCart = cart.map((item) => ({
      ...item,
      quantity: item._id === id ? item.quantity + 1 : item.quantity,
    }));
    setCart(updatedCart);
    addToCart(updatedCart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };
  const removeProduct = (id) => {
    Swal.fire({
      title: "Bạn muốn xóa sản phẩm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter((item) => item._id !== id);
        Swal.fire({
          title: "Deleted!",
          text: "Xóa sản phẩm thành công.",
          icon: "success",
        });
        setCart(updatedCart);
        addToCart(updatedCart);
        window.location.href = "/";
      }
    });
    // if (window.confirm("Bạn có chắc muốn xóa sản phẩm?")) {
    // }
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Giỏ hàng trống</h2>
    );
  return (
    <div>
      {cart.map((product) => (
        <div
          className="flex relative items-center border-2 my-4 rounded-lg"
          key={product._id}
        >
          <img
            className="max-w-[20%] w-[100%] max-h-64 rounded-lg m-3"
            src={product.images?.url}
            alt=""
          />
          <div className="box-detail flex flex-col gap-2">
            <div className="">
              <h2 className="font-semibold ">{product.title}</h2>
            </div>
            <span className="font-semibold text-xl text-red-700">
              {formatCurrency(product.price * product.quantity)}
            </span>
            <p className="text-sm font-semibold text-xs">
              {product.description}
            </p>
            <TruncatedText text={product.content} limit={80} />
            <div className="amount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>
            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center total">
        <h3 className="font-extrabold tracking-wider">
          Tổng cộng: <strong>{formatCurrency(total)}</strong>
        </h3>

        <button
          className="flex items-center gap-2 px-6 p-y2  text-black font-semibold border-solid uppercase border-purple-700 border-2 p-2 text-xl rounded-lg hover:scale-[1.03] ease-in-out duration-300"
          onClick={handleCheckout}
        >
          Thanh toán <FaStripe className="text-6xl text-purple-900" />
        </button>
      </div>
    </div>
  );
}

export default Cart;
