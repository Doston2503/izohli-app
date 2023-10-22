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
    const [notes, setNotes] = useState([]);
    const [words, setWords] = useState([]);
    const [updateNoteElement, setUpdateNoteElement] = useState({});
    const [noteId, setNoteId] = useState(null);
    const [title, setTitle] = useState("");

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

    function getAllNotes() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}note/search-note?page=0&size=10&title=`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setNotes(response.data.data);
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllWords();
        getAllNotes();
    }, []);

    function addNoteForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            titles: e.target.titles?.value,
            descriptions: e.target.descriptions?.value,
            sources: e.target.sources?.value ? e.target.sources?.value : null,
            wordId: e.target.wordId?.value
        };

        axios.post(`${PATH_NAME}note`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllNotes();
                    setSelectedOption(null);
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add note')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteNoteId(id) {
        setNoteId(id);
        setDeleteModal(true)
    }

    function deleteNote() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}note/${noteId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllNotes();
                    toast.success('Deleted note');
                    setDeleteModal(false);
                    setNoteId(null)
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
        setNoteId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}note/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateNoteElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateNote(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            titles: e.target.titles?.value,
            descriptions: e.target.descriptions?.value,
            sources: e.target.sources?.value ? e.target.sources?.value : null,
            wordId: e.target.wordId?.value

        };

        axios.put(`${PATH_NAME}note/get/${noteId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllNotes();
                    e.target.reset();
                    setUpdateModal(false);
                    setUpdateNoteElement({});
                    setNoteId(null);
                    setSelectedOption(null);
                    toast.success('Update note')
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
        return  await axios.get(`${PATH_NAME}note/search-note?page=${page}&size=10&title=${title}`)
            .then((res) => {
                return res.data?.data
            });


    };
    const handleClick = async (event) => {
        let page = event.selected;
        const result = await changePagination(page);
        setNotes(result)
    };

    function searchByTitle(e) {
        e.preventDefault();
        setTitle(e.target.title?.value);

        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}note/search-note?page=0&size=10&title=${e.target.title?.value}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setNotes(response.data?.data)
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
                <title>Note</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Note page</h4>
                    <button onClick={toggleModal}>
                        Add note
                    </button>
                </div>

                <div className="d-flex mt-3 w-25">
                    <form onSubmit={searchByTitle} className="d-flex">
                        <input
                            placeholder={"search by title"}
                            name={'title'}
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
                            <th>TITLE</th>
                            <th>DESCRIPTION</th>
                            <th>SOURCES</th>
                            <th>WORD NAME</th>
                            <th>CREATED AT</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {notes?.content?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td style={{width:"200px"}}>{item.titles}</td>
                                <td style={{width:"250px"}}>{item.descriptions}</td>
                                <td>{item.sources}</td>
                                <td>{item.wordName}</td>
                                <td>{item.createdAt?.substring(0, 10)}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteNoteId(item.id)}
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
                                pageCount={Math.ceil(notes?.totalElements / 10)}
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
                <ModalHeader toggle={toggleModal}>Add note</ModalHeader>

                <form onSubmit={addNoteForm}>
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

                        <label htmlFor="titles">Title</label>
                        <input type="text"
                               id="titles"
                               className="form-control mb-3"
                               name="titles"/>

                        <label htmlFor="descriptions">Description</label>
                        <textarea name="descriptions" id="descriptions"
                                  className="form-control mb-3"
                                  cols="30" rows="4"/>

                        <label htmlFor="sources">Sources</label>
                        <input type="text"
                               id="sources"
                               className="form-control mb-3"
                               name="sources"/>

                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleModal}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>

            </Modal>

            <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
                <ModalHeader toggle={toggleUpdateModal}>Update note</ModalHeader>

                <form onSubmit={updateNote}>
                    <ModalBody>
                        <label htmlFor="wordId">Word Id</label>
                        <Select
                            className="mb-3"
                            id="wordId"
                            name="wordId"
                            defaultValue={updateNoteElement?.wordId ? words?.filter(word => word.id === updateNoteElement?.wordId)?.map(item => ({
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

                        <label htmlFor="titles">Title</label>
                        <input type="text"
                               id="titles"
                               className="form-control mb-3"
                               defaultValue={updateNoteElement?.titles}
                               name="titles"/>

                        <label htmlFor="descriptions">Description</label>
                        <textarea name="descriptions" id="descriptions"
                                  className="form-control mb-3"
                                  defaultValue={updateNoteElement?.descriptions}
                                  cols="30" rows="4"/>

                        <label htmlFor="sources">Sources</label>
                        <input type="text"
                               id="sources"
                               className="form-control mb-3"
                               defaultValue={updateNoteElement?.sources}
                               name="sources"/>

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
                    <button type="submit" className="btn btn-danger" onClick={deleteNote}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;