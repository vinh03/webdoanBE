import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../utils/formatcurrency/FormatCurrency";
function OrderDetail() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [OrderDetails, setOrderDetails] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  console.log(OrderDetails);

  if (OrderDetails.length === 0) return null;
  return (
    <div className="history-page">
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Trạng thái thanh toán</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{OrderDetails.name}</td>
            <td>
              {OrderDetails.address}
            </td>
            <td>{OrderDetails.email}</td>
            <td>{OrderDetails.status === true ? "Đã thanh toán" : "Chưa thanh toán"}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ margin: "30px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {OrderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetail;
