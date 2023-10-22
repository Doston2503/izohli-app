import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import Head from "next/head";
import {connect, useDispatch} from "react-redux";
import {updateState} from "../../../redux/actions/mainAction";
import ReactPaginate from "react-paginate";

function Index(props) {
    const dispatch = useDispatch();
    const arr = [
        'A',
        'B',
        'D',
        'E',
        'F',
        'G',
        'H',
        'L',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'X',
        'Y',
        'Z',
        'O’',
        'G’',
        'Sh',
        'Ch',
    ];
    const [words, setWords] = useState({});
    const router = useRouter();
    const letter = router?.query?.letter;

    function selectedLetter(letter) {
        router.push(`/alphabet/${letter}`)
    }

    function selectedWord(word) {
        router.push(`/search/${word}`)
    }

    function getAllDayWord() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        dispatch(updateState({isLoading: true}));
        axios.get(`${PATH_NAME}words/get-all-word-search?latter=${letter}&page=0&size=100`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setWords(response.data?.data)
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
        getAllDayWord()
    }, [letter]);

    const changePagination = async (page) => {
        return  await axios.get(`${PATH_NAME}words/get-all-word-search?latter=${letter}&page=${page}&size=100`)
            .then((res) => {
                return res.data?.data
            });


    };
    const handleClick = async (event) => {
        let page = event.selected;
        const result = await changePagination(page);
        setWords(result)
    };

    return (
        <>
            <Head>
                <title>Alphabetical words</title>
            </Head>
            <div className="tab-response-component">
                <div className="container">
                    <ul className="alphabet">
                        {arr.map((item, index) => (
                            <li onClick={() => selectedLetter(item)} className={letter === item ? 'active-list' : ''}
                                key={index}>{item}</li>
                        ))}
                    </ul>

                    <hr/>

                    <div className="choose-letter">{letter} harfidan boshlanadigan so‘zlar</div>

                    <div className="row">
                        {words?.content?.map((item, index) => (
                            <div className="col-xl-2 col-sm-6 col-6" key={index}>
                                <div onClick={() => selectedWord(item?.label)} className="word"># {item?.label}</div>
                            </div>
                        ))}

                    </div>


                    <div className="row my-4">
                        <div className="col-xl-12">
                            <div className="d-flex justify-content-center">
                                <ReactPaginate
                                    pageCount={Math.ceil(words?.totalElement / 100)}
                                    previousLabel={
                                        <img src="/images/arrow-prev.svg" alt=""/>
                                    }
                                    nextLabel={
                                        <img src="/images/arrow-next.svg" alt=""/>
                                    }
                                    breakLabel={"..."}
                                    marginPagesDisplayed={3}
                                    onPageChange={handleClick}
                                    containerClassName={"pagination"}
                                    pageClassName={"page-item"}
                                    pageLinkClassName={"page-link"}
                                    previousClassName={"page-item prev-page-item"}
                                    previousLinkClassName={"page-link"}
                                    nextClassName={"page-item next-page-item"}
                                    nextLinkClassName={"page-link"}
                                    breakClassName={"page-item"}
                                    breakLinkClassName={"page-link"}
                                    activeClassName={"active"}

                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return {
        isLoading: state.main.isLoading,
    }
};

export default connect(mapStateToProps, {updateState})(Index);
