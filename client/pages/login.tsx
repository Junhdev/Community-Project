import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router';
import InputGroup from '@/src/components/InputGroup';
import { useAuthDispatch, useAuthState } from '@/src/context/auth';


const Login = () => {
    let router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const { authenticated } = useAuthState();
    const dispatch = useAuthDispatch();
    
    // 이미 인증이 되어 있는 user(로그인 되어 있는 user)일 때, 즉 authenticated === true 일때 '/'로 redirect
    if (authenticated) router.push("/");


    const handleSubmit = async (event: FormEvent) => { 
        event.preventDefault();
        try {
            // 서로 다른 ORIGIN에서 cookie에 token 저장을 위해 프론트에서 {withCredentials: true} 설정 필요
            const res = await axios.post("/auth/login", { password, username }, { withCredentials: true })
            console.log(res);
            // 로그인이 성공하면 context에 user정보 저장
            dispatch("LOGIN", res.data?.user);
            

            router.push("/")
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data || {})
        }
    }

    return (
        <div className='bg-white'>
            <div className='flex flex-col items-center justify-center h-screen p-6'>
                <div className='w-10/12 mx-auto md:w-96'>
                    <h1 className='mb-2 text-lg font-medium'>로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup
                            placeholder='Username'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup
                            placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'>
                            로그인
                        </button>
                    </form>
                    <small>
                        아직 아이디가 없나요?
                        <Link href="/signup"> 
                            회원가입
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Login



/*
import React, { FormEvent, useState } from "react";
import useInput from "@/src/hooks/useInput";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/src/atoms/authModalAtom";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";



const LoginForm:React.FC = () => {
    const email = useInput("");
    const password = useInput("");
    const setAuthModalState = useSetRecoilState(authModalState);
    let router = useRouter();
    const [errors, setErrors] = useState<any>({});
    


    const submitForm = async (event: FormEvent) => {
        /* refresh 방지 
        event.preventDefault(); 
        /* console.log("email", email.value);
        console.log("password", password.value); 
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
        <>
        <form onSubmit={submitForm}>
            <input placeholder="Email" {...email /*email 칸에 대한 return값 불러오기 즉, value={inputValue} onChange={handleChange} } />
            <input placeholder="Password" type="password" {...password} />
            <div>
                <button type="button">Log In</button>
            </div>
                {/*
                <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={()=>setAuthModalState((prev) => ({ ...prev, view: "signup", }))}> {/* 클릭하면 view가 "signup" 으로 업데이트 -> "Sign Up" 보여줌(AuthModal 컴포넌트에서 진행) 
                Sign Up
                </button>
                }
        </form>
        <small>
        아직 아이디가 없나요?
        <Link href="/signup">
            회원가입
        </Link>
        </small>
        </>
        
    );
};

export default LoginForm;
*/