import React, {FormEvent} from 'react';
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import {PATH_NAME} from "../../src/utils/constants";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

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
            firstname: e.target.firstname?.value,
            lastname: e.target.lastname?.value,
            phoneNumber: e.target.phoneNumber?.value,
            username: e.target.username?.value,
            password: e.target.password?.value,
        };

        axios.post(`${PATH_NAME}users/register`, postData, headers)
            .then((response) => {

                if (response.data?.success) {
                    toast.success("Ro'yhatdan o'tdingiz !!");
                    axios.post(`${PATH_NAME}users/login`, {
                        username:response.data?.data?.username,
                        password:e.target.password?.value,
                    }, headers)
                        .then((response2) => {
                            if (response2.data?.success) {
                                e.target.reset();
                                localStorage.setItem('timestamp',response2.data?.data?.timestamp);
                                localStorage.setItem('accessToken',response2.data?.data?.accessToken);
                                if (response2?.data?.data?.status){
                                    router.push('/admin/category');
                                }
                                else{
                                    router.push('/');
                                }
                            }
                        })
                        .catch((error) => {
                            toast.error('Login yoki parol xato');
                            console.error('Error:', error);
                        });

                } else {
                    toast.error(response.data?.errorList ? response.data?.errorList[0]?.message : 'Xatolik')
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
                <title>Register page</title>
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
                                <div className="col-xl-6">
                                    <label htmlFor="firstname">Ism</label>
                                    <input
                                        required={true}
                                        placeholder={"Doston"}
                                        className='form-control'
                                        id={'firstname'}
                                        name='firstname'
                                        type="text"/>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="lastname">Familiya</label>
                                    <input
                                        required={true}
                                        placeholder={"Rajabov"}
                                        className='form-control'
                                        id={'lastname'}
                                        name='lastname'
                                        type="text"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6">
                                    <label htmlFor="phoneNumber">Telefon</label>
                                    <input
                                        required={true}
                                        placeholder={"+998941234567"}
                                        className='form-control'
                                        id={'phoneNumber'}
                                        name='phoneNumber'
                                        type="text"/>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="username">Login</label>
                                    <input
                                        required={true}
                                        placeholder={"username"}
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
                                        required={true}
                                        placeholder={'******'}
                                        className='form-control'
                                        id={'password'}
                                        name='password'
                                        type="password"/>
                                </div>
                            </div>

                            {/*  <div className="row">
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
                                Ro’yxatdan o’tish
                            </button>
                        </form>

                        <div className="text">
                            Avval ro’yxatdan o’tganimsiz ? <Link href={'/login'}>Kirish</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
