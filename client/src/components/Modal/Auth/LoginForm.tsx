import React, { FormEvent, useState } from "react";
import useInput from "@/src/hooks/useInput";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { useRouter } from "next/router";
import axios from "axios";


const LoginForm:React.FC = () => {
    const email = useInput("");
    const password = useInput("");
    const setAuthModalState = useSetRecoilState(authModalState);
    let router = useRouter();
    const [errors, setErrors] = useState<any>({});


    const submitForm = async (event: FormEvent) => {
        /* refresh 방지 */
        event.preventDefault(); 
        /* console.log("email", email.value);
        console.log("password", password.value); */
        try {
            const res = await axios.post('/auth/login',
                { 
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );
        } catch(error) {
            console.error(error);
            setErrors(error?.response?.data || {});
        }
    }; 

    return (
        <form onSubmit={submitForm}>
            <input placeholder="Email" {...email /*email 칸에 대한 return값 불러오기 즉, value={inputValue} onChange={handleChange} */ } />
            <input placeholder="Password" type="password" {...password} />
            <div>
                <button type="button">Log In</button>
            </div>
            <div>
                <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={()=>setAuthModalState((prev) => ({ ...prev, view: "signup", }))}> {/* 클릭하면 view가 "signup" 으로 업데이트 -> "Sign Up" 보여줌(AuthModal 컴포넌트에서 진행) */}
                Sign Up
                </button>
            </div>
        </form>
        
    );
};

export default LoginForm;