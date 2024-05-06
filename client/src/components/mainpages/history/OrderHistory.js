import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";

import { TruncatedText } from "../utils/truncated/TruncatedText";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        } else {
          const res = await axios.get("/user/history", {
            headers: { Authorization: token },
          });
          setHistory(res.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);



  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <h2 className="text-red-700 tracking-wider font-semibold text-xl uppercase">
        Lịch sử mua hàng
      </h2>

      <h4>Bạn có {history.length} đơn đặt hàng đã thanh toán.</h4>

      <div className="history-page">
        <table className="border-collapse border border-slate-400">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Ngày thanh toán</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((items) => (
              <tr key={items._id}>
                <td><TruncatedText text={items.paymentID} limit={20} /></td>
                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/history/${items._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderHistory;
