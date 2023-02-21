import React from 'react';
import AuthButton from './AuthButton';

type RightContentProps = {
    // user:any;
};

const RightContent:React.FC<RightContentProps> = () => {
    
    return (
        <>
        <div>
            {/* <AuthModal /> */}
        </div>
        <div>
            <AuthButton />
        </div>
        </>
    );
}
export default RightContent;