import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { locations } from '../constants/locations.js'; 
import axiosClient from '../shared/services/axiosClient.js';
import { persistAuth } from '../shared/utils/session.js';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        userName: '',    
        fullName: '',    
        birthday: '',    
        email: '',       
        password: '',    
        phone: '',       
        gender: 'Nam',   
        province: '', 
        district: '',  
        address: ''    
    });

    const [districts, setDistricts] = useState([]);
    useEffect(() => {
        if (formData.province) {
            const selectedLocation = locations.find(loc => loc.name === formData.province);
            setDistricts(selectedLocation ? selectedLocation.districts : []);
            setFormData(prev => ({ ...prev, district: '' }));
        } else {
            setDistricts([]);
            setFormData(prev => ({ ...prev, district: '' }));
        }
    }, [formData.province]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fullName') {
            setFormData(prev => ({ ...prev, fullName: value, userName: prev.userName || value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault(); 
        try {
            const payload = { 
                ...formData, 
                userName: formData.userName || formData.fullName || formData.email.split('@')[0] 
            };
            const res = await axiosClient.post('/auth/register', payload);
            
            persistAuth(res?.access_token, res?.user);
            
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: res?.user }));
            
            navigate('/account/profile');
        } catch (err) {
            alert(err?.message || 'Đăng ký thất bại!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 font-sans">
            <div className="w-full max-w-xl p-12.5 bg-white text-center shadow-card rounded-sm"> 
                <p className="text-xs text-gray-400 mb-2">Welcome!</p>
                <h2 className="text-2xl font-bold mb-10 text-gray-800">Đăng ký tài khoản</h2> 
                
                <form onSubmit={handleRegister} className="flex flex-col gap-5 text-left">   
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-800"> 
                            <span className="text-red-500 mr-1">*</span> Họ và tên
                        </label>
                        <input 
                            name="fullName" 
                            type="text" 
                            className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" 
                            placeholder="Nhập họ và tên đầy đủ"
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    
                    <div className="grid grid-cols-2 gap-5"> 

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Ngày sinh</label>  
                            <input 
                                name="birthday"
                                type="date" 
                                className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto"    
                                max={new Date().toISOString().split("T")[0]} 
                                value={formData.birthday}   
                                onChange={handleChange}                  
                            />
                        </div>

                        <div className="flex flex-col gap-2"> 
                            <label className="text-sm font-bold text-gray-800"> 
                                <span className="text-red-500 mr-1">*</span> Email  
                            </label>
                            <input 
                                name="email"
                                type="email" 
                                placeholder="Nhập Email" 
                                className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto"  
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-2 gap-5"> 
                        <div className="flex flex-col gap-2"> 
                            <label className="text-sm font-bold text-gray-800">
                                <span className="text-red-500 mr-1">*</span> Mật khẩu 
                            </label>
                            <input 
                                name="password" //
                                type="password" 
                                placeholder="Nhập mật khẩu" 
                                className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="flex flex-col gap-2"> 
                            <label className="text-sm font-bold text-gray-800"> 
                                <span className="text-red-500 mr-1">*</span> Số điện thoại 
                            </label>
                            <input 
                                name="phone"
                                type="text" 
                                placeholder="Nhập số điện thoại" 
                                className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2"> 
                        <label className="text-sm font-bold text-gray-800">Giới tính</label>
                        <select name="gender" className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" onChange={handleChange} value={formData.gender}> 
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    
                    <div className="flex flex-col gap-2"> 
                        <label className="text-sm font-bold text-gray-800">
                            <span className="text-red-500 mr-1">*</span> Tỉnh/Thành phố 
                        </label>
                        <select name="province" className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" onChange={handleChange} required value={formData.province}>
                            <option value="">Chọn tỉnh/thành</option>
                            {locations.map(loc => ( 
                                <option key={loc.name} value={loc.name}>{loc.name}</option> 
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-col gap-2"> 
                        <label className="text-sm font-bold text-gray-800"> 
                            <span className="text-red-500 mr-1">*</span> Quận/Huyện 
                        </label>
                        <select name="district" className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" onChange={handleChange} required value={formData.district} disabled={!formData.province}> 
                            <option value="">Chọn quận/huyện</option> 
                            {districts.map(dist => (
                                <option key={dist} value={dist}>{dist}</option> 
                            ))}
                        </select>
                    </div>

                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-800">Địa chỉ</label> 
                        <input 
                            name="address"
                            type="text" 
                            placeholder="Số nhà, tên đường..." 
                            className="py-2.5 px-3 border border-gray-200 rounded-md text-sm outline-none bg-white w-full overflow-hidden text-ellipsis whitespace-nowrap appearance-auto" 
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="mt-5 p-3 bg-white border border-gray-800 font-bold cursor-pointer text-sm hover:bg-gray-50 transition-colors uppercase">Đăng ký</button> 
                </form>

                <p className="mt-6 text-sm text-gray-800"> 
                    Người dùng đã đăng ký <Link to="/login" className="text-pink-500 no-underline font-bold hover:underline">Đăng nhập</Link> 
                </p>
            </div>
        </div>
    );
};

export default Register;