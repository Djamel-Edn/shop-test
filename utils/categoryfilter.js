import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryFilter({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch the list of categories from your API
    axios.get('/api/categories').then((response) => {
      setCategories(response.data);
    });
  }, []);

  return (
    <div>
      <h3>Filter by Category:</h3>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <button onClick={() => onCategoryChange(category._id)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryFilter;
