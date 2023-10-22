import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import Head from "next/head";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import {useRouter} from "next/router";
import ReactPaginate from "react-paginate";

function Index(props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [wordInSentence, setWordInSentence] = useState([]);
    const [words, setWords] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [updateWordInSentenceElement, setUpdateWordInSentenceElement] = useState({});
    const [wordInSentenceId, setWordInSentenceId] = useState(null);
    const [wordName, setWordName] = useState("");

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };
    const toggleUpdateModal = () => {
        setUpdateModal(!updateModal);
    };
    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };
    const handleChange2 = (selectedOption2) => {
        setSelectedOption2(selectedOption2);
    };


    function getAllWords() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}words/get-all`, headers)
            .then((response) => {
                setWords(response.data.data);
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    function getAllSentence() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}sentence/get-all`, headers)
            .then((response) => {
                setSentences(response.data.data);
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    function getAllWordInSentences() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}word-in-sentence/search-word-in-sentence?page=0&size=10&wordName=`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setWordInSentence(response.data.data);
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllWords();
        getAllSentence();
        getAllWordInSentences()
    }, []);

    function addWordInSentenceForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            orders: e.target.orders?.value ? e.target.orders?.value : 0,
            sentenceId: e.target.sentenceId?.value,
            wordId: e.target.wordId?.value
        };

        axios.post(`${PATH_NAME}word-in-sentence`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWordInSentences();
                    setSelectedOption(null);
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add word in sentence')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteWordInSentenceId(id) {
        setWordInSentenceId(id);
        setDeleteModal(true)
    }

    function deleteWordInSentence() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}word-in-sentence/${wordInSentenceId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWordInSentences();
                    toast.success('Deleted word in sentence');
                    setDeleteModal(false);
                    setWordInSentenceId(null)
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function openUpdateModal(id) {
        const token = localStorage.getItem('accessToken');
        setWordInSentenceId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}word-in-sentence/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateWordInSentenceElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateWordInSentence(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            orders: e.target.orders?.value ? e.target.orders?.value : 0,
            sentenceId: e.target.sentenceId?.value,
            wordId: e.target.wordId?.value

        };

        axios.put(`${PATH_NAME}word-in-sentence/${wordInSentenceId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWordInSentences();
                    e.target.reset();
                    setUpdateModal(false);
                    setUpdateWordInSentenceElement({});
                    setWordInSentenceId(null);
                    setSelectedOption(null);
                    setSelectedOption2(null);
                    toast.success('Update word in sentence')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    const changePagination = async (page) => {
        return  await axios.get(`${PATH_NAME}word-in-sentence/search-word-in-sentence?page=${page}&size=10&wordName=${wordName}`)
            .then((res) => {
                return res.data?.data
            });


    };
    const handleClick = async (event) => {
        let page = event.selected;
        const result = await changePagination(page);
        setWordInSentence(result)
    };
    function searchByWordName(e) {
        e.preventDefault();
        setWordName(e.target.wordName?.value);

        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}word-in-sentence/search-word-in-sentence?page=0&size=10&wordName=${e.target.wordName?.value}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setWordInSentence(response.data?.data)
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    return (
        <AdminLayout>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Word in sentence</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Word in sentence page</h4>
                    <button onClick={toggleModal}>
                        Add word in sentence
                    </button>
                </div>

                <div className="d-flex mt-3 w-25">
                    <form onSubmit={searchByWordName} className="d-flex">
                        <input
                            placeholder={"search by word name"}
                            name={'wordName'}
                            className="form-control"
                            type="search"/>
                        <button >Search</button>

                    </form>

                </div>

                <div className="category-page-content">
                    <table className="table table-bordered table-dark mt-3">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>ORDER</th>
                            <th>WORD NAME</th>
                            <th>SENTENCE NAME</th>
                            <th>CREATED AT</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {wordInSentence?.content?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.orders}</td>
                                <td>{item.wordName}</td>
                                <td>{item.sentenceName}</td>
                                <td>{item.createdAt?.substring(0, 10)}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteWordInSentenceId(item.id)}
                                            className="btn btn-sm btn-danger ms-2">delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>

                <div className="row mt-3">
                    <div className="col-xl-12">
                        <div className="d-flex justify-content-center">
                            <ReactPaginate
                                pageCount={Math.ceil(wordInSentence?.totalElements / 10)}
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


            <Modal isOpen={isOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add word in sentence</ModalHeader>

                <form onSubmit={addWordInSentenceForm}>
                    <ModalBody>
                        <label htmlFor="orders">Order</label>
                        <input type="number"
                               id="orders"
                               className="form-control mb-3"
                               name="orders"/>

                        <label htmlFor="wordId">Word Id</label>
                        <Select
                            className="mb-3"
                            id="wordId"
                            name="wordId"
                            value={selectedOption}
                            onChange={handleChange}
                            options={words?.map(item => ({
                                value: item.id,
                                label: item.label,
                            }))}
                            isSearchable={true}
                            placeholder="Search or select an option..."
                        />

                        <label htmlFor="sentenceId">Sentence Id</label>
                        <Select
                            className="mb-3"
                            id="sentenceId"
                            name="sentenceId"
                            value={selectedOption2}
                            onChange={handleChange2}
                            options={sentences?.map(item => ({
                                value: item.id,
                                label: item.contents,
                            }))}
                            isSearchable={true}
                            placeholder="Search or select an option..."
                        />
                        {/*<select name="sentenceId" id="sentenceId" className="form-select">
                            <option value="" disabled={true} selected={true}>select</option>

                            {sentences?.map((item, index) => (
                                <option key={index} value={item.id}>{item.contents}</option>
                            ))}
                        </select>*/}

                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleModal}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>

            </Modal>

             <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
                <ModalHeader toggle={toggleUpdateModal}>Update word in sentence</ModalHeader>

                <form onSubmit={updateWordInSentence}>
                   <ModalBody>
                        <label htmlFor="orders">Order</label>
                        <input type="number"
                               id="orders"
                               className="form-control mb-3"
                               defaultValue={updateWordInSentenceElement?.orders}
                               name="orders"/>

                        <label htmlFor="wordId">Word Id</label>
                        <Select
                            className="mb-3"
                            id="wordId"
                            name="wordId"
                            defaultValue={updateWordInSentenceElement?.wordId? words?.filter(word=>word.id===updateWordInSentenceElement?.wordId)?.map(item => ({
                                    value: item.id,
                                    label: item.label,
                                }))
                                : selectedOption}
                            onChange={handleChange}
                            options={words?.map(item => ({
                                value: item.id,
                                label: item.label,
                            }))}
                            isSearchable={true}
                            placeholder="Search or select an option..."
                        />

                        <label htmlFor="sentenceId">Sentence Id</label>
                       <Select
                           className="mb-3"
                           id="sentenceId"
                           name="sentenceId"
                           defaultValue={updateWordInSentenceElement?.sentenceId? sentences?.filter(sentence=>sentence.id===updateWordInSentenceElement?.sentenceId)?.map(item => ({
                                   value: item.id,
                                   label: item.contents,
                               }))
                               : selectedOption2}
                           onChange={handleChange2}
                           options={sentences?.map(item => ({
                               value: item.id,
                               label: item.contents,
                           }))}
                           isSearchable={true}
                           placeholder="Search or select an option..."
                       />
                        {/*<select name="sentenceId" id="sentenceId"
                                defaultValue={updateWordInSentenceElement?.sentenceId}
                                className="form-select">
                            <option value="" disabled={true} selected={true}>select</option>

                            {sentences?.map((item,index)=>(
                                <option key={index} value={item.id}>{item.contents}</option>
                            ))}
                        </select>*/}

                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleUpdateModal}>Close</button>
                        <button type="submit" className="btn btn-warning">Update</button>
                    </ModalFooter>
                </form>

            </Modal>

            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalBody>
                    <h4>Are you sure you want to delete the data?</h4>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-secondary" onClick={toggleDeleteModal}>No</button>
                    <button type="submit" className="btn btn-danger" onClick={deleteWordInSentence}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;