import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

function Navbar(props) {
    const router = useRouter();
    const currentPath = router.pathname;

    const [open, setOpen] = useState(false);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />

            <div className="container">
                <div className="main-navbar">
                    <nav className="navbar navbar-expand-md">
                        <div className="d-flex">
                            <button
                                className="navbar-toggler"
                                onClick={() => setOpen(!open)}
                                aria-expanded={open}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsibleNavbar"/>
                            <Link href="/">
                                <img src="/images/logo.svg" alt="" />
                            </Link>
                        </div>
                        <button className={'active-btn login-btn'}>
                            <Link href="/login">Kirish</Link>
                        </button>
                        {open ? <hr className="mobile-line" /> : ''}

                        <div className="collapse navbar-collapse" id="collapsibleNavbar">
                            <ul className="main-menu">
                                <li>
                                    <Link className="main-link" href="/">
                                        Asosiy
                                    </Link>
                                </li>
                                <li>
                                    <Link className="main-link" href="/about">
                                        Loyiha haqida
                                    </Link>
                                </li>
                                <li>
                                    <Link className="main-link" href="/contact">
                                        Bog'lanish
                                    </Link>
                                </li>

                            </ul>
                        </div>

                       {/* <div className="btn-group">
                            <button className={'register-btn'}>
                                <Link href="/register">Ro’yxatdan o’tish</Link>
                            </button>
                            <button className={'active-btn'}>
                                <Link href="/login">Kirish</Link>
                            </button>
                        </div>*/}
                    </nav>
                </div>

                {open ? <div className="backdrop-filter" /> : ''}
            </div>
        </>
    );
}

export default Navbar;