import { authModalState } from '@/src/atoms/authModalAtom';
import React from 'react';
import { useSetRecoilState } from 'recoil';



const AuthButton:React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState); // useSetRecoilState(Recoil 상태값 업데이트 하기 위한 setter 함수 반환) 이용해서 atom함수 가져온다
    //console.log(authModalState)
    return (
        <>
        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" 
        onClick={()=> setAuthModalState({ open: true, view: "login" })}> {/* setAuthModalState로 클릭시 객체의 속성을 업데이트 */}
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