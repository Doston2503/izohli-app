import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import Head from "next/head";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";
import {useRouter} from "next/router";

function Index(props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [categories, setCategories] = useState([]);
    const [words, setWords] = useState([]);
    const [updateWordElement, setUpdateWordElement] = useState({});
    const [wordId, setWordId] = useState(null);
    const [searchWord, setSearchWord] = useState("");

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };
    const toggleUpdateModal = () => {
        setUpdateModal(!updateModal);
    };

    function getAllCategories() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}category/get-all`, headers)
            .then((response) => {
                setCategories(response.data.data);
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    function getAllWords() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}words/get-all-word-search?latter=&page=0&size=10`, headers)
            .then((response) => {
                setWords(response.data.data);
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllWords();
        getAllCategories()
    }, []);

    function addWordsForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            label: e.target.label?.value,
            transcript: e.target.transcript?.value,
            categoryId: e.target.categoryId?.value,
            numView: 0,
            numLike: 0,
            numShare: 0
        };

        axios.post(`${PATH_NAME}words`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWords();
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add words')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteWordId(id) {
        setWordId(id);
        setDeleteModal(true)
    }

    function deleteWord() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}words/${wordId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWords();
                    toast.success('Deleted words');
                    setDeleteModal(false);
                    setWordId(null)
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
        setWordId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}words/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateWordElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateWord(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            label: e.target.label?.value,
            transcript: e.target.transcript?.value,
            categoryId: e.target.categoryId?.value,
            numView: 0,
            numLike: 0,
            numShare: 0
        };

        axios.put(`${PATH_NAME}words/${wordId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWords();
                    e.target.reset();
                    setUpdateModal(false);
                    setUpdateWordElement({});
                    setWordId(null);
                    toast.success('Update word')
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
        return  await axios.get(`${PATH_NAME}words/get-all-word-search?latter=${searchWord}&page=${page}&size=10`)
            .then((res) => {
                return res.data?.data
            });


    };
    const handleClick = async (event) => {
        let page = event.selected;
        const result = await changePagination(page);
        setWords(result)
    };

    function searchByLabel(e) {
        e.preventDefault();
        setSearchWord(e.target.latter?.value);

        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}words/get-all-word-search?latter=${e.target.latter?.value}&page=0&size=10`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setWords(response.data?.data)
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
                <title>Words</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Words page</h4>
                    <button onClick={toggleModal}>
                        Add word
                    </button>
                </div>

                <div className="d-flex mt-3 w-25">
                    <form onSubmit={searchByLabel} className="d-flex">
                        <input
                            placeholder={"search by label"}
                            name={'latter'}
                            className="form-control"
                            type="search"/>
                            <button >Search</button>

                    </form>

                </div>

                <div className="category-page-content">
                    <table className="table table-bordered table-dark mt-3">
                        <thead>
                        <tr>
                            <th>N</th>
                            <th>LABEL</th>
                            <th>TRANSCRIPT</th>
                            <th>CATEGORY NAME</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {words?.content?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.label}</td>
                                <td>{item.transcript}</td>
                                <td>{item.categoryName}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteWordId(item.id)}
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
                                pageCount={Math.ceil(words?.totalElement / 10)}
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
                <ModalHeader toggle={toggleModal}>Add words</ModalHeader>

                <form onSubmit={addWordsForm}>
                    <ModalBody>
                        <label htmlFor="label">Label</label>
                        <input type="text"
                               required={true}
                               id={'label'}
                               name={'label'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="transcript">Transcript</label>
                        <input type="text"
                               required={true}
                               id={'transcript'}
                               name={'transcript'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="categoryId">Category Id</label>
                        <select required={true} name="categoryId"
                                id="categoryId" className="form-select">
                            <option value="" disabled={true} selected={true}>select</option>
                            <>
                                {categories?.map((item, index) => (
                                    <option value={item.id}>{item.names}</option>
                                ))}
                            </>
                        </select>
                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleModal}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>

            </Modal>

            <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
                <ModalHeader toggle={toggleUpdateModal}>Update words</ModalHeader>

                <form onSubmit={updateWord}>
                    <ModalBody>
                        <label htmlFor="label">Label</label>
                        <input type="text"
                               defaultValue={updateWordElement?.label}
                               required={true}
                               id={'label'}
                               name={'label'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="transcript">Transcript</label>
                        <input type="text"
                               defaultValue={updateWordElement?.transcript}
                               required={true}
                               id={'transcript'}
                               name={'transcript'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="categoryId">Category Id</label>
                        <select required={true} name="categoryId"
                                defaultValue={updateWordElement?.categoryId}
                                id="categoryId" className="form-select">
                            <option value="" disabled={true} selected={true}>select</option>
                            <>
                                {categories?.map((item, index) => (
                                    <option value={item.id}>{item.names}</option>
                                ))}
                            </>
                        </select>
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
                    <button type="submit" className="btn btn-danger" onClick={deleteWord}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;