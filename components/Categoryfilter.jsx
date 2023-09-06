import React, { useState } from 'react';

function CategoryFilter({ categories, selectedCategory, onChange }) {

  return (
    <div className='mr-6'>
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        className='p-2'
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      
    </div>
  );
}

export default CategoryFilter;
