/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import axiosClient from '../shared/services/axiosClient';

const Address = () => { 
    const [addresses, setAddresses] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingAddress, setEditingAddress] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoading(true);
                console.log("[API Request] GET /users/me/addresses");
                const res = await axiosClient.get('/users/me/addresses');
                
               
                const data = res?.addresses || res;
                console.log("[API Response] Addresses fetched:", data);
                setAddresses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi khi load danh sách địa chỉ:", err);
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    
    const handleSave = async (addressData) => { 
        const payload = {
            name: addressData.name,
            phone: addressData.phone,
            fullAddress: addressData.fullAddress,
            isDefault: !!addressData.isDefault
        };
        try {
            setIsSubmitting(true);
            if (editingAddress) {
                const addrId = editingAddress.id || editingAddress._id;
                console.log(`[API Request] PUT /users/me/addresses/${addrId}`, payload);
                await axiosClient.put(`/users/me/addresses/${addrId}`, payload);
            } else {
                console.log("[API Request] POST /users/me/addresses", payload);
                await axiosClient.post('/users/me/addresses', payload);
            }
            
            const res = await axiosClient.get('/users/me/addresses');
            const data = res?.addresses || res;
            setAddresses(Array.isArray(data) ? data : []);
            
            setIsModalOpen(false);
            setEditingAddress(null);
            alert("Lưu địa chỉ thành công!");
        } catch (err) {
            console.error("Lỗi khi lưu địa chỉ:", err);
            alert(err?.message || 'Không thể lưu địa chỉ.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (address) => { 
        setEditingAddress(address); 
        setIsModalOpen(true); 
    };


    const handleDelete = async (address) => { 
        const addrId = address.id || address._id;
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) { 
            try {
                console.log(`[API Request] DELETE /users/me/addresses/${addrId}`);
                await axiosClient.delete(`/users/me/addresses/${addrId}`);
                setAddresses(prev => prev.filter(addr => (addr.id || addr._id) !== addrId));
            } catch (err) {
                console.error("Lỗi khi xóa địa chỉ:", err);
                alert(err?.message || 'Không thể xóa địa chỉ.');
            }
        }
    };

    
    const openModal = () => { 
        setEditingAddress(null); 
        setIsModalOpen(true); 
    };

    return (
        <div className="max-w-3xl"> 
            <div className="flex justify-between items-center border-b border-gray-100 pb-3.75 mb-5"> 
                <h3 className="m-0 text-base font-bold">Địa chỉ</h3>
                <button className="bg-pink-50 border border-pink-200 text-text-main py-2 px-4 rounded cursor-pointer text-xs hover:bg-pink-100" onClick={openModal}>+ Thêm địa chỉ mới</button>
            </div>

            {isLoading ? (
                <div className="text-center p-10 text-gray-400">
                    Đang tải danh sách địa chỉ...
                </div>
            ) : addresses.length > 0 ? (
                addresses.map(address => (
                    <div key={address.id || address._id} className="py-5 border-b border-gray-100">     
                        <div className="flex justify-between mb-2">        
                            <span className="font-bold text-sm">{address.name}</span>     
                            <div>
                                <button className="bg-none border-none text-black cursor-pointer text-xs mr-3.75 hover:underline" onClick={() => handleEdit(address)}>Cập nhật</button> 
                                <button className="bg-none border-none text-red-500 cursor-pointer text-xs hover:underline" onClick={() => handleDelete(address)}>Xóa</button>  
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{address.phone}</div>   
                        <div className="text-sm text-gray-500">{address.fullAddress}</div>    
                    </div>
                ))
            ) : (
                <div className="text-center p-10 text-gray-400">
                    Chưa có địa chỉ nào được lưu trong MongoDB.
                </div>
            )}

            <AddressModal  
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                address={editingAddress} 
            />
        </div>
    );
};

export default Address;