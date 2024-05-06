import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "",
  content: "",
  category: "",
  _id: "",
};
function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;
  const [onEdit, setOnEdit] = useState(false)
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const navigate = useNavigate();
  const param = useParams();

  const [products] = state.productsAPI.products;

  useEffect(() => {
    if(param.id){
        setOnEdit(true)
        products.forEach(product => {
            if(product._id === param.id) {
                setProduct(product)
                setImages(product.images)
            }
        })
    }else{
        setOnEdit(false)
        setProduct(initialState)
        setImages(false)
    }
}, [param.id, products])

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      const file = e.target.files[0];

      if (!file) return alert("File not exist.");

      if (file.size > 1024 * 1024)
        // 1mb
        return alert("Size too large!");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("File format is incorrect.");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("Bạn không có quyền admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Bạn không phải admin");
      if (!images) return alert("Chưa tải lên hình ảnh");

      if(onEdit){
        const updateProduct = await axios.put(`/api/products/${product._id}`, {...product, images}, {
            headers: {Authorization: token}
        })
        Swal.fire({
          position: "center",
          icon: "success",
          title: updateProduct.data.msg,
          showConfirmButton: false,
          timer: 1500
        });
    }else{
        const createProduct = await axios.post('/api/products', {...product, images}, {
            headers: {Authorization: token}
        })
        Swal.fire({
          position: "center",
          icon: "success",
          title: createProduct.data.msg,
          showConfirmButton: false,
          timer: 1500
        });
    }
      setCallback(!callback);
      navigate("/");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <div className="create_product">
      <div className="upload rounded-lg border-4">
        <input type="file" name="file" id="file_up" className="border-2 rounded-lg" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} disabled={onEdit}>
        <div className="row">
          <label htmlFor="product_id">ID sản phẩm</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleChangeInput}
            className="border border-2 rounded-lg"
          />
        </div>
        <div className="row">
          <label htmlFor="title">Tên sản phẩm</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleChangeInput}
            className="border border-2 rounded-lg"
          />
        </div>
        <div className="row">
          <label htmlFor="price">Giá sản phẩm</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleChangeInput}
            className="border border-2 rounded-lg"
          />
        </div>
        <div className="row">
          <label htmlFor="description">Chi tiết sản phẩm</label>
          <input
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            onChange={handleChangeInput}
            className="border border-2 rounded-lg"
            placeholder="Chất liệu - thể loại - ..."
          />
        </div>
        <div className="row">
          <label htmlFor="content">Nội dung sản phẩm</label>
          <textarea className="border border-[3px] rounded-lg p-2"
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            onChange={handleChangeInput}
            rows="7"
            placeholder="Nhập nội dung chi tiết sản phẩm..."
          />
        </div>
        <div className="row flex flex-col gap-y-2">
          <label htmlFor="categories">Danh mục sản phẩm</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChangeInput}
            className="border rounded-lg border-2 py-2 outline-none"
          >
            <option value="">Vui lòng chọn danh mục</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{onEdit? "Sửa sản phẩm" : "Tạo sản phẩm"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
