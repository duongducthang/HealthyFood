import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../shared/services/axiosClient';

const CalorieCalculator = () => {
    const getSavedBodyIndex = () => {
        const saved = localStorage.getItem('user_body_index');
        return saved ? JSON.parse(saved) : null;
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const [age, setAge] = useState(() => currentUser?.age || getSavedBodyIndex()?.age || 20);
    const [gender, setGender] = useState(() => {
        if (currentUser?.gender) return currentUser.gender === 'Nam' ? 'male' : 'female';
        return getSavedBodyIndex()?.gender || 'female';
    });
    const [height, setHeight] = useState(() => getSavedBodyIndex()?.height || '');
    const [weight, setWeight] = useState(() => getSavedBodyIndex()?.weight || '');
    const [activity, setActivity] = useState(1.2);
    const [tdee, setTdee] = useState(0);

    useEffect(() => {
        const loadBodyIndex = async () => {
            try {
                const { data } = await axiosClient.get('/health/history');
                const latest = data?.[0];
                
                if (latest) {
                    setHeight(latest.height);
                    setWeight(latest.weight);
                    localStorage.setItem('user_body_index', JSON.stringify({
                        ...getSavedBodyIndex(),
                        height: latest.height,
                        weight: latest.weight,
                        updatedAt: latest.date
                    }));
                }
            } catch (error) {
                console.error("Lỗi khi load chỉ số cơ thể:", error);
            }
        };
        loadBodyIndex();
    }, []);

    const calculateTdee = useCallback(() => {
        if (!age || !height || !weight) {
            setTdee(0);
            return;
        }
        
        let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
        bmr = (gender === 'male') ? bmr + 5 : bmr - 161;
        
        setTdee(Math.round(bmr * activity));
    }, [age, height, weight, gender, activity]);

    useEffect(() => {
        calculateTdee();
    }, [calculateTdee]);

    useEffect(() => {
        if (height || weight || age) {
            const currentSaved = getSavedBodyIndex();
            localStorage.setItem('user_body_index', JSON.stringify({
                ...currentSaved,
                height, weight, age, gender,
                updatedAt: new Date().toISOString()
            }));
        }
    }, [height, weight, age, gender]);

    const handleReset = () => {
        setAge(20);
        setGender('female');
        setHeight('');
        setWeight('');
        setActivity(1.2);
        setTdee(0);
    };

    const calorieGoals = [
        { title: 'Giảm cân nhẹ', desc: '0.25kg/tuần', rate: 0.85 },
        { title: 'Giảm cân vừa', desc: '0.5kg/tuần', rate: 0.70 },
        { title: 'Giảm cân nhanh', desc: '1kg/tuần', rate: 0.40 },
        { title: 'Tăng cân nhẹ', desc: '0.25kg/tuần', rate: 1.15 },
        { title: 'Tăng cân vừa', desc: '0.5kg/tuần', rate: 1.30 },
        { title: 'Tăng cân nhanh', desc: '1kg/tuần', rate: 1.60 }
    ];

    return (
        <div className="py-10 pb-20 px-5 max-w-5xl mx-auto font-sans bg-white">
            <h2 className="text-center text-3xl mb-12 font-extrabold text-gray-800 uppercase tracking-tight">
                Lượng calo cơ thể cần trong ngày
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-12">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-bold text-sm text-gray-700">Tuổi</label>
                            <input 
                                type="number" 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
                                value={age} 
                                onChange={(e) => setAge(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-bold text-sm text-gray-700">Giới tính</label>
                            <div className="flex items-center gap-4 h-[50px]">
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} className="w-4 h-4 accent-pink-600" /> Nữ
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} className="w-4 h-4 accent-pink-600" /> Nam
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-bold text-sm text-gray-700">Chiều cao (cm)</label>
                            <input 
                                type="number" 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
                                value={height} 
                                onChange={(e) => setHeight(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-bold text-sm text-gray-700">Cân nặng (kg)</label>
                            <input 
                                type="number" 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button className="flex-1 bg-pink-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-pink-700 active:scale-95 transition-all" onClick={calculateTdee}>Tính toán</button>
                        <button className="flex-1 bg-white text-gray-500 border border-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all" onClick={handleReset}>Đặt lại</button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <label className="block mb-4 font-bold text-sm text-gray-700 italic border-l-4 border-pink-500 pl-3">
                        Chọn mức độ vận động
                    </label>
                    <select 
                        className="w-full p-3 mb-6 border border-gray-200 rounded-xl text-pink-700 font-semibold outline-none cursor-pointer appearance-none bg-white shadow-sm"
                        value={activity}
                        onChange={(e) => setActivity(parseFloat(e.target.value))}
                    >
                        <option value={1.2}>Ít vận động (Văn phòng, ít di chuyển)</option>
                        <option value={1.375}>Vận động nhẹ (Tập nhẹ 1-2 lần/tuần)</option>
                        <option value={1.55}>Vận động vừa (Tập 3-5 lần/tuần)</option>
                        <option value={1.725}>Vận động mạnh (Tập 6-7 lần/tuần)</option>
                        <option value={1.9}>Rất mạnh (Vận động viên, lao động nặng)</option>
                    </select>
                    
                    <div className="space-y-3">
                        {[
                            { val: 1.2, label: 'Ít vận động' },
                            { val: 1.375, label: 'Vận động nhẹ: Không tập nhiều' },
                            { val: 1.55, label: 'Vận động vừa: 1~3 lần/tuần' },
                            { val: 1.725, label: 'Vận động mạnh: 4~5 lần/tuần' },
                            { val: 1.9, label: 'Rất mạnh: Hàng ngày' }
                        ].map((item) => (
                            <div key={item.val} className={`text-sm py-1 px-3 rounded-lg transition-colors ${activity === item.val ? 'bg-pink-100 text-pink-700 font-bold' : 'text-gray-500'}`}>
                                • {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-8 rounded-3xl mb-8 border border-pink-100 text-center shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Nhu cầu của bạn: <span className="text-pink-600 text-3xl mx-2">{tdee}</span> Calo/ngày
                </h3>
                <p className="text-gray-500">Đây là lượng Calo để duy trì cân nặng hiện tại của bạn (TDEE).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {calorieGoals.map((goal, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-300 transition-all group">
                        <h4 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors mb-1">{goal.title}</h4>
                        <p className="text-xs text-gray-400 mb-3">{goal.desc}</p>
                        <div className="text-lg font-black text-gray-900">
                            {Math.round(tdee * goal.rate)} <span className="text-sm font-normal text-gray-500">Calo/ngày</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
                            <div className="bg-pink-500 h-full" style={{ width: `${goal.rate * 80}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-center text-[10px] text-gray-400 mt-10 uppercase tracking-widest italic">
                * Tham khảo công thức Mifflin-St Jeor (Calculator.net)
            </p>
        </div>
    );
};

export default CalorieCalculator;