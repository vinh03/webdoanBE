import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/register", { ...user });

      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e.response.data.msg,
      });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
        <h2>Đăng ký</h2>
        <input
          type="text"
          name="name"
          required
          placeholder="Tên"
          value={user.name}
          onChange={onChangeInput}
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />

        <input
          autoComplete="on"
          type="password"
          name="password"
          required
          placeholder="Mật khẩu"
          value={user.password}
          onChange={onChangeInput}
        />

        <div className="row">
          <button type="submit">Đăng ký</button>
          <Link to="/Login">Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
