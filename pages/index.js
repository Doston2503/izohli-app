import React from 'react';
import Head from 'next/head';
import WordsOfDay from '../components/WordsOfDay';
import Faq from '../components/Faq';
import Alphabet from '../components/Alphabet';
import { useRouter } from 'next/router';

function Index(props) {
    const router = useRouter();
    const currentPath = router.pathname;
    return (
        <div>
            <Head>
                <title>Main page</title>
            </Head>

            <WordsOfDay />
            <Faq />

            <Alphabet />
        </div>
    );
}

export default Index;
