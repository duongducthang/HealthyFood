/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '', 
        newPassword: '',     
        confirmPassword: '' 
    });

    
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [error, setError] = useState('');    
    const [success, setSuccess] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 


    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');   
        setSuccess(''); 
    };


const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setError('Vui lòng điền đầy đủ tất cả các trường.');
        return;
    }

    if (formData.newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không trùng khớp.');
        return;
    }

    if (formData.currentPassword === formData.newPassword) {
        setError('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
        return;
    }

    try {
        setIsLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem("access_token");

        const res = await fetch("http://localhost:5000/api/users/me/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Đổi mật khẩu thất bại");
        }

        setSuccess("Đổi mật khẩu thành công!");

        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};


    const toggleVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    
    const IconMat = ({ hienThi }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {hienThi ? (
                // Icon Mắt Mở - Hiển thị mật khẩu
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                // Icon Mắt Đóng - Ẩn mật khẩu
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </>
            )}
        </svg>
    );

    return (
        <div className="max-w-xl">
            <h3 className="border-b border-gray-100 pb-2.5 text-lg font-bold">
                Đổi mật khẩu
            </h3>
            
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
               
                {error && <div className="text-red-700 bg-red-50 p-2.5 rounded text-sm">{error}</div>}
                {success && <div className="text-green-700 bg-green-50 p-2.5 rounded text-sm">{success}</div>}

            
                <div className="flex flex-col gap-1.25">
                    <label className="font-bold text-sm text-text-main"><span className="text-red-500 mr-1">*</span> Mật khẩu hiện tại</label>
                    <div className="relative">
                        <input 
                            name="currentPassword"
                            type={showPassword.current ? "text" : "password"} 
                            placeholder="Mật khẩu hiện tại" 
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full p-2.5 pr-10 border border-gray-300 rounded outline-none text-sm bg-white focus:border-pink-500" 
                        />
                        <span 
                            onClick={() => toggleVisibility('current')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer flex items-center text-gray-400"
                        >
                            <IconMat hienThi={showPassword.current} />
                        </span>
                    </div>
                </div>

            
                <div className="flex flex-col gap-1.25">
                    <label className="font-bold text-sm text-text-main"><span className="text-red-500 mr-1">*</span> Mật khẩu mới</label>
                    <div className="relative">
                        <input 
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"} 
                            placeholder="Mật khẩu mới" 
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full p-2.5 pr-10 border border-gray-300 rounded outline-none text-sm bg-white focus:border-pink-500" 
                        />
                        <span 
                            onClick={() => toggleVisibility('new')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer flex items-center text-gray-400"
                        >
                            <IconMat hienThi={showPassword.new} />
                        </span>
                    </div>
                </div>

                
                <div className="flex flex-col gap-1.25">
                    <label className="font-bold text-sm text-text-main"><span className="text-red-500 mr-1">*</span> Xác nhận mật khẩu mới</label>
                    <div className="relative">
                        <input 
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"} 
                            placeholder="Xác nhận mật khẩu mới" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2.5 pr-10 border border-gray-300 rounded outline-none text-sm bg-white focus:border-pink-500" 
                        />
                        <span 
                            onClick={() => toggleVisibility('confirm')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer flex items-center text-gray-400"
                        >
                            <IconMat hienThi={showPassword.confirm} />
                        </span>
                    </div>
                </div>

                <div className="mt-5">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`py-2 px-6.25 font-bold rounded cursor-pointer transition-all border ${isLoading ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-pink-500 border-pink-500 hover:bg-pink-50'}`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'XÁC NHẬN'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;