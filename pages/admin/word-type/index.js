import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import Head from "next/head";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from 'react-select';
import {useRouter} from "next/router";
import ReactPaginate from "react-paginate";

function Index(props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [selectedOption, setSelectedOption] = useState(null);
    const [types, setTypes] = useState([]);
    const [words, setWords] = useState([]);
    const [wordsTypes, setWordsTypes] = useState([]);
    const [updateWordTypeElement, setUpdateWordTypeElement] = useState({});
    const [wordTypeId, setWordTypeId] = useState(null);
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

    function getAllType() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}types/get-all`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setTypes(response.data.data);
                }
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
        axios.get(`${PATH_NAME}words/get-all`, headers)
            .then((response) => {
                setWords(response.data.data);
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    function getAllWordType() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}word-type/search-word-type?page=0&size=10&wordName=`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setWordsTypes(response.data.data);
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllWords();
        getAllType();
        getAllWordType();
    }, []);

    function addWordTypeForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            typeId: e.target.typeId?.value,
            wordId: e.target.wordId?.value,
        };

        axios.post(`${PATH_NAME}word-type`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWordType();
                    e.target.reset();
                    setIsOpen(false);
                    setSelectedOption(null);
                    toast.success('Add word type')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteWordTypeId(id) {
        setWordTypeId(id);
        setDeleteModal(true)
    }

    function deleteWordType() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}word-type/${wordTypeId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWordType();
                    toast.success('Deleted word type');
                    setDeleteModal(false);
                    setWordTypeId(null)
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
        setWordTypeId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}word-type/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateWordTypeElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateWordType(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            typeId: e.target.typeId?.value,
            wordId: e.target.wordId?.value,

        };


        axios.put(`${PATH_NAME}word-type/${wordTypeId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllWordType();
                    e.target.reset();
                    setUpdateModal(false);
                    setUpdateWordTypeElement({});
                    setWordTypeId(null);
                    setSelectedOption(null);
                    toast.success('Update word type')
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
        return  await axios.get(`${PATH_NAME}word-type/search-word-type?page=${page}&size=10&wordName=${wordName}`)
            .then((res) => {
                return res.data?.data
            });


    };
    const handleClick = async (event) => {
        let page = event.selected;
        const result = await changePagination(page);
        setWordsTypes(result)
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
        axios.get(`${PATH_NAME}word-type/search-word-type?page=0&size=10&wordName=${e.target.wordName?.value}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setWordsTypes(response.data?.data)
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
                <title>Word type</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Word type page</h4>
                    <button onClick={toggleModal}>
                        Add word type
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
                            <th>TYPE NAME</th>
                            <th>WORD NAME</th>
                            <th>CREATED AT</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {wordsTypes?.content?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.typeName}</td>
                                <td>{item.wordName}</td>
                                <td>{item.createdAt?.substring(0, 10)}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteWordTypeId(item.id)}
                                            className="btn btn-sm btn-danger ms-2">delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>

                <div className="row my-4">
                    <div className="col-xl-12">
                        <div className="d-flex justify-content-center">
                            <ReactPaginate
                                pageCount={Math.ceil(wordsTypes?.totalElements / 10)}
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
                <ModalHeader toggle={toggleModal}>Add word type</ModalHeader>

                <form onSubmit={addWordTypeForm}>
                    <ModalBody>
                        <label htmlFor="wordId">Word Id</label>
                        <Select
                            className="mb-3 "
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

                        <label htmlFor="typeId">Type Id</label>
                        <select required={true} name="typeId"
                                id="typeId" className="form-select ">
                            <option value="" disabled={true} selected={true}>select</option>
                            <>
                                {types?.map((item, index) => (
                                    <option value={item.id}>{item.name}</option>
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
                <ModalHeader toggle={toggleUpdateModal}>Update word type</ModalHeader>

                <form onSubmit={updateWordType}>
                    <ModalBody>
                        <label htmlFor="typeId">Type Id</label>
                        <select required={true} name="typeId"
                                defaultValue={updateWordTypeElement?.typeId}
                                id="typeId" className="form-select mb-3">
                            <option value="" disabled={true} selected={true}>select</option>
                            <>
                                {types?.map((item, index) => (
                                    <option value={item.id}>{item.name}</option>
                                ))}
                            </>
                        </select>

                        <label htmlFor="wordId">Word Id</label>
                        <Select
                            id="wordId"
                            name="wordId"
                            defaultValue={updateWordTypeElement?.wordId ? words?.filter(word => word.id === updateWordTypeElement?.wordId)?.map(item => ({
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
                    <button type="submit" className="btn btn-danger" onClick={deleteWordType}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;