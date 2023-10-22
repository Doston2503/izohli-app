import React, {useEffect, useRef, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import Head from "next/head";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";
import {useRouter} from "next/router";

function Index(props) {
    const formRef = useRef(null);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [selectedOption, setSelectedOption] = useState(null);
    const [dayWords, setDayWords] = useState([]);
    const [words, setWords] = useState([]);
    const [updateDayWordElement, setUpdateDayWordElement] = useState({});
    const [dayWordId, setDayWordId] = useState(null);

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

    function getAllDayWords() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}day-words/get-all`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setDayWords(response.data.data);
                    formRef?.current?.reset()
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllWords();
        getAllDayWords();
    }, []);

    function addDayWord(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            date: e.target.date?.value,
            wordId: e.target.wordId?.value
        };

        axios.post(`${PATH_NAME}day-words`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllDayWords();
                    setSelectedOption(null);
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add day word')
                }
                else{
                    toast.error('In this case, no new word can be added per day.')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteDayWord(id) {
        setDayWordId(id);
        setDeleteModal(true)
    }

    function deleteDayWord() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}day-words/${dayWordId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllDayWords();
                    toast.success('Deleted day word');
                    setDeleteModal(false);
                    setDayWordId(null)
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
        setDayWordId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}day-words/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateDayWordElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateDayWord(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            date: e.target.date?.value,
            wordId: e.target.wordId?.value

        };

        axios.put(`${PATH_NAME}day-words/${dayWordId}`, postData, headers)
            .then((response) => {

                if (response.data?.success) {
                    getAllDayWords();
                    e.target.reset();
                    setUpdateModal(false);
                    setUpdateDayWordElement({});
                    setDayWordId(null);
                    setSelectedOption(null);
                    toast.success('Update day word')
                }
                else{
                    toast.error('In this case, no new word can be added per day.')
                }

            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function searchByDate(e) {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}day-words/get-by-date-on-array?date=${e.target.date?.value}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setDayWords(response.data?.data)
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
                <title>Day word</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Day word page</h4>

                    <div className="d-flex">
                        <button onClick={toggleModal}>
                            Add day word
                        </button>
                    </div>

                </div>

                <div className="d-flex mt-3 w-25">
                    <form onSubmit={searchByDate} className="d-flex" ref={formRef}>
                        <input
                            name={'date'}
                            className="form-control"
                            type="date"/>
                        <button >Search</button>
                        <button onClick={getAllDayWords} type={"button"} className="ms-2">Reset</button>

                    </form>

                </div>


                <div className="category-page-content">
                    <table className="table table-bordered table-dark mt-3">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>WORD NAME</th>
                            <th>DATE</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dayWords?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.words?.label}</td>
                                <td>{item.date}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteDayWord(item.id)}
                                            className="btn btn-sm btn-danger ms-2">delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>
            </div>


            <Modal isOpen={isOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add day word</ModalHeader>

                <form onSubmit={addDayWord}>
                    <ModalBody>
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

                        <label htmlFor="date">Date</label>
                        <input type="date"
                               id="date"
                               className="form-control mb-3"
                               name="date"/>


                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleModal}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>

            </Modal>

            <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
                <ModalHeader toggle={toggleUpdateModal}>Update day word</ModalHeader>

                <form onSubmit={updateDayWord}>
                    <ModalBody>
                        <label htmlFor="wordId">Word Id</label>
                        <Select
                            className="mb-3"
                            id="wordId"
                            name="wordId"
                            defaultValue={updateDayWordElement?.wordId ? words?.filter(word => word.id === updateDayWordElement?.wordId)?.map(item => ({
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

                        <label htmlFor="date">Date</label>
                        <input type="date"
                               id="date"
                               defaultValue={updateDayWordElement?.date}
                               className="form-control mb-3"
                               name="date"/>


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
                    <button type="submit" className="btn btn-danger" onClick={deleteDayWord}>Yes</button>
                </ModalFooter>
            </Modal>

        </AdminLayout>
    );
}

export default Index;