import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Link from "next/link";
import Head from "next/head";
function Footer() {
    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>

                    <div className="container">
                        <div className="footer">
                            <Link href={'/'} className="logo">
                                <img src="/images/logo.svg" alt=""/>
                                <div className="year">
                                    {/*© Izohli.uz 2023*/}
                                </div>
                            </Link>

                            <ul className="main-menu">
                                <li><Link className='main-link' href='/'>Asosiy</Link></li>
                                <li><Link className='main-link' href='/about'>Loyiha haqida</Link></li>
                                <li><Link className='main-link' href='/contact'>Bog'lanish</Link></li>
                            </ul>

                            <div className="social-media">
                                <div className="messenger">
                                    <Link href="#" className="telegram-image">
                                        <img src="/images/telegram.png" alt=""/>
                                    </Link>
                                    <Link href="#" className="facebook-image">
                                        <img src="/images/facebook.png" alt=""/>
                                    </Link>
                                </div>
                                <div className="address-and-phone">
                                    <Link href="#">
                                        info@izohli.uz
                                    </Link>
                                    <Link href="#" className="mt-3">
                                        +99871 123 45 67
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    );
}

export default Footer;