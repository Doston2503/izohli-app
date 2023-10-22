import React, {FormEvent} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from "axios";
import {PATH_NAME} from "../../src/utils/constants";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

function Index() {
    const router = useRouter();

    function contactForm(e) {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`

            },
        };
        const postData = {
            firstname: e.target.firstname?.value,
            phoneNumber: e.target.phoneNumber?.value,
            description: e.target.description?.value
        };

        axios.post(`${PATH_NAME}users/contact`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    toast.success('Xabaringiz yuborildi');
                    // router.push('/');
                    e.target.reset();
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    return (
        <div>
            <Head>
                <title>Contact page</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>

            <div className="auth-page">
                <div className="auth-for-img">
                    <img src="/images/contact.png" alt=""/>
                </div>
                <div className="auth-for-form">
                    <div className="form-header">
                        <Link className="arrow-img" href="/">
                            <img src="/images/arrow.png" alt=""/>
                        </Link>
                        <div className="title">Bog’lanish</div>
                    </div>

                    <div className="form-body">
                        <Link href={'/'} className="contact-logo">
                            <img src="/images/contactLogo.svg" alt=""/>
                        </Link>
                        <div className="number">
                            <a href={'#'}>info@izohli.uz</a>
                            <a href={'#'}>+99871 123 45 67</a>
                        </div>
                        <div className="address">
                            Toshkent shahri, Chilonzor tumani, Bunyodkor ko’chasi, 168
                        </div>
                    </div>

                    <div className="form">
                        <form onSubmit={contactForm}>
                            <div className="row">
                                <div className="col-xl-6">
                                    <label htmlFor="firstname">Ismingiz</label>
                                    <input
                                        className="form-control"
                                        id={'firstname'}
                                        name="firstname"
                                        type="text"
                                    />
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="phoneNumber">Telefon</label>
                                    <input
                                        className="form-control"
                                        id={'phoneNumber'}
                                        name="phoneNumber"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                  <textarea
                      name="description"
                      cols={30}
                      placeholder={'Savol va taklif '}
                      rows={5}
                      className="form-control"
                  />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="checkbox-input">
                                        <input id={'checkbox'} name="checkbox" type="checkbox"/>
                                        <label htmlFor="checkbox" className="ms-3">
                                            <Link href={'#'}>Saytdan foydalanish shartlari</Link> bilan
                                            tanishib chiqdim va ularga roziman.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button type={'submit'} className="auth-btn">
                                Jo’natish
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
