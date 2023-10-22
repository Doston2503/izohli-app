import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import {formatDate, PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {getWords, updateState} from "../../../redux/actions/mainAction";
import {connect} from "react-redux";

function Index(props) {
    const router = useRouter();
    // const [selectedWord, setSelectedWord] = useState('');
    // const [words, setWords] = useState([]);
    const [dayWord, setDayWord] = useState({});
    const [formattedDate, setFormattedDate] = useState('');


    function getAllDayWords() {
        const token = localStorage.getItem('accessToken');
        const currentDay = new Date().toISOString().substring(0, 10);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}day-words/get-by-date?date=${currentDay}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setDayWord(response.data.data);
                    setFormattedDate(formatDate(response?.data?.data?.date));
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllDayWords();
        // getAllWord()
        props.getWords(router?.query?.word, true);
        props.updateState({searchWord: router?.query?.word})
    }, [router?.query?.word]);

    return (
        <>
            <Head>
                <title>Search word</title>
            </Head>
            <div className="search-response-component">
                {props.wordsPage?.length < 1 ?
                    <h1 className="text-center mb-5" style={{marginTop: '100px'}}>Siz izlagan so'z bizda mavjud
                        emas</h1> :

                    <>

                        {[props.wordsPage[0]]?.map((item, index) => (
                            <>
                                <div className="response-header">
                                    <div className="response-word">
                                        {item?.label}
                                        {/*<img src="/images/voice.svg" alt="" style={{cursor: 'pointer'}}/>
                                        <img src="/images/star.svg" alt=""/>*/}
                                    </div>
                                    <div className="word-accent">
                                        [ {item?.transcript} ] <i>{item?.categoryName}</i>
                                    </div>

                                    <div className="btn-group">
                                        <button className="spelling-btn"><a target="_blank"
                                                                            href="https://imlo.uz/">Imlosi</a></button>
                                        <button className="synonym-btn"><a target="_blank"
                                                                           href="https://sinonim.uz/">Senonimlari</a>
                                        </button>
                                    </div>
                                </div>

                                <div className="response-body">
                                    <div className="comment-text">
                                        Siz tanlagan soʻz uchun quyidagi izoh topildi.
                                    </div>
                                    {item?.notes?.map((item2, index2) => (
                                        <div className="text" key={index2}>
                                            <span>{index2 + 1}. {item2?.titles}</span>
                                            {item2?.descriptions ? item2?.descriptions + ',' : ''}
                                            <i>{item2?.sources}</i>
                                        </div>
                                    ))}


                                    {/*<div className="more-information">Qo’shimcha ma‘lumotlar</div>*/}

                                    <hr/>
                                </div>
                            </>
                        ))}
                    </>
                }
                <div className="response-footer">
                    <div className="source">Manba</div>
                    <div className="source-text">
                        Lugʻatimiz bazasida 1 552 196 soʻz jamlangan. Soʻzlar asosining izohi
                        olingan asosiy manba: E. Begmatov, A. Madvaliyev, N. Mahkamov, T.
                        Mirzayev, N. Toʻxliyev, E. Umarov, D. Xudoyberganova, A. Xojiyev.
                        2006-2008. Oʻzbek tilining izohli lugʻati. “Oʻzbekiston milliy
                        ensiklopediyasi” Davlat ilmiy nashriyoti.
                    </div>
                    <div className="word-count">
                        Izohli.uz saytining bazasida jami 87 109 ta so‘z
                    </div>
                    <hr/>
                </div>

                <div className="word-of-day">
                    <div className="title">
                        KUN SO’ZI
                        <span>{formattedDate}</span>
                    </div>
                    <div className="text">{dayWord?.wordName}</div>


                    <Link href={'/word-of-day'}>Batafsil</Link>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return {
        isLoading: state.main.isLoading,
        words: state.main.words,
        wordsPage: state.main.wordsPage,
    }
};

export default connect(mapStateToProps, {updateState, getWords})(Index);