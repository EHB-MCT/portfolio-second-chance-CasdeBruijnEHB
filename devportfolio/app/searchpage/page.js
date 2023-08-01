"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

let fetchURL = "http://localhost:3001";
export default function Searchpage(){
    const router = useRouter()
    const [searchInput, setSearchInput]=useState("");
    const [albums, setAlbums]=useState([]);

    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const handleAlbumClick = (albumId) => {
        console.log('album click!')
        console.log(albumId);
        setSelectedAlbum(albumId);
    };

    async function searchItem(){
        console.log("Searchinggg...: " + searchInput)
         fetch(`${fetchURL}/searchitem/${searchInput}`)
        .then(result=>result.json())
        .then(data=>{
            //console.log(data.tracks.items[0].album.images[0].url)
            setAlbums(data.tracks.items);
        })    
    }

    return (
        <>
         <main className="flex flex-col items-center pt-[10%] h-screen">
            <div className="bg-slate-300 p-5 w-[50%] rounded-lg">
                <p className="">Look for your song...</p>
                <input className="bg-slate-100 rounded-lg p-3" type="text" id="fname" name="fname"
                onKeyDown={event=>{
                    if(event.key=="Enter"){
                        //console.log("Enter Clicked!")
                    }
                }}
                onChange={event=>{setSearchInput(event.target.value)}}
                
                ></input>
                <button type="button" 
                onClick={event=>{
                    searchItem();
                }}
                >Look</button>
            </div>
            <div className="bg-slate-500 flex flex-wrap gap-5 pl-4 pb-2 w-3/6 rounded-md m-2 pt-2">
                {albums.map((album, i)=>{
            return(
                <div key={i} className={`border-solid rounded-md p-2  ${
              selectedAlbum === album.id ? 'bg-white' : ''}`}
                 onClick={() => handleAlbumClick(album.id)}
                >
                    <img src= {album.album.images[0].url}
                    alt="Album picture" 
                    id={album.id}
                    width="150" height="150 " />
                    <p>{album.name}</p>
                </div>  
                    )
                })}
            </div>
            {selectedAlbum && (
                <button
                    className="px-4 py-2 rounded-md bg-green-500 text-white mt-2"
                    onClick={() => router.push(`/searchpage/${selectedAlbum}`)}
                >
                    Choose album
                </button>
            )}
        </main>
        </>
    )
}