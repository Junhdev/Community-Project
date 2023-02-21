import React from 'react';

type SearchInputProps = {
    //user
};

const SearchInput:React.FC<SearchInputProps> = () => {
    
    return (
        <div className="relative flex w-full flex-wrap items-stretch">
            <span className="z-10 h-full leading-snug font-normal absolute text-center text-slate-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-lock"></i>
            </span>
            <input type="text" placeholder="Search" className="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-80 pl-10"/>
        </div>
    )
}
export default SearchInput;