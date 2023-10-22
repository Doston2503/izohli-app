import {UPDATE_STATE_MAIN} from "../types";
import axios from "axios";
import {PATH_NAME} from "../../src/utils/constants";
import {toast} from "react-toastify";

export function updateState(data) {
    return {
        type: UPDATE_STATE_MAIN,
        payload: data
    }
}


export const getWords = (searchWord, isSearchPage) => dispatch => {
    const token = localStorage.getItem('accessToken');
    const header = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };
    dispatch(updateState({isLoading: true, searchWord}));
    axios.get(`${PATH_NAME}words/get-all-word-search?latter=${searchWord}&page=0&size=100`, header)
        .then((response) => {
            if (response.data?.success) {
                if (isSearchPage){
                    dispatch(updateState({wordsPage: response.data?.data?.content}))
                }
                dispatch(updateState({words: response.data?.data?.content}))
            }
        })
        .catch((error) => {
            toast.error('Error');
            console.error('Error:', error);
        })
        .finally(() => {
            dispatch(updateState({isLoading: false}))
        })
};

