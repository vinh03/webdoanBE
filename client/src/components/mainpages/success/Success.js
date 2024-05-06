import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

function Success() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const { id } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/success/${id}`, {
          headers: { Authorization: token },
        });
        setPaymentInfo(res.data);
        console.log(res);
        if (res.data.status === "complete" && cart.length > 0) {
          try {
            const paymentData = {
              name: res.data.customer_details.name,
              email: res.data.customer_details.email,
              paymentID: id,
              address: res.data.customer_details.address.country,
              cart: cart,
              status: true
            };
            console.log(paymentData);
            await axios.post("/api/update-payment", paymentData, {
              headers: { Authorization: token },
            });

            // Clear the local cart state and update the user's cart on the server
            setCart([]);
            await axios.patch(
              "/user/addcart",
              { cart: [] },
              {
                headers: { Authorization: token },
              }
            );

            console.log("Payment added to the database");
          } catch (error) {
            console.error("Error adding payment to the database", error);
          }
        }
      } catch (error) {
        console.error("Error fetching/payment information", error);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cart, token]);
  return (
    <>
      {paymentInfo ? (
        <div className="success-page">
          <h1 className="text-4xl text-green-600 font-semibold uppercase">Thanh toán thành công</h1>
          <p>
            Tên: <span>{paymentInfo.customer_details.name}</span>
          </p>
          <p>
            Email: <span>{paymentInfo.customer_details.email}</span>
          </p>

          <p>
            Số tiền: <span>{paymentInfo.amount_total}</span>
          </p>
          <p>
            Ngày thành toán:{" "}
            <span>{new Date(paymentInfo.created * 1000).toLocaleString()}</span>
          </p>
          <p>
            Trạng thái:{" "}
            <span className="done">
              {paymentInfo.status === "complete"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </span>
          </p>
          <div className="box-flex">
            <Link to="/" className="success-page-next">
              Tiếp tục mua sắm
            </Link>
            <Link to="/history" className="success-page-view">
              Xem đơn hàng
            </Link>
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </>
  );
}

export default Success;
