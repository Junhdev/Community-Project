import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";


const SelectCategory = () => {
    // handle 특정카테고리 클릭하면 데이터베이스에 저장 category post요청
    // Router.push /create로 이동 
    const [category, setCategory] = useState("");
    const categoryList = [
        {
          name: "카테고리1",
          
          
          
        },
        {
            name: "카테고리2",
         
        },
        {
            name: "카테고리3",
         
        }
      ]

    const [errors, setErrors] = useState<any>({});
    let router = useRouter();
    
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await axios.post("/communities/category", { category });

            router.push('/communities/create');
        } catch (error: any) {
            console.log(error);
            setErrors(error.response.data);
        }
    }
    
    return ( //카테고리 UI 생성
    <>
    {categoryList.map((a,i)=>(
                <div key={i}>
                    <form onSubmit={handleSubmit}>
                    <button onClick={()=>{setCategory(a.name)}}>카테고리명: {a.name}</button>
                    </form>
                </div>
            ))}

    </>
    )
}

export default SelectCategory;