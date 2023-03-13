import React, { FormEvent, useState } from "react";
import useInput from "@/src/hooks/useInput";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { useRouter } from "next/router";
import axios from "axios";


const SignUp: React.FC = () => {
    const email = useInput("");
    const password = useInput("");
    const confirmPassword = useInput("");
    const setAuthModalState = useSetRecoilState(authModalState);
    const [errors, setErrors] = useState("{}");

    let router = useRouter();


    const submitForm = async (event: FormEvent) => {
        /* refresh 방지 */
        event.preventDefault(); 
        /* console.log("email", email.value);
        console.log("password", password.value); */
        try {
            const res = await axios.post('/auth/signup', {
                email,
                password,
                confirmPassword,
            })
            console.log('res', res);
            router.push("/login");
        }
        catch (error: any) {
            console.log('error', error);
            setErrors(error?.response.data || {});
        }
    }; 

    return (
        <form onSubmit={submitForm}>
            <input placeholder="Email" {...email /*email 칸에 대한 return값 불러오기 즉, value={inputValue} onChange={handleChange} */ } />
            <input placeholder="Password" type="password" {...password} />
            <input placeholder="ConfirmPassword" type="password" {...confirmPassword} />
            <div>
                <button type="button">회원가입</button>
            </div>
            <div>
                <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={()=>setAuthModalState((prev) => ({ ...prev, view: "login", }))}> {/* 클릭하면 view가 "login" 으로 업데이트 -> "Login" 보여줌(AuthModal 컴포넌트에서 진행) */}
                이미 회원이신가요? 로그인 하기
                </button>
            </div>
        </form>
        
    );
};

export default SignUp;