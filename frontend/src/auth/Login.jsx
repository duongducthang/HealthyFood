import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axiosClient from '../shared/services/axiosClient';
import { persistAuth } from '../shared/utils/session';

const Login = () => {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');   
    const [password, setPassword] = useState(''); 

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            const res = await axiosClient.post('/auth/login', { email, password });
            
            persistAuth(res?.access_token, res?.user);

            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('userUpdate', { detail: res?.user }));
        
            navigate('/account/profile');
        } catch (err) {
            alert(err?.message || 'Email hoặc mật khẩu không chính xác!');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 font-sans"> 
            <div className="w-full max-w-md py-15 px-10 bg-white text-center shadow-sm rounded-sm"> 
                <h2 className="text-3xl font-bold mb-10 text-text-main tracking-widest">Đăng nhập</h2> 
                
                <form onSubmit={handleLogin} className="flex flex-col gap-6.25">
                    <div className="flex flex-col gap-2">    
                        <label className="text-left text-sm font-bold text-text-main">Email</label>  
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="p-3 border border-gray-200 rounded-lg outline-none text-sm bg-blue-50"  
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required  
                        />
                    </div>

                    <div className="flex flex-col gap-2">  
                        <label className="text-left text-sm font-bold text-text-main">Mật khẩu</label>  
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu" 
                            className="p-3 border border-gray-200 rounded-lg outline-none text-sm bg-blue-50" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required  
                        />
                    </div>

                    <div className="mt-3.75"> 
                        <button type="submit" className="w-full py-3.5 bg-white text-text-main border border-text-main font-bold text-sm tracking-wide cursor-pointer transition-colors duration-200 hover:bg-gray-50 uppercase">    
                            Đăng nhập
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-sm text-text-muted">
                    Nếu chưa có tài khoản 
                    <Link to="/register" className="text-pink-500 no-underline font-bold hover:underline"> Đăng ký</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;