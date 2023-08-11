"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

let fetchURL = "http://localhost:3001";
export default function Searchpage(){
    const router = useRouter()
    const [searchInput, setSearchInput]=useState("");
    const [albums, setAlbums]=useState([]);
    const [selectedMenu, setSelectedMenu]=useState("menu")
    const [dataFavorites, setDataFavorites]=useState([])
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

    async function getFavorites(){
        //Fetch all the favorite ID's from Mongo
         const fetchDataFavorites = async () => {
            try {
            const response = await fetch(`${fetchURL}/mongoFavorites`);
            const songIds = await response.json();
            return songIds;
            } catch (error) {
            console.error("Error fetching data:", error);
            return [];
            }
        };

        //Add all the ids to a string to it can be sent to Spotify
        let arrFavorites=await fetchDataFavorites();
        let songIDString= arrFavorites.join(',');

        //Fetch the tracks from spotify
         fetch(`${fetchURL}/searchfavorites/${songIDString}`)
        .then(result=>result.json())
        .then(data=>{
            console.log(data)
        })    
    }

    return (
        <>
         <main className="flex flex-col items-center pt-[10%] h-screen">
            <div>
                <p onClick={() => setSelectedMenu('menu')} >Menu</p>
                <p onClick={() => {
                    setSelectedMenu('favorites')
                    getFavorites();
                    }}>Favorites</p>
            </div>
            <div>
                <div className="bg-slate-300 p-5 w-[50%] rounded-lg">
                    <p className="">Look for your song...</p>
                    <input className="bg-slate-100 rounded-lg p-3" type="text" id="fname" name="fname"
                    onKeyDown={event=>{
                        if(event.key=="Enter"){
                            setSearchInput(event.target.value);
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
            </div>
        </main>
        </>
    )
}