import { useState, useMemo, useEffect, useCallback } from 'react';
import FoodDetailModal from '../calorie/FoodDetailModal';
import axiosClient from '../shared/services/axiosClient';

import PotatoesImg from '../assets/img/Potatoes.svg';
import VegetablesImg from '../assets/img/Vegetables.jpg';
import MushroomsImg from '../assets/img/Mushroom.jpg';
import TitleImg from '../assets/img/img-blog.svg';

const Blog = () => {
    const [selectedFood, setSelectedFood] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [foods, setFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarMenu = [
        { id: 'seasonal', title: "Thực đơn theo mùa", isStatic: true },
        { id: 'dishes', title: "Thực đơn theo món", isStatic: true },
        { id: 'time', title: "Thực đơn theo bữa", items: ["Bữa sáng", "Bữa trưa", "Bữa tối"] },
        { id: 'day', title: "Thực đơn theo t/g", items: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"] },
        { id: 'favorite', title: "Được yêu thích", isStatic: true },
        { id: 'popular', title: "Thực đơn thông dụng", items: ["Title....."] }
    ];

    const [expandedSections, setExpandedSections] = useState(() => {
        const saved = localStorage.getItem('blog_sidebar_expanded');
        return saved ? JSON.parse(saved) : { time: true, day: true, popular: true };
    });

    // FETCH FOODS FROM API 
    const fetchFoods = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {};
            if (activeCategory !== "Tất cả") params.category = activeCategory;
            if (searchTerm) params.search = searchTerm;

            const res = await axiosClient.get('/foods', { params });
            const data = res?.foods || res;
            setFoods(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi fetch foods:", err);
            setFoods([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeCategory, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFoods();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchFoods]);

    const handleSeedFoods = async () => {
        if (!window.confirm("Bạn có muốn khởi tạo dữ liệu mẫu không?")) return;
        try {
            const initialFoods = [
                { category: "Bữa sáng", title: "Potatoes", desc: "Giàu vitamin C và chất xơ...", imageUrl: "potatoes.svg" },
                { category: "Bữa trưa", title: "Vegetables", desc: "Nguồn cung cấp chất xơ dồi dào...", imageUrl: "vegetables.jpg" },
                { category: "Bữa tối", title: "Mushrooms", desc: "Protein cao và ít calo...", imageUrl: "mushroom.jpg" }
            ];
            for (const food of initialFoods) {
                await axiosClient.post('/foods', food);
            }
            alert("Thành công!");
            window.location.reload();
        } catch (err) {
            alert("Lỗi: " + err.message);
        }
    };

    useEffect(() => {
        localStorage.setItem('blog_sidebar_expanded', JSON.stringify(expandedSections));
    }, [expandedSections]);

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

  const filteredFoods = useMemo(() => {
    const imageMap = {
        "potatoes.svg": PotatoesImg,
        "vegetables.jpg": VegetablesImg,
        "mushroom.jpg": MushroomsImg,
    };
    
    return foods.map(food => {
        const imgKey = (food.imageUrl || "").trim().toLowerCase();
        return {
            ...food,
            id: food.id || food._id,
            displayImg: imageMap[imgKey] || TitleImg 
        };
    });
}, [foods]);

    return (
        <div className="font-sans bg-gray-50 min-h-screen pb-20">
            {/* Search Bar - Fixed style */}
            <div className="p-5 flex justify-end gap-3 items-center sticky top-0 z-10 bg-white shadow-sm md:bg-transparent md:shadow-none">
                <button 
                    className="md:hidden flex items-center gap-2 bg-emerald-500 text-white py-2 px-4 rounded-full font-semibold shadow-md"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? '✕ Đóng' : '☰ Danh mục'}
                </button>
                <input 
                    type="text" 
                    className="py-2.5 px-4 border border-gray-300 rounded-xl w-full max-w-[300px] outline-none focus:border-emerald-500 transition-all" 
                    placeholder="Tìm kiếm món ăn..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            <main className="flex items-start gap-8 w-full max-w-[1200px] mx-auto px-5 lg:flex-row flex-col">
                {/* Sidebar - Fixed arbitrary rem values */}
                <aside className={`w-full lg:w-[300px] shrink-0 bg-white p-4 rounded-xl shadow-lg lg:bg-transparent lg:shadow-none lg:p-0 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
                    <h4 
                        className={`mb-6 text-[1.5rem] font-extrabold text-gray-800 pl-2 cursor-pointer hover:text-emerald-500 transition-colors ${activeCategory === "Tất cả" ? "text-emerald-500" : ""}`} 
                        onClick={() => { setActiveCategory("Tất cả"); setIsSidebarOpen(false); }} 
                    >
                        Tất cả danh mục
                    </h4>
                    
                    {sidebarMenu.map((section) => (
                        <div key={section.id} className="mb-4">
                            {section.isStatic ? (
                                <span 
                                    className={`pl-2 font-medium py-2 px-3 rounded-lg block cursor-pointer transition-all hover:bg-emerald-50 hover:text-emerald-500 ${activeCategory === section.title ? "bg-emerald-50 text-emerald-600 font-bold" : "text-gray-700"}`}
                                    onClick={() => { setActiveCategory(section.title); setIsSidebarOpen(false); }} 
                                >
                                    {section.title}
                                </span>
                            ) : (
                                <>
                                    <div 
                                        className={`flex items-center gap-2 font-medium py-2 px-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${section.items.includes(activeCategory) ? "text-emerald-600" : "text-gray-700"}`}
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <span className={`w-2 h-2 border-r-2 border-b-2 border-current transform transition-transform ${expandedSections[section.id] ? "rotate-45" : "-rotate-45"}`}></span>
                                        <span>{section.title}</span>
                                    </div>
                                    
                                    <div className={`ml-6 overflow-hidden transition-all duration-300 border-l-2 border-gray-100 ${expandedSections[section.id] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                        {section.items.map(cat => (
                                            <span 
                                                key={cat}
                                                className={`block pl-4 py-1.5 text-[0.95rem] cursor-pointer transition-all hover:text-emerald-500 ${activeCategory === cat ? "text-emerald-600 font-bold" : "text-gray-500"}`} 
                                                onClick={() => { setActiveCategory(cat); setIsSidebarOpen(false); }} 
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </aside>

                {/* Content Area */}
                <section className="flex-1 min-w-0 w-full">
                    <h2 className="text-[1.5rem] md:text-[1.8rem] font-bold text-gray-800 mb-8 leading-tight">
                        {activeCategory === "Tất cả" ? "Thực đơn và lời khuyên về chế độ ăn uống lành mạnh" : `Thực đơn ${activeCategory}`}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-20 text-emerald-500 font-semibold text-lg">Đang tải dữ liệu...</div>
                        ) : filteredFoods.length > 0 ? (
                            filteredFoods.map((food) => (
                                <div 
                                    key={food.id}
                                    className="bg-white rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-emerald-100 flex flex-col h-full"
                                    onClick={() => setSelectedFood(food)}
                                >
                                    <div className="aspect-video bg-gray-50 rounded-xl mb-4 overflow-hidden border border-gray-100">
                                        <img 
                                        src={food.displayImg} 
                                        alt={food.title} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => { e.target.src = TitleImg; }}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{food.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{food.desc}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-emerald-500 font-bold text-sm group">
                                        Xem chi tiết 
                                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
                                <p className="text-gray-400 mb-4">Không tìm thấy món ăn phù hợp.</p>
                                <button onClick={handleSeedFoods} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
                                    Khởi tạo dữ liệu mẫu
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {selectedFood && (
                <FoodDetailModal food={selectedFood} onClose={() => setSelectedFood(null)} />
            )}
        </div>
    );
};

export default Blog;