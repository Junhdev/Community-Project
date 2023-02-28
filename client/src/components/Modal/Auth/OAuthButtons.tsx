import React from 'react';


const OAuthButtons:React.FC = () => {
    
    return (
        <>
        <div>
            <button className="mb-2">
                <img className="w-8 h-8 inline-flex" src="images/Google__G__Logo.svg.png" alt="Google__G__Logo" />
                <span className="m-2">Continue with Google</span>
            </button>
            <button className="mb-2">
                <img className="w-8 h-8 inline-flex" src="images/KakaoTalk_logo.svg.png" alt="KakaoTalk_logo" />
                <span className="m-2">Continue with KakaoTalk</span>
            </button>
            <button>
                <img className="w-8 h-8 inline-flex" src="images/btnG_아이콘원형.png" alt="Naver_logo" />
                <span className="m-2">Continue with Naver</span>
            </button>
        </div>
        </>
    )
}
export default OAuthButtons;