import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

import PotatoesImg from '../assets/img/Potatoes.svg';
import VegetablesImg from '../assets/img/Vegetables.jpg';
import MushroomsImg from '../assets/img/Mushroom.jpg';
import TitleImg from '../assets/img/img-blog.svg';

const FoodDetailModal = ({ food, onClose }) => {
  const displayImage = useMemo(() => {
    if (!food) return TitleImg;
    
    if (food.displayImg && typeof food.displayImg !== 'string') return food.displayImg;

    const imageMap = {
      "potatoes.svg": PotatoesImg,
      "vegetables.jpg": VegetablesImg,
      "mushroom.jpg": MushroomsImg,
      "mushrooms.jpg": MushroomsImg,
    };

    const imgKey = (food.imageUrl || "").trim().toLowerCase();
    return imageMap[imgKey] || TitleImg;
  }, [food]);

  if (!food) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} 
    > 
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} 
      > 
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white shadow-sm"> 
          <h3 className="text-gray-800 text-lg font-semibold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Chi tiết thực phẩm
          </h3> 
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all text-2xl font-light"
            aria-label="Close" 
          >
            &times;
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-thin scrollbar-thumb-gray-200"> 
          <div className="flex flex-col md:flex-row gap-8 mb-10"> 
            {/* Image Wrapper */}
            <div className="w-full md:w-2/5 flex-shrink-0"> 
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <img 
                  src={displayImage}
                  alt={food.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"   
                  onError={(e) => { e.target.src = TitleImg; }} 
                />
              </div>
            </div>

            {/* Text Info */}
            <div className="flex-1"> 
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                {food.title}
              </h2> 
              <div className="prose prose-sm text-gray-600 leading-relaxed ">
                {food.fullDesc || food.desc || food.description || "Không có mô tả chi tiết cho món ăn này."}
              </div>
            </div>
          </div>

          {/* Table Details */}
          <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden shadow-sm"> 
            <table className="min-w-full divide-y divide-gray-200"> 
              <thead className="bg-gray-50">
                <tr> 
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 ">Food</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 ">Serving</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 ">Calories</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100"> 
                {food.details && food.details.length > 0 ? ( 
                  food.details.map((item, index) => (
                    <tr key={index} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 font-light">{item.name}</td> 
                      <td className="px-6 py-4 text-sm text-gray-600 font-light">{item.serving}</td>   
                      <td className="px-6 py-4 text-sm text-gray-600 font-light">{item.calories} cal</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-12 text-sm text-gray-400 italic font-light">
                      Dữ liệu thành phần đang được cập nhật...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default FoodDetailModal;