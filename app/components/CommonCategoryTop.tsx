import React from 'react';

const FoodDrinkSection = () => {
  return (
    <div className="flex items-center justify-start p-4 bg-white">
      <div className="flex flex-col items-start">
        <div className="text-sm text-gray-500 mb-1">食べろ</div>
        <div className="border border-gray-300 rounded-lg p-2 flex items-center space-x-4">
          <span className="text-lg font-bold">FOOD&DRINK</span>
          <div className="w-64 h-40 bg-cover bg-center rounded-lg" style={{ backgroundImage: "url('/src/food.png')" }}></div>
        </div>
      </div>
    </div>
  );
};

export default FoodDrinkSection;