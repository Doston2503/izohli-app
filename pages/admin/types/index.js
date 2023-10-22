import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import Head from "next/head";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {useRouter} from "next/router";

function Index(props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const [types, setTypes] = useState([]);
    const [updateTypeElement, setUpdateTypeElement] = useState({});
    const [typeId, setTypeId] = useState(null);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };
    const toggleUpdateModal = () => {
        setUpdateModal(!updateModal);
    };

    function getAllType() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}types/get-all`, headers)
            .then((response) => {
                if (response.data?.success){
                    setTypes(response.data.data);
                }
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getAllType()
    }, []);

    function addTypeForm(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            name: e.target.name?.value,
            orders: e.target.orders?.value,
        };

        axios.post(`${PATH_NAME}types`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllType();
                    e.target.reset();
                    setIsOpen(false);
                    toast.success('Add types')
                }
            })
            .catch((error) => {
                toast.error('Error');
                if (error.response?.status===403){
                    router.push('/login')
                }
            });
    }

    function getDeleteTypeId(id) {
        setTypeId(id);
        setDeleteModal(true)
    }

    function deleteType() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}types/${typeId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllType();
                    toast.success('Deleted type');
                    setDeleteModal(false);
                    setTypeId(null);
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
        setTypeId(id);
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.get(`${PATH_NAME}types/get?id=${id}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    setUpdateTypeElement(response.data.data);
                    setUpdateModal(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function updateType(e) {
        const token = localStorage.getItem('accessToken');
        e.preventDefault();
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const postData = {
            name: e.target.name?.value,
            orders: e.target.orders?.value,
        };

        axios.put(`${PATH_NAME}types/${typeId}`, postData, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllType();
                    e.target.reset();
                    setUpdateModal(false);
                    setTypeId(null);
                    setUpdateTypeElement({});
                    toast.success('Update type')
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
                <title>Types</title>
            </Head>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Types page</h4>
                    <button onClick={toggleModal}>
                        Add types
                    </button>
                </div>

                <div className="category-page-content">
                    <table className="table table-bordered table-dark mt-3">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>ORDERS</th>
                            <th>CREATED AT</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {types?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.orders}</td>
                                <td>{item.createdAt?.substring(0, 10)}</td>
                                <td>
                                    <button onClick={() => openUpdateModal(item.id)}
                                            className="btn btn-sm btn-warning">update
                                    </button>
                                    <button onClick={() => getDeleteTypeId(item.id)}
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
                <ModalHeader toggle={toggleModal}>Add types</ModalHeader>

                <form onSubmit={addTypeForm}>
                    <ModalBody>
                        <label htmlFor="name">Name</label>
                        <input type="text"
                               required={true}
                               id={'name'}
                               name={'name'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="orders">Order</label>
                        <input type="number"
                               required={true}
                               id={'orders'}
                               name={'orders'}
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
                <ModalHeader toggle={toggleUpdateModal}>Update type</ModalHeader>

                <form onSubmit={updateType}>
                    <ModalBody>
                        <label htmlFor="name">Name</label>
                        <input type="text"
                               defaultValue={updateTypeElement?.name}
                               required={true}
                               id={'name'}
                               name={'name'}
                               className="form-control mb-3 mt-1"
                        />

                        <label htmlFor="orders">Order</label>
                        <input type="number"
                               defaultValue={updateTypeElement?.orders}
                               required={true}
                               id={'orders'}
                               name={'orders'}
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
                    <button type="submit" className="btn btn-danger" onClick={deleteType}>Yes</button>
                </ModalFooter>
            </Modal>

        </AdminLayout>
    );
}

export default Index;