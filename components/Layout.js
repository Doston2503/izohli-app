import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import {useRouter} from 'next/router';
import SearchComponent from "./SearchComponent";
import Loader from "./Loader";
import {connect, Provider} from "react-redux";

function Layout({children, isLoading}) {
    const router = useRouter();
    const currentPath = router.pathname;
    const word = router?.query?.word;

    return (
        <div>
            {currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/contact'
            && !currentPath.startsWith('/admin') ? (
                <Navbar/>
            ) : (
                ''
            )}
            {currentPath === '/' || currentPath === '/word-of-day' || currentPath.startsWith('/alphabet')
            || currentPath.startsWith('/search') ? (
                <SearchComponent word={word}/>
            ) : (
                ''
            )}

            <div className="main-layout">{children}</div>

            {currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/contact'
            && !currentPath.startsWith('/admin')
                ? (
                    <Footer/>
                ) : (
                    ''
                )}

            {isLoading ? <Loader/> : ""}

        </div>
    );
}

const mapStateToProps = state => {
    return {
        isLoading: state.main.isLoading
    }
};


export default connect(mapStateToProps, {})(Layout);