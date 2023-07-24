import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between p-24 bg-slate-400">
     <div className='flex justify-center bg-slate-600 text-red'>
        <p className='text-red'>Look for your song...</p>
        <input className='w-screen'></input>
     </div>
     
    </main>
  )
}
