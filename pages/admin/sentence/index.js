import React from 'react';
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import Head from "next/head";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import ReactPaginate from "react-paginate";

function Index(props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [sentences, setSentences] = useState([]);
    const [updateSentenceElement, setUpdateSentenceElement] = useState({});
    const [sentenceId, setSentenceId] = useState(null);
    const [content, setContent] = useState("");

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };
    const toggleUpdateModal = () => {
        setUpdateModal(!updateModal);
    };

    function getAllSentence() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}sentence/search-sentence?page=0&size=10&contents=`, headers)
            .then((response) => {
                setSentences(response.data.data);
                console.log(response.data.data)
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllSentence()
    }, []);

    function addSentenceForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            contents: e.target.contents?.value,
        };

        axios.post(`${PATH_NAME}sentence`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllSentence();
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add sentence')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteSentenceId(id) {
        setSentenceId(id);
        setDeleteModal(true)
    }

    function deleteSentence() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}sentence/${sentenceId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllSentence();
                    toast.success('Deleted sentence');
                    setDeleteModal(false);
                    setSentenceId(null);
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
        setSentenceId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}sentence/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateSentenceElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateSentence(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            contents: e.target.contents?.value,
        };

        axios.put(`${PATH_NAME}sentence/${sentenceId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllSentence();
                    e.target.reset();
                    setUpdateModal(false);
                    setSentenceId(null);
                    setUpdateSentenceElement({});
                    toast.success('Update sentence')
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
        return  await axios.get(`${PATH_NAME}sentence/search-sentence?page=${page}&size=10&contents=${content}`)
            .then((res) => {
                return res.data?.data
            });


    };
    const handleClick = async (event) => {
        let page = event.selected;
        const result = await changePagination(page);
        setSentences(result)
    };
    function searchByContent(e) {
        e.preventDefault();
        setContent(e.target.content?.value);

        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}sentence/search-sentence?page=0&size=10&contents=${e.target.content?.value}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setSentences(response.data?.data)
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
                <title>Sentence</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Sentence page</h4>
                    <button onClick={toggleModal}>
                        Add sentence
                    </button>
                </div>

                <div className="d-flex mt-3 w-25">
                    <form onSubmit={searchByContent} className="d-flex">
                        <input
                            placeholder={"search by content"}
                            name={'content'}
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
                            <th>CONTENT</th>
                            <th>CREATED AT</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sentences?.content?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.contents}</td>
                                <td>{item.createdAt?.substring(0, 10)}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteSentenceId(item.id)}
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
                                pageCount={Math.ceil(sentences?.totalElements / 10)}
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
                <ModalHeader toggle={toggleModal}>Add sentence</ModalHeader>

                <form onSubmit={addSentenceForm}>
                    <ModalBody>
                        <label htmlFor="contents">Content</label>
                        <input type="text"
                               required={true}
                               id={'contents'}
                               name={'contents'}
                               className="form-control mb-3 mt-1"
                        />
                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleModal}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>

            </Modal>

            <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
                <ModalHeader toggle={toggleUpdateModal}>Update sentence</ModalHeader>

                <form onSubmit={updateSentence}>
                    <ModalBody>
                        <label htmlFor="contents">Contents</label>
                        <input type="text"
                               defaultValue={updateSentenceElement?.contents}
                               required={true}
                               id={'contents'}
                               name={'contents'}
                               className="form-control mb-3 mt-1"
                        />


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
                    <button type="submit" className="btn btn-danger" onClick={deleteSentence}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;