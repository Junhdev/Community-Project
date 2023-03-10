import React from 'react';
import { useRecoilValue } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import LoginForm from './LoginForm';
import SignUp from './SignUp';

/* AuthModal 컴포넌트의 body 부분에 렌더링 되는 컴포넌트 */
const AuthInputs:React.FC = () => {
    const modalState = useRecoilValue(authModalState);
    
    return (
        <div>
            {/* view값에 따른 렌더링 설정 */}
            {/* view값이 login일때 로그인폼 띄어주기 */}
            {modalState.view === "login" && <LoginForm />}

            {/* view값이 signup일때 회원가입창 띄어주기 */}
            {modalState.view === "signup" && <SignUp />}
            
            {/*modalState.view === "resetPassword" && "Reset Password"*/}
        </div>
    )
}

export default AuthInputs;