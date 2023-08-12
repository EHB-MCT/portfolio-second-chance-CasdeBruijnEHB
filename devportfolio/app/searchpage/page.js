"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import ButtonComp from "@/components/buttonComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';




let fetchURL = "http://localhost:3001";
export default function Searchpage(){
    const router = useRouter()
    const [searchInput, setSearchInput]=useState("");
    const [albums, setAlbums]=useState([]);
    const [selectedMenu, setSelectedMenu]=useState("menu")
    const [favoriteAlbums, setFavoriteAlbums]=useState([])
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [favoriteTrackIds,setFavoriteTrackIds]=useState([]);

     useEffect(() => {
        console.log("useeffect called!")
        getFavorites();
        }, []);


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
            //console.log(data)
            //console.log(data.tracks)
            //console.log(data.tracks)
            //Add the ID's to check the albums if they are favorited
            setFavoriteTrackIds(data.tracks.map(track=>track.id));
            setFavoriteAlbums(data.tracks)
        })    
    }

    return (
        <>
         <main className="flex flex-col items-center pt-[10%] h-screen">
            <div>
                <button className={`rounded-xl m-3 p-3 ${selectedMenu === 'menu' ? 'bg-green-800 text-white' : 'bg-white text-black'}`} onClick={() =>{ 
                    setSelectedMenu('menu')
                    setSelectedAlbum(null);
                    }} >Look for songs</button>
                <button className={`rounded-xl m-3 p-3 ${selectedMenu === 'favorites' ? 'bg-green-800 text-white' : 'bg-white text-black'}`} onClick={() => {
                    setSelectedMenu('favorites')
                    getFavorites();
                    setSelectedAlbum(null);
                    }}>Your favorites</button>
            </div>
            
            {selectedMenu === "menu" && (
            <div className="w-[70%]">
                <div className="flex flex-col gap-5 bg-slate-300 p-5 pl-[20%] pr-[20%] w-[100%] rounded-lg">
                    <p className="">Look for your song...</p>
                    <input className="bg-slate-100 rounded-lg p-3" type="text" id="fname" name="fname"
                    onKeyDown={event=>{
                        if(event.key=="Enter"){
                            setSearchInput(event.target.value);
                        }
                    }}
                    onChange={event=>{setSearchInput(event.target.value)}}
                    ></input>
                    <button className="bg-black text-white  rounded-xl m-3 p-3" type="button" 
                    onClick={event=>{
                        searchItem();
                    }}
                    >Look</button>
                </div>
                <div className="bg-slate-500 flex flex-wrap gap-5 pl-4 pb-2 w-[100%] rounded-md mt-2 pt-2">
                    {albums.map((album, i)=>{
                return(
                    <div key={i} className={`border-solid rounded-md p-2  ${
                selectedAlbum === album.id ? 'bg-white' : ''}`}
                    onClick={() => handleAlbumClick(album.id)}
                    >
                        {favoriteTrackIds.includes(album.id)?(
                            <FontAwesomeIcon onClick={()=>{console.log("Unfavorite")}} icon={solidHeart}/>
                            ):(
                            <FontAwesomeIcon onClick={()=>{console.log("Favorite")}} icon={regularHeart} />
                            )}
                        <img src= {album.album.images[0].url}
                        alt="Album picture" 
                        id={album.id}
                        width="150" height="150 " />
                        <p>{album.name}</p>
                    </div>  
                        )
                    })}
                </div>  
            </div>
            )}
            
            {selectedMenu === "favorites" && (
                <div className="bg-slate-500 flex flex-wrap gap-5 pl-4 pb-2 w-3/6 rounded-md m-2 pt-2">
                     {favoriteAlbums.map((album, i)=>{
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
            )}
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