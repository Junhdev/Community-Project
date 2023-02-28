import React from 'react';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';

const Navbar = () => {
    
    return (
        <nav className="relative w-full flex flex-wrap items-center justify-between py-3 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg">
            <div className="container-fluid w-full flex flex-auto flex-wrap items-center justify-between px-6">
                <div className="container-fluid flex-none">
                    <a className="text-xl text-black">Study</a>
                </div>
                <div className="flex-auto px-8">
                    <SearchInput />
                </div>
                <div className="flex justify-self-end">
                    <RightContent />
                </div>
                
                
            </div>
            
        </nav>




    )
}
export default Navbar;