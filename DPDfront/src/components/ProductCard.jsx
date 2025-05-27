import React from 'react';

function ProductCard({ product, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer w-64"
      onClick={() => onClick(product)}
    >
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">Current Version: {product.currentVersion.version}</p>
      <p className="text-sm text-gray-500">By: {product.subproducer}</p>
    </div>
  );
}

export default ProductCard;