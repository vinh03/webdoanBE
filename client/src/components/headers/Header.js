import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/menu.svg";
import Close from "./icon/close.svg";
import Cart from "./icon/cart.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function Header() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [user] = state.userAPI.user;
  const [menu, setMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check the scroll position and update state
      setIsScrolled(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Tạo sản phẩm</Link>
        </li>
        <li>
          <Link to="/category">Danh mục</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/history">Lịch sử</Link>
        </li>
        <li>
          <Link to={`/info/`}>{user.name}</Link>
        </li>
        <li>
          <Link to="/" onClick={logoutUser}>
            Đăng xuất
          </Link>
        </li>
      </>
    );
  };

  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    <header className={isScrolled ? "fixed-header" : ""}>
      <div className="header-container">
        <div className="menu" onClick={() => setMenu(!menu)}>
          <img src={Menu} alt="" width="30" />
        </div>
        <div className="logo">
          <h1 className="font-extrabold text-4xl">
            <Link to="/">{isAdmin ? "Admin" : "LAMIA store"}</Link>
          </h1>
        </div>

        <ul style={styleMenu}>
          <li>
            <Link to="/" onClick={() => setMenu(!menu)}>
              {isAdmin ? "Sản phẩm" : "Cửa hàng"}
            </Link>
          </li>
          {isAdmin && adminRouter()}
          {isLogged ? (
            loggedRouter()
          ) : (
            <li onClick={() => setMenu(!menu)}>
              {" "}
              <Link to="/login">Đăng nhập - Đăng ký</Link>{" "}
            </li>
          )}

          <li onClick={() => setMenu(!menu)}>
            <img src={Close} alt="" className="menu" width="30" />
          </li>
        </ul>

        {isAdmin ? (
          ""
        ) : (
          <div className="cart-icon">
            <span>{cart.length}</span>
            <Link to="/cart">
              <img src={Cart} alt="" width="30" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
