import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
function Profile() {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  return (
    <>
      <div className="container my-8">
        <div className="max-w-4xl flex gap-8 justify-between ">
          <div className="avatar w-[400px] h-[400px]">
            <img src="" alt="avatar" />
          </div>
          <form className="form-info flex flex-col gap-4 w-full">
            <label htmlFor="name" className="flex flex-col">
              Tên đăng nhập
              <input className="p-2 rounded" type="text" name="name" id="name" value={user.name} />
            </label>

            <label htmlFor="email" className="flex flex-col">
              Email
              <input className="p-2 rounded" type="email" name="email" id="email" value={user.email} />
            </label>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
