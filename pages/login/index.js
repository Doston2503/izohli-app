import React from 'react';
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import {PATH_NAME} from "../../src/utils/constants";
import {toast} from "react-toastify";
import { useRouter } from 'next/router';
function Index() {
    const router = useRouter();

    function auth(e) {
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        const postData = {
            username: e.target.username?.value,
            password: e.target.password?.value,
        };

        axios.post(`${PATH_NAME}users/login`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    localStorage.setItem('timestamp',response.data?.data?.timestamp);
                    localStorage.setItem('accessToken',response.data?.data?.accessToken);
                    router.push('/admin/category');
                    toast.success("Ro'yhatdan o'tdingiz !!");

                }
            })
            .catch((error) => {
                toast.error('Login yoki parol xato');
                console.error('Error:', error);
            });
    }

    return (
        <div>
            <Head>
                <title>Login page</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                    crossOrigin="anonymous" defer/>

            <div className="auth-page">
                <div className="auth-for-img">
                    <img src="/images/loginImg.png" alt=""/>
                </div>
                <div className="auth-for-form">
                    <div className="form-header">
                        <Link className="arrow-img" href='/'>
                            <img src="/images/arrow.png" alt=""/>
                        </Link>
                        <div className="title">
                            Izohli uchun ro'yxatdan o'tish
                        </div>
                    </div>

                    <div className="form">
                        <form onSubmit={auth}>
                            <div className="row">
                                <div className="col-xl-12">
                                    <label htmlFor="username">Login</label>
                                    <input
                                        placeholder={'username'}
                                        className='form-control'
                                        id={'username'}
                                        name='username'
                                        type="text"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <label htmlFor="password">Parol</label>
                                    <input
                                        placeholder={'6+belgilar'}
                                        className='form-control'
                                        id={'password'}
                                        name='password'
                                        type="password"/>
                                </div>
                            </div>

                           {/* <div className="row">
                                <div className="col-xl-12">
                                    <div className="checkbox-input">
                                        <input
                                            id={'checkbox'}
                                            name='checkbox'
                                            type="checkbox"/>
                                        <label htmlFor="checkbox" className="ms-3">
                                            <Link href={'#'}>Saytdan foydalanish shartlari</Link>
                                            bilan tanishib chiqdim va ularga roziman.
                                        </label>
                                    </div>
                                </div>
                            </div>*/}

                            <button type={'submit'} className="auth-btn">
                                Kirish
                            </button>
                        </form>

                          <div className="text">
                            Avval ro’yxatdan o’tmaganmisiz ?  <Link href={'/register'}>Ro’yxatdan o’tish</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
