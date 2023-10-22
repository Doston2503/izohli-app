import React from 'react';
import Link from 'next/link';

const Alphabet = (props) => {
    const arr = [
        'A',
        'B',
        'D',
        'E',
        'F',
        'G',
        'H',
        'L',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'X',
        'Y',
        'Z',
        "O'",
        "G'",
        'Sh',
        'Ch',
    ];

    return (
        <div className="container">
            <div className="alphabet-component">
                <div className="title">Alifbo boyicha</div>
                <ul className="alphabet">
                    {arr.map((item, index) => (
                        <li key={index}>
                            <Link href={`/alphabet/${item}`} className="text-decoration-none">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Alphabet;
