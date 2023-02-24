import React from "react";
import useInput from "@/src/hooks/useInput";


const LoginForm:React.FC = () => {
    const email = useInput("");
    const password = useInput("");

    const submitForm = (event) => {
        event.preventDefault();
        console.log("email", email.value);
        console.log("password", password.value);
    }; // ???

    return (
        <form onSubmit={submitForm}>
            <input placeholder="Email" {...email /*email 칸에 대한 return값 불러오기 즉, value={inputValue} onChange={handleChange} */ } />
            <input placeholder="Password" type="password" {...password} />
        </form>
    );
};

export default LoginForm;