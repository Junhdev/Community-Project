import React from 'react';
import Navbar from 'src/components/Navbar/Navbar';
import { useRouter } from 'next/router';

const { pathname } = useRouter();
const authRoutes = ["/signup", "/login"];
const authRoute = authRoutes.includes(pathname);

const Layout = ({ children } : any) => {
    return (
        <>
        {/* Navbar는 signup페이지와 login페이지에서 안나타나게 설정 */}
        {!authRoute && <Navbar />}
        <main>{children}</main> 
        </>
    );
};

export default Layout;






