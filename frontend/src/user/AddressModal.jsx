import { useState, useEffect } from 'react'; 

const AddressModal = ({ isOpen, onClose, onSave, address }) => {  
  const [formData, setFormData] = useState({ 
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  useEffect(() => {
    if (address) {
      const parts = address.fullAddress.split(', '); 
      setFormData({ 
        name: address.name,
        phone: address.phone,
        street: parts[0] || '',
        ward: parts[1] || '',
        district: parts[2] || '',
        province: parts[3] || '',
      });
    } else { 
      setFormData({ name: '', phone: '', province: '', district: '', ward: '', street: '' });
    }
  }, [address, isOpen]); 

  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSubmit = (e) => { 
    e.preventDefault();
    const fullAddress = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.province}`; 
    onSave({ ...formData, fullAddress }); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"> 
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b"> 
          <h3 className="font-bold text-gray-800">{address ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h3> 
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600 transition-colors">&times;</button> 
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4"> 
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-700">
              <span className="text-red-500 mr-1">*</span> Họ và tên </label>
              <input 
                  type="text" 
                  name="name"  
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Họ và tên" 
                  className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-pink-500"   
              required />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-700">
              <span className="text-red-500 mr-1">*</span>Số điện thoại </label> 
              <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone}  
                  onChange={handleChange} 
                  placeholder="Số điện thoại"
                  className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-pink-500"  
              required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700"> 
            <span className="text-red-500 mr-1">*</span>Tỉnh/Thành phố</label>
            <input 
                  type="text" 
                  name="province" 
                  value={formData.province} 
                  onChange={handleChange} 
                  placeholder="Tỉnh/Thành phố" 
                  className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-pink-500" 
            required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">
            <span className="text-red-500 mr-1">*</span>Quận/Huyện </label>
            <input 
                  type="text" 
                  name="district" 
                  value={formData.district} 
                  onChange={handleChange} 
                  placeholder="Quận/Huyện" 
                  className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-pink-500" 
            required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700"> 
            <span className="text-red-500 mr-1">*</span>Phường/Xã</label>
            <input 
                  type="text" 
                  name="ward" 
                  value={formData.ward} 
                  onChange={handleChange} 
                  placeholder="Phường/Xã" 
                  className="w-full border border-gray-300 p-2 text-sm rounded outline-none focus:border-pink-500" 
            required />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">
            <span className="text-red-500 mr-1">*</span>Địa chỉ cụ thể </label>
            <textarea 
                  name="street" 
                  value={formData.street} 
                  onChange={handleChange} 
                  placeholder="Số nhà, tên đường..." 
                  className="w-full border border-gray-300 p-2 text-sm rounded outline-none h-20 focus:border-pink-500"  
            required />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100"> 
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">Quay lại</button>
            <button type="submit" className="px-6 py-2 bg-white text-pink-500 border border-pink-500 rounded text-sm font-bold hover:bg-pink-50 transition-all">
              {address ? 'Cập nhật' : 'Thêm mới'} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;