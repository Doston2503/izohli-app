import React, {useEffect} from 'react';
import Link from "next/link";
import {useRouter} from "next/router";

function AdminLayout({children}) {
    const router = useRouter();
    const currentPath = router.pathname;

    useEffect(() => {
        let date = new Date().getTime();
        const token = localStorage.getItem('accessToken');
        let timestamp = localStorage.getItem('timestamp');
        timestamp = new Date(timestamp).getTime();

        if (typeof window !== 'undefined'){
            if (!token || date>timestamp) {
                localStorage.clear();
                router.push('/login');
            } else {
                // return children
            }
        }



    }, []);

    return (
        <div className="admin-layout">
            <div className="admin-layout-left">
                <Link href="/" className="mainBrand">
                    <img src="/images/logo.svg" alt=""/>
                </Link>

                <ul>
                    <li><Link className={currentPath === '/admin/category' ? 'active-link' : ''}
                              href='/admin/category'>Category</Link></li>
                    <li><Link className={currentPath === '/admin/words' ? 'active-link' : ''}
                              href='/admin/words'>Words</Link></li>
                    <li><Link className={currentPath === '/admin/sentence' ? 'active-link' : ''}
                              href='/admin/sentence'>Sentence</Link></li>
                    <li><Link className={currentPath === '/admin/types' ? 'active-link' : ''}
                              href='/admin/types'>Types</Link></li>
                    <li><Link className={currentPath === '/admin/word-type' ? 'active-link' : ''}
                              href='/admin/word-type'>Word type</Link></li>
                    <li><Link className={currentPath === '/admin/note' ? 'active-link' : ''}
                              href='/admin/note'>Note</Link></li>
                    <li><Link className={currentPath === '/admin/word-in-sentence' ? 'active-link' : ''}
                              href='/admin/word-in-sentence'>Word in sentence</Link></li>
                    <li><Link className={currentPath === '/admin/day-words' ? 'active-link' : ''}
                              href='/admin/day-words'>Day words</Link></li>
                    <li><Link className={currentPath === '/admin/contact' ? 'active-link' : ''}
                              href='/admin/contact'>Contact</Link></li>
                </ul>

            </div>
            <div className="admin-layout-right">
                <div className="admin-layout-content">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;