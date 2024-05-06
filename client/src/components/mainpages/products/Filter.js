import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
function Filter() {
  const state = useContext(GlobalState);
  const [categories, setCategories] = state.categoriesAPI.categories;
  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch("");
  };
  return (
    <div className="filter_menu">
      <div className="row">
        <span>Lọc: </span>
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">Tất cả sản phẩm</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="p-3"
        type="text"
        value={search}
        placeholder="Tìm kiếm . . . . . . ."
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <div className="row sort">
        <span>Xếp theo: </span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Mới nhất</option>
          <option value="sort=oldest">Cũ nhất</option>
          <option value="sort=-sold">Bán chạy</option>
          <option value="sort=-price">Giá: Cao &#8594; Thấp</option>
          <option value="sort=price">Price: Thấp &#8594; Cao</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
