import React, { useState, ChangeEvent } from 'react';

// return 값에 대한 type 설정
/* export interface useInputProps = 
    { value: string | number, (e: ChangeEvent) => void }; */

const useInput:React.FC = (initialValue: string) => {
    const [inputValue, setInputValue] = useState(initialValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update state
        setInputValue(event.target.value);
    };

    return { // 상위폴더에서 spread operator 사용하려면 return값 설정이 중요하다.
        value: inputValue, // **check
        onChange: handleChange
    };
};

export default useInput;