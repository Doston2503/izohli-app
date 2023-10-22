import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import Head from "next/head";
import axios from "axios";
import {PATH_NAME} from "../../../src/utils/constants";
import {toast} from "react-toastify";
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import {useRouter} from "next/router";

function Index(props) {
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState(false);
    const [contactId, setContactId] = useState(null);
    const [contacts, setContacts] = useState([]);

    function getAllContacts() {
        const headers = {
            headers: {
                'Accept': 'application/json',
            },
        };
        axios.get(`${PATH_NAME}users/get-all-contact`, headers)
            .then((response) => {
                setContacts(response.data.data);
            })
            .catch((error) => {
                toast.error('Error');
                console.error('Error:', error);
            });
    }

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    function getDeleteContactId(id) {
        setDeleteModal(true);
        setContactId(id)
    }

    function deleteContact() {
        const token = localStorage.getItem('accessToken');
        const headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.delete(`${PATH_NAME}users/delete-contact/${contactId}`, headers)
            .then((response) => {
                if (response.data?.success) {
                    getAllContacts();
                    toast.success('Deleted contact');
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

    useEffect(() => {
        getAllContacts()
    }, []);

    return (
        <AdminLayout>
            <Head>
                <title>Admin contact</title>
            </Head>

            <div className="admin-category-page">
                <div className="category-page-header">
                    <h4>Contact page</h4>
                </div>

                <div className="category-page-content">
                    <table className="table table-bordered table-dark mt-3">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>FIRSTNAME</th>
                            <th>PHONE NUMBER</th>
                            <th>DESCRIPTION</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contacts?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.firstname}</td>
                                <td>{item.phoneNumber}</td>
                                <td>{item.description}</td>
                                <td>
                                    <button
                                        onClick={() => getDeleteContactId(item?.id)}
                                        className="btn btn-danger btn-sm">delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={deleteModal} toggle={deleteContact}>
                <ModalBody>
                    <h4>Are you sure you want to delete the data?</h4>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-secondary" onClick={toggleDeleteModal}>No</button>
                    <button type="submit" className="btn btn-danger" onClick={deleteContact}>Yes</button>
                </ModalFooter>
            </Modal>
        </AdminLayout>
    );
}

export default Index;