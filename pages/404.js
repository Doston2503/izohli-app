import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className="notfound-page">
            <div className="box">
                <h1>404</h1>
                <p>Siz soʻragan sahifa mavjud emas.</p>

                <Link href="/">
                    Bosh sahifaga qaytish
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;