import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import axios from "axios";
import {formatDate, PATH_NAME} from "../src/utils/constants";
import {toast} from "react-toastify";
import {updateState} from "../redux/actions/mainAction";
import {connect, useDispatch} from 'react-redux';

function WordsOfDay(props) {
    const dispatch = useDispatch();

    const [word, setWord] = useState({});
    const [note, setNote] = useState({});
    const [dayWord, setDayWord] = useState({});
    const [formattedDate, setFormattedDate] = useState('');

    function getAllDayWords() {
        const token = localStorage.getItem('accessToken');
        const currentDay = new Date().toISOString().substring(0, 10);
        let wordId = null;
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        dispatch(updateState({isLoading: true}));
        axios.get(`${PATH_NAME}day-words/get-by-date?date=${currentDay}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setDayWord(response.data.data);
                    setFormattedDate(formatDate(response?.data?.data?.date));
                    wordId = response?.data?.data?.wordId;


                    axios.get(`${PATH_NAME}words/get?id=${wordId}`, headers)
                        .then((response) => {
                            if (response.data?.success) {
                                setWord(response.data?.data);
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });


                    axios.get(`${PATH_NAME}note/get-by-word-id?id=${wordId}`, headers)
                        .then((response) => {
                            if (response.data?.success) {
                                setNote(response.data?.data)
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            })
            .finally(() => {
                dispatch(updateState({isLoading: false}));
            });
    }

    useEffect(() => {
        if (props.isLoading){
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'auto';
        }
        getAllDayWords()
    }, []);

    return (
        <div>
            <div className="words-of-day-component">
                <div className="content-header">
                    <div className="word-name">
                        KUN SO’ZI
                        <span>{formattedDate}</span>
                    </div>
                    {/*  <div className="voice-image" style={{ cursor: "pointer" }}>
                        <img src="/images/voice.svg" alt="" />
                    </div>*/}
                </div>
                <div className="content-body">
                    <div className="word">{dayWord?.wordName}</div>
                    <div className="word-accent">[ {word?.transcript}]
                        <i className="ms-3">{word?.categoryName}</i>
                    </div>
                    <div className="word-description">{note?.titles}</div>
                    <Link href={'/word-of-day'} className="more-about-word">
                        Batafsil
                    </Link>
                </div>
                <div className="content-footer">
                    <Link href={'/word-of-day'} className="all-words">Barchasi</Link>
                    <div>
                        {/* <Link href={'/register'}>
                            Ro’yxatdan <br /> o’tish
                            <img src="/images/arrow-top.svg" alt="" />
                        </Link>*/}
                        <div className="start-day-by-word">
                            Har bir kunni "Kun so'zi" bilan boshlang!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isLoading: state.main.isLoading,
    }
};

export default connect(mapStateToProps, {updateState})(WordsOfDay);
