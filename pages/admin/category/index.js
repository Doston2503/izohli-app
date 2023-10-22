import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import Head from "next/head";
import {toast} from "react-toastify";
import {PATH_NAME} from "../../../src/utils/constants";
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {useRouter} from "next/router";


function Index(props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [categories, setCategories] = useState([]);
    const [updateCategoryElement, setUpdateCategoryElement] = useState({});
    const [categoryId, setCategoryId] = useState(null);

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

    useEffect(() => {
        getAllCategories()
    }, []);

    function addCategoryForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`

            },
        };
        const postData = {
            names: e.target.names?.value,
            descriptions: e.target.descriptions?.value,
        };

        axios.post(`${PATH_NAME}category`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllCategories();
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add category')
                }

            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteCategoryId(id) {
        setCategoryId(id);
        setDeleteModal(true)
    }

    function deleteCategory() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}category/${categoryId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllCategories();
                    toast.success('Deleted category');
                    setDeleteModal(false)
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
        setCategoryId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}category/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateCategoryElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateCategory(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            names: e.target.names?.value,
            descriptions: e.target.descriptions?.value,
        };

        axios.put(`${PATH_NAME}category/${categoryId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllCategories();
                    e.target.reset();
                    setUpdateModal(false);
                    setUpdateCategoryElement({});
                    toast.success('Update category')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }


    return (
        <AdminLayout>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Category</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Category page</h4>
                    <button onClick={toggleModal}>
                        Add category
                    </button>
                </div>

                <div className="category-page-content">
                    <table className="table table-bordered table-dark mt-3">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>DESCRIPTION</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.names}</td>
                                <td>{item.descriptions}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteCategoryId(item.id)}
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
                <ModalHeader toggle={toggleModal}>Add category</ModalHeader>

                <form onSubmit={addCategoryForm}>
                    <ModalBody>
                        <label htmlFor="names">Name</label>
                        <input type="text"
                               required={true}
                               id={'names'}
                               name={'names'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="descriptions">Descriptions</label>
                        <textarea name="descriptions"
                                  id="descriptions"
                                  className="form-control"
                                  cols="30" rows="3"
                        />
                    </ModalBody>

                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={toggleModal}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>

            </Modal>

            <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
                <ModalHeader toggle={toggleUpdateModal}>Update category</ModalHeader>

                <form onSubmit={updateCategory}>
                    <ModalBody>
                        <label htmlFor="names">Name</label>
                        <input type="text"
                               defaultValue={updateCategoryElement?.names}
                               required={true}
                               id={'names'}
                               name={'names'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="descriptions">Descriptions</label>
                        <textarea name="descriptions"
                                  defaultValue={updateCategoryElement?.descriptions}
                                  id="descriptions"
                                  className="form-control"
                                  cols="30" rows="3"
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
                    <button type="submit" className="btn btn-danger" onClick={deleteCategory}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;