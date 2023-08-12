

import Link from 'next/link';
export default function ButtonComp({text, link=""}){    
    return (
        <>
        <Link href={link} className={`bg-white text-black rounded-xl m-3 p-3`}>
				{text}
			</Link>
        </>
    )


};