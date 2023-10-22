import {AppProps} from 'next/app'
import * as React from "react";
import Layout from "../components/Layout";
import '/src/style/globall.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {connect, Provider} from "react-redux";
import {store} from "../redux/store";
import Loader from "../components/Loader";

function App({Component, pageProps}) {
    return (
        <>
            <Provider store={store}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <ToastContainer/>
            </Provider>
        </>
    )
}

export default App