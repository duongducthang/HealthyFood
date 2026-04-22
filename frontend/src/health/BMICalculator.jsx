import { useState, useEffect, useCallback } from 'react'; 
import BlogImg from '../assets/img/img-blog.svg';
import axiosClient from '../shared/services/axiosClient';
import FoodDetailModal from '../calorie/FoodDetailModal';

import VegetablesImg from '../assets/img/Vegetables.jpg';
import PotatoesImg from '../assets/img/Potatoes.svg';
import MushroomsImg from '../assets/img/Mushroom.jpg';

const BMICalculator = () => {
    const [height, setHeight] = useState(''); 
    const [weight, setWeight] = useState(''); 
    const [BMI, setBMI] = useState(null);   
    const [bmiStatus, setBmiStatus] = useState(''); 
    const [openModal, setOpenModal] = useState(false);  
    const [selectedFood, setSelectedFood] = useState(null); 
    const [foods, setFoods] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const imageMap = {
        "mushroom.jpg": MushroomsImg,
        "potatoes.svg": PotatoesImg,
        "vegetables.jpg": VegetablesImg,
    };

    
    const getBMIStatus = (bmiVal) => {
        if (bmiVal < 18.5) return 'Gầy';
        if (bmiVal <= 22.9) return 'Bình thường';
        if (bmiVal <= 24.9) return 'Thừa cân';
        return 'Béo phì';
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const foodRes = await axiosClient.get('/foods');
            setFoods(foodRes?.foods || foodRes || []); 

            const historyRes = await axiosClient.get('/health/history');
            const historyData = historyRes?.data || historyRes;
            const latest = Array.isArray(historyData) ? historyData[0] : null;
            
            if (latest) {
                setHeight(latest.height);
                setWeight(latest.weight);
                setBMI(latest.bmi);
                setBmiStatus(getBMIStatus(latest.bmi));
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const calculateBMI = async () => { 
        if (!height || !weight) {
            alert("Vui lòng nhập đầy đủ thông tin chiều cao và cân nặng!");
            return;
        }
        
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        const bmiVal = parseFloat((w / (h * h)).toFixed(1));
        
        setBMI(bmiVal);
        const status = getBMIStatus(bmiVal);
        setBmiStatus(status);

        try {
            setIsSaving(true);
            const payload = {
                height: parseFloat(height),
                weight: parseFloat(weight),
                date: new Date().toISOString()
            };
            
            await axiosClient.post('/health/bmi', payload);
            
            localStorage.setItem('user_body_index', JSON.stringify({
                height, weight, bmi: bmiVal, status, updatedAt: new Date().toISOString()
            }));
            
            alert("Đã lưu chỉ số cơ thể thành công!");
        } catch (error) {
            alert(error.message || "Lỗi khi lưu dữ liệu vào Database.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="py-10 pb-24 px-5 max-w-4xl mx-auto mt-16 font-sans">
            <h2 className="text-center text-2xl font-extrabold mb-10 text-gray-800">Tính chỉ số BMI của bạn</h2>
            
            {/* Input Section */}
            <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-end justify-center mb-12"> 
                <div className="flex flex-col gap-2 flex-1"> 
                    <label className="font-bold text-sm text-gray-700 ml-1">Chiều cao (cm)</label> 
                    <input 
                        type="number" 
                        min="0"
                        className="p-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="VD: 170"
                    />
                </div>
                
                <div className="flex flex-col gap-2 flex-1"> 
                    <label className="font-bold text-sm text-gray-700 ml-1">Cân nặng (kg)</label> 
                    <input 
                        type="number" 
                        min="0"
                        className="p-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        placeholder="VD: 60"
                    />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-bold text-sm text-gray-700 ml-1">Kết quả BMI</label>
                    <input 
                        className="p-3 border border-gray-200 rounded-xl bg-gray-100 font-bold text-emerald-600 outline-none cursor-default"
                        value={BMI || ''} 
                        readOnly 
                        placeholder="---"
                    />
                </div>

                <button 
                    className={`py-3 px-8 rounded-xl font-bold text-white shadow-md transition-all ${
                        isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 cursor-pointer'
                    }`} 
                    onClick={calculateBMI}
                    disabled={isSaving}
                >
                    {isSaving ? 'Đang lưu...' : 'Tính toán'}
                </button> 
            </div>

            {/* Status Alert */}
            {bmiStatus && (
                <div className={`text-center mb-10 p-4 rounded-2xl border ${
                    bmiStatus === 'Bình thường' ? 'bg-green-50 border-green-200 text-green-700' : 
                    bmiStatus === 'Gầy' ? 'bg-orange-50 border-orange-200 text-orange-700' : 
                    'bg-red-50 border-red-200 text-red-700'
                }`}>
                    Tình trạng cơ thể: <strong className="text-lg">{bmiStatus}</strong>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Danh sách món ăn gợi ý</h3>
                {isLoading && <span className="text-sm text-gray-400 animate-pulse">Đang cập nhật...</span>}
            </div>

            {/* Food List */}
            <div className="space-y-5">
                {foods.length > 0 ? (
                    foods.map((food, index) => {
                        const imgFileName = food.imageUrl?.split('/').pop()?.toLowerCase().trim();
                        const displayImg = imageMap[imgFileName] || BlogImg;

                        return (
                            <div 
                                key={food._id || index} 
                                className="flex flex-col md:flex-row gap-5 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                onClick={() => { setSelectedFood(food); setOpenModal(true); }}
                            >
                                <div className="w-full md:w-40 h-44 md:h-28 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                                    <img 
                                        src={displayImg}
                                        alt={food.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">{food.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                            {food.desc || food.description || `${food.kcal || 0} kcal - ${food.category || 'Healthy'}`}
                                        </p>
                                    </div>
                                    <div className="mt-3 flex justify-end md:justify-start">
                                        <button className="py-1.5 px-6 bg-white text-emerald-500 border border-emerald-500 rounded-lg font-bold text-xs group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !isLoading && <p className="text-center text-gray-400 py-10">Đang tải món ăn từ cơ sở dữ liệu...</p>
                )}
            </div>

            {/* Modal */}
            {openModal && selectedFood && ( 
                <FoodDetailModal 
                    food={selectedFood} 
                    onClose={() => setOpenModal(false)} 
                />    
            )}
        </div>
    );
}

export default BMICalculator;