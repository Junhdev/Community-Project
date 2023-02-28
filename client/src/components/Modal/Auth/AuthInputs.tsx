import React from 'react';
import { useRecoilValue } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import LoginForm from './LoginForm';
import SignUp from './SignUp';


const AuthInputs:React.FC = () => {
    const modalState = useRecoilValue(authModalState);
    
    return (
        <div>
        {modalState.view === "login" && <LoginForm />}
        {modalState.view === "signup" && <SignUp />}
        {/*modalState.view === "resetPassword" && "Reset Password"*/}
        </div>
    )
}

export default AuthInputs;