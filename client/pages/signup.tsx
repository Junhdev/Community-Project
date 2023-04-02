import InputGroup from '@/src/components/InputGroup';
import { useAuthState } from '@/src/context/auth';

import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'



const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState<any>({});
    const { authenticated } = useAuthState();

    if (authenticated) router.push("/");
    

    
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        /* fetch 방식으로 작성
        fetch("http://localhost:4000/api/auth/signup",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                username,
                password
            })}).then((res)=>console.log(res))
        }
        */
        
        try {
            const res = await axios.post("/auth/signup", {
                email,
                password,
                username
            })
            console.log(res);
            // 회원가입 완료 후 login 페이지로 이동
            router.push("/login");
        } catch (error: any) {
            console.log('error', error);
            setErrors(error.response.data || {});
        }
    }
        
    

    return ( 
        <div className='bg-white'>
            <div className='flex flex-col items-center justify-center h-screen p-6'>
                <div className='w-10/12 mx-auto md:w-96'>
                    <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup
                            placeholder='Email'
                            value={email}
                            setValue={setEmail}
                            error={errors.email}
                        />
                        <InputGroup
                            placeholder='password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <InputGroup
                            placeholder='username'
                            value={username}
                            setValue={setUsername}
                            error={errors.setUsername}
                        />
                        <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'>
                            회원 가입
                        </button>
                    </form>
                    <small>
                        이미 가입하셨나요?
                        <Link href="/login">
                            로그인
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default SignUp;