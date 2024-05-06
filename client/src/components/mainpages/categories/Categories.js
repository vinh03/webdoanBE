import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Swal from "sweetalert2";

function Categories() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const updateCat = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        Swal.fire({
          position: "center",
          icon: "success",
          title: updateCat.data.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const createCat = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        Swal.fire({
          position: "center",
          icon: "success",
          title: createCat.data.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const deleteCat = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: deleteCat.data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  return (
    <div className="flex flex-col my-6">
      <form
        onSubmit={createCategory}
        className="flex flex-col items-start gap-3 my-6"
      >
        <label htmlFor="category">Danh mục</label>

        <input
          className="p-2 border-2 rounded-lg w-full"
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          className={`${
            onEdit ? "bg-orange-400" : "bg-green-600"
          } rounded-lg max-w-fit px-6 py-1 text-white`}
          type="submit"
        >
          {onEdit ? "Cập nhật" : "Tạo"}
        </button>
      </form>

      <div className="grid grid-cols-3 gap-x-6 gap-y-6 justify-between">
        {categories.map((category) => (
          <div className="rounded-lg border-2 p-2" key={category._id}>
            <p>{category.name}</p>
            <div className="flex gap-2">
              <button
                className="bg-green-600 rounded-lg max-w-fit px-6 py-1 text-white"
                onClick={() => editCategory(category._id, category.name)}
              >
                Sửa
              </button>
              <button
                className="bg-red-600 rounded-lg max-w-fit px-6 py-1 text-white"
                onClick={() => deleteCategory(category._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
