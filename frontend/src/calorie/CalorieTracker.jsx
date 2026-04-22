import { useEffect, useMemo, useState } from 'react';
import axiosClient from '../shared/services/axiosClient';

const FOOD_LIBRARY = [
    { id: 1, name: 'Thịt gà', unit: '100g', kcal: 239, baseWeight: 100, category: 'meat' },
    { id: 2, name: 'Thịt heo', unit: '100g', kcal: 242.1, baseWeight: 100, category: 'meat' },
    { id: 3, name: 'Trứng gà', unit: '100g (2 quả)', kcal: 155.1, baseWeight: 100, category: 'meat' },
    { id: 4, name: 'Trứng vịt', unit: '70g (1 quả)', kcal: 130, baseWeight: 70, category: 'meat' },
    { id: 5, name: 'Cá ngừ', unit: '100g', kcal: 129.8, baseWeight: 100, category: 'meat' },
    { id: 6, name: 'Tôm', unit: '100g', kcal: 99.2, baseWeight: 100, category: 'meat' },
    { id: 7, name: 'Súp lơ', unit: '400g', kcal: 100, baseWeight: 100, category: 'vegetables' },
    { id: 8, name: 'Dưa hấu', unit: '400g', kcal: 120, baseWeight: 100, category: 'vegetables' },
    { id: 9, name: 'Khoai tây', unit: '100g', kcal: 77, baseWeight: 100, category: 'vegetables' },
    { id: 10, name: 'Chuối', unit: '200g', kcal: 176, baseWeight: 100, category: 'vegetables' },
];

const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
};

const getLogId = (log) => log?.id || log?._id;

const CalorieTracker = () => {
    const [selectedCategory, setSelectedCategory] = useState('meat');
    const [selectedFood, setSelectedFood] = useState(FOOD_LIBRARY[0]);
    const [quantity, setQuantity] = useState(1);
    const [logDate, setLogDate] = useState(formatDate(new Date()));
    const [calories, setCalories] = useState([]); 
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCalories = async () => {
        try {
            const res = await axiosClient.get('/calories/logs?limit=1000');
            const data = res?.logs || res;
            setCalories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi fetch calories:", err);
        }
    };

    useEffect(() => {
        fetchCalories();
    }, []);

    const categoryFoods = useMemo(
        () => FOOD_LIBRARY.filter((f) => f.category === selectedCategory),
        [selectedCategory]
    );

    useEffect(() => {
        const first = categoryFoods[0];
        if (first) setSelectedFood(first);
    }, [categoryFoods]);

    const totalPages = Math.ceil(calories.length / itemsPerPage) || 1;
    const currentLogs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return calories.slice(start, start + itemsPerPage);
    }, [calories, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleAddOrUpdate = async () => {
        if (!selectedFood || quantity <= 0) {
            alert('Vui lòng chọn thực phẩm và số lượng hợp lệ.');
            return;
        }
        const actualQty = Math.round(quantity * selectedFood.baseWeight);
        const calculatedKcal = Number(((selectedFood.kcal / selectedFood.baseWeight) * actualQty).toFixed(1));
        
        const payload = {
            date: logDate,
            food: selectedFood.name,
            unit: selectedFood.unit,
            qty: actualQty,
            kcal: calculatedKcal,
        };

        try {
            setIsSubmitting(true);
            if (editingId) {
                await axiosClient.put(`/calories/logs/${editingId}`, payload);
                setEditingId(null);
            } else {
                await axiosClient.post('/calories/logs', payload);
            }
            await fetchCalories();
            setQuantity(1);
            alert('Lưu dữ liệu thành công!');
        } catch (err) {
            alert(err?.message || 'Không thể lưu dữ liệu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id || !window.confirm('Bạn có chắc chắn muốn xóa dòng này?')) return;
        try {
            await axiosClient.delete(`/calories/logs/${id}`);
            await fetchCalories();
        } catch (err) {
            alert(err?.message || 'Xóa thất bại.');
        }
    };

    const handleEdit = (log) => {
        const id = getLogId(log);
        setEditingId(id);
        setLogDate(formatDate(log.date));
        const food = FOOD_LIBRARY.find((f) => f.name === log.food);
        if (!food) return;
        setSelectedCategory(food.category);
        setSelectedFood(food);
        setQuantity(Math.max(1, Math.round(log.qty / food.baseWeight)));
    };

    return (
        <div className="bg-white min-h-screen font-sans p-5 tracker-page">
            <div className="max-w-5xl mx-auto tracker-layout">
                <h2 className="text-lg font-bold mb-2.5 text-text-main tracker-title">Chọn bảng tính</h2>
                <select className="w-72 border border-gray-300 p-2 rounded text-pink-600 mb-5 outline-none tracker-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="meat">Bảng tính calo trong thịt/trứng/hải sản</option>
                    <option value="vegetables">Bảng tính calo trong rau/củ/quả</option>
                </select>

                <table className="w-full border-collapse mb-7.5 text-gray-300 tracker-table">
                    <thead>
                        <tr>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100 w-2/5">Loại thức ăn</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100 w-2/5">Đơn vị tính</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">Kcal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryFoods.map((food) => (
                            <tr key={food.id}>
                                <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{food.name}</td>
                                <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{food.unit}</td>
                                <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{food.kcal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="text-lg font-bold mb-2.5 text-text-main mt-10 tracker-title">Thống kê các món ăn theo ngày</h3>
                <div className="flex gap-2.5 items-center mb-5 tracker-form">
                    <input className="p-1 border border-gray-300 rounded outline-none text-sm" type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
                    <select
                        className="p-1 border border-gray-300 rounded outline-none text-sm w-52"
                        value={selectedFood?.name || ''}
                        onChange={(e) => setSelectedFood(FOOD_LIBRARY.find((f) => f.name === e.target.value))}
                    >
                        {FOOD_LIBRARY.map((f) => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                        ))}
                    </select>
                    <button className="w-7.5 h-8.75 border border-gray-300 bg-white cursor-pointer hover:bg-gray-50" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <input className="p-1 border border-gray-300 rounded outline-none text-sm w-10 text-center" value={quantity} readOnly />
                    <button className="w-7.5 h-8.75 border border-gray-300 bg-white cursor-pointer hover:bg-gray-50" onClick={() => setQuantity(q => q + 1)}>+</button>
                    <div className="min-w-[100px] text-center font-bold border border-gray-300 rounded p-2 text-sm">{selectedFood ? (selectedFood.kcal * quantity).toFixed(1) : 0}</div>
                    <button className="bg-gray-500 text-white border-none py-2 px-5 rounded cursor-pointer hover:bg-gray-600 transition-colors text-sm" onClick={handleAddOrUpdate} disabled={isSubmitting}>
                        {editingId ? 'Cập nhật' : 'Thêm vào bảng'}
                    </button>
                </div>

                <table className="w-full border-collapse mb-7.5 text-gray-300 logs-table">
                    <thead>
                        <tr>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">#</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">Ngày</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">Thực phẩm</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">Số lượng</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">calo</th>
                            <th className="text-left border-b border-gray-100 py-3 px-2 text-text-muted font-medium text-sm bg-gray-100">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-7.5 text-sm text-text-main">Chưa có dữ liệu.</td></tr>
                        ) : (
                            currentLogs.map((log, idx) => (
                                <tr key={getLogId(log) || idx}>
                                    <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{formatDate(log.date)}</td>
                                    <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{log.food}</td>
                                    <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{log.qty}</td>
                                    <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">{log.kcal}</td>
                                    <td className="py-3 px-2 border-b border-gray-100 text-sm text-text-main">
                                        <button className="bg-pink-600 text-white border-none py-1 px-3 rounded-sm cursor-pointer mr-1.25 hover:bg-pink-700 text-xs transition-colors" onClick={() => handleEdit(log)}>Edit</button>
                                        <button className="bg-white text-pink-600 border border-pink-600 py-1 px-3 rounded-sm cursor-pointer hover:bg-pink-50 text-xs transition-colors" onClick={() => handleDelete(getLogId(log))}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="flex justify-end items-center gap-1.25 mt-5 pagination-wrap">
                    <button className="border border-gray-100 bg-white py-1.25 px-2.5 cursor-pointer text-[#666] rounded-[3px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                    
                    <button className={`border py-1.25 px-2.5 cursor-pointer rounded-[3px] text-sm transition-all ${currentPage === 1 ? 'border-[#d14f9b] text-[#d14f9b]' : 'border-gray-100 bg-white text-[#666] hover:bg-gray-50'}`} onClick={() => handlePageChange(1)}>1</button>
                    
                    {currentPage > 3 && <span className="text-[#999] px-1.25">...</span>}
                    
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) <= 1) {
                            return (
                                <button key={page} className={`border py-1.25 px-2.5 cursor-pointer rounded-[3px] text-sm transition-all ${currentPage === page ? 'border-[#d14f9b] text-[#d14f9b]' : 'border-gray-100 bg-white text-[#666] hover:bg-gray-50'}`} onClick={() => handlePageChange(page)}>
                                    {page}
                                </button>
                            );
                        }
                        return null;
                    })}

                    {currentPage < totalPages - 2 && <span className="text-[#999] px-1.25">...</span>}
                    
                    {totalPages > 1 && (
                        <button className={`border py-1.25 px-2.5 cursor-pointer rounded-[3px] text-sm transition-all ${currentPage === totalPages ? 'border-[#d14f9b] text-[#d14f9b]' : 'border-gray-100 bg-white text-[#666] hover:bg-gray-50'}`} onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </button>
                    )}

                    <button className="border border-gray-100 bg-white py-1.25 px-2.5 cursor-pointer text-[#666] rounded-[3px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                    
                    <select className="ml-2.5 border border-gray-100 p-1.25 rounded-[3px] outline-none text-sm cursor-pointer">
                        <option>10/page</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CalorieTracker;