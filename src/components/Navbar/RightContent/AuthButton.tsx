import { authModalState } from '@/src/atoms/authModalAtom';
import React from 'react';
import { useSetRecoilState } from 'recoil';



const AuthButton:React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState); //authModalAtom 이용
    console.log(authModalState)
    return (
        <>
        {/* Button은 따로 컴포넌트 x?? 태그에서 로직 활용 + 자체 디자인 ? */}
        
        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" 
        onClick={()=> setAuthModalState({ open: true, view: "login" })}>
        로그인
        </button>
        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" 
        onClick={()=> setAuthModalState({ open: true, view: "signup" })}>
        회원가입
        </button>
        
        </>
    );
}
export default AuthButton;