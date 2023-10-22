import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {connect} from "react-redux";
import {getWords, updateState} from "../redux/actions/mainAction";

function SearchComponent(props) {
    const router = useRouter();

    // const [inputValue, setInputValue] = useState(props.word);

    function searchWord(e) {
        e.preventDefault();
        // router.push(e.target.searchInput.value ? '/search/' + e.target.searchInput.value : '/');
        props.updateState({searchWord: e.target.searchInput?.value || ''});

        if (e.target.searchInput?.value === '') {
            props.updateState({words: []});
            router.push("/")
        } else {
            props.getWords(e.target.searchInput?.value || '', false)
        }
    }

    useEffect(() => {
        if (!router.pathname.includes('/search/')) {
            props.updateState({words: [], searchWord: ''})
        }
        return () => {
            props.updateState({words: [], searchWord: ''})
        }
    }, [router.pathname]);

    return (
        <>
            <div className="search-component">
                <form onSubmit={searchWord} className="search-area">
                    <button type={'submit'} className="search-icon">
                        <img src="/images/search.svg" alt=""/>
                    </button>
                    <input
                        value={props.searchWord}
                        onChange={(e) => props.updateState({searchWord: e.target.value})}
                        placeholder="So’zni izlash ..."
                        id="searchInput"
                        name="searchInput"
                        className="search-input"
                        type="search"
                    />
                </form>
            </div>
            {
                props.words?.length < 1 ? '' :
                    <ul className="similar-words">
                        <li className="text">O’xshash so’zlar</li>
                        {
                            props.words?.map((item, index) => (
                                <li key={index}
                                    onClick={() => {
                                        props.updateState({searchWord: item.label});
                                        router.push('/search/' + item.label);
                                    }}
                                    className={props.searchWord===item?.label ? 'active-list':''}
                                    style={{cursor: 'pointer'}}>#{item?.label}</li>
                            ))
                        }

                    </ul>
            }
        </>

    );
}

const mapStateToProps = state => {
    return {
        words: state.main.words,
        searchWord: state.main.searchWord,
    }
};

export default connect(mapStateToProps, {getWords, updateState})(SearchComponent);
