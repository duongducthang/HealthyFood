import { useState, useRef, useEffect } from 'react';
import avatarImg from '../assets/img/Avatar.svg';
import axiosClient from '../shared/services/axiosClient';
import { updateStoredUser } from '../shared/utils/session';

const Profile = () => {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    day: '',
    month: '',
    year: '',
  });

  const [avatar, setAvatar] = useState(avatarImg);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true; 

    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosClient.get('/auth/profile');
        
        
        const user = res?.data?.user || res?.user || res;
        
        if (user && isMounted) {
          setFormData({
            id: user.id || user._id || '',
            fullName: user.fullName || user.userName || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: user.gender || '',
            day: user.birthday ? user.birthday.split('-')[2] : '',
            month: user.birthday ? user.birthday.split('-')[1] : '',
            year: user.birthday ? user.birthday.split('-')[0] : ''
          });

          if (user.avatar) setAvatar(user.avatar);
          updateStoredUser(user);
        }
      } catch (err) {
        if (isMounted) setError("Không thể tải thông tin người dùng.");
        console.error("Profile Load Error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUserData();
    return () => { isMounted = false; };
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn đúng định dạng hình ảnh.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setAvatar(event.target.result);
    reader.readAsDataURL(file);
  };

  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    
    if (!formData.fullName.trim()) return setError('Họ tên không được để trống.');
    if (!formData.phone) return setError('Số điện thoại không được để trống.');

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const birthday = `${formData.year}-${formData.month}-${formData.day}`;
      const payload = {
        fullName: formData.fullName,
        userName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        birthday,
        avatar
      };
      
      const res = await axiosClient.put('/users/me', payload);
      const updatedUser = res?.data?.user || res?.user || res;

      if (updatedUser) {
        updateStoredUser(updatedUser);
        setSuccess('Cập nhật hồ sơ thành công!');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Cập nhật thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Hồ sơ </h2>

        <div className="h-px bg-gray-100 mt-4" />
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm">{success}</div>}

      <form onSubmit={handleUpdate} className="flex flex-col lg:flex-row gap-10">
        {/* Avatar Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center space-y-4">
          <div className="relative group w-40 h-40">
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full border-4 border-gray-50 shadow-sm"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
        
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
            <input 
              name="fullName" value={formData.fullName} onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="Nhập họ tên..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input 
              value={formData.email} readOnly
              className="w-full p-3 border border-gray-100 bg-gray-50 text-gray-500 rounded-xl cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input 
                name="phone" value={formData.phone} onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Giới tính</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
            <div className="grid grid-cols-3 gap-2">
              <select name="day" value={formData.day} onChange={handleChange} className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500">
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select name="month" value={formData.month} onChange={handleChange} className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500">
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="year" value={formData.year} onChange={handleChange} className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto px-12 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-md shadow-pink-100 disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;