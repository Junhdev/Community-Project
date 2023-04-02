
import React from 'react';
import Navbar from 'src/components/Navbar/Navbar';

const Layout = ({ children } : any) => {
    return (
        <>
        <Navbar />
        <main>{children}</main> 
        </>
    );
};

export default Layout;







/* 
import React from 'react';
import Navbar from 'src/components/Navbar/Navbar';

const Layout = ({ children }) => {
    return (
        <>
        <Navbar />
        <main>{children}</main> 
        </>
    );
};

export default Layout;

*/