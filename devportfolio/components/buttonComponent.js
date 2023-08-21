

import Link from 'next/link';
export default function ButtonComp({text, link=""}){    
    return (
        <>
        <Link href={link} className={`bg-white bg-opacity-20 text-white rounded-xl m-3 p-3`}>
				{text}
			</Link>
        </>
    )


};