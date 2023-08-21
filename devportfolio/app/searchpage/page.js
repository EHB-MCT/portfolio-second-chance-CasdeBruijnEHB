"use client"

import { useState, useEffect } from "react"
import Link from "next/link";
import ButtonComp from "@/components/buttonComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router'




let fetchURL = "http://localhost:3001";
export default function Searchpage(){

    const [searchInput, setSearchInput]=useState("");
    const [albums, setAlbums]=useState(["start"]);
    const [selectedMenu, setSelectedMenu]=useState("menu")
    const [favoriteAlbums, setFavoriteAlbums]=useState([])
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [favoriteTrackIds,setFavoriteTrackIds]=useState([]);
    const [chosenAlbum,setChosenAlbum]=useState({id:'',name:'',artist:'',imageLink:''});

     useEffect(() => {
        getFavorites();
        }, []);

    const handleAlbumClick = (album) => {
        //Save chosen album data to send through resultpage
        setChosenAlbum({
            id: album.id,
            name: album.name,
            artist: album.artists[0].name,
            imageLink: album.album.images[0].url
        });
        setSelectedAlbum(album.id);
        
        
    };

    async function searchItem(){
         fetch(`${fetchURL}/searchitem/${searchInput}`)
        .then(result=>result.json())
        .then(data=>{
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
            //Add the ID's to check the albums if they are favorited
            setFavoriteTrackIds(data.tracks.map(track=>track.id));
            setFavoriteAlbums(data.tracks)
        })    
    }

    return (
        <>
         <main className="flex flex-col items-center pt-[10%] h-screen">
            <div>
                <button className={`rounded-xl m-3 p-3 ${selectedMenu === 'menu' ? 'bg-green-400 bg-opacity-50  text-white' : 'bg-white bg-opacity-30 text-white'}`} onClick={() =>{ 
                    setSelectedMenu('menu')
                    setSelectedAlbum(null);
                    }} >Look for songs</button>
                <button className={`rounded-xl m-3 p-3 ${selectedMenu === 'favorites' ? 'bg-green-400 bg-opacity-50 text-white' : 'bg-white bg-opacity-30 text-white'}`} onClick={() => {
                    setSelectedMenu('favorites')
                    getFavorites();
                    setSelectedAlbum(null);
                    }}>Your favorites</button>
            </div>
            
            {selectedMenu === "menu" && (
            <div className="w-[70%]">
                <div className="flex flex-col gap-5 bg-white bg-opacity-30 p-5 pl-[20%] pr-[20%] w-[100%] rounded-lg">
                    <p className="">Look for your song...</p>
                    <input className="bg-slate-100 rounded-lg p-3 text-black" type="text" id="fname" name="fname"
                    onKeyDown={event=>{
                        if(event.key=="Enter"){
                            setSearchInput(event.target.value);
                        }
                    }}
                    onChange={event=>{setSearchInput(event.target.value)}}
                    ></input>
                    <button className="bg-green-400 bg-opacity-50 text-white  rounded-xl m-3 p-3" type="button" 
                    onClick={event=>{
                        searchItem();
                    }}
                    >Look</button>
                </div>
                <div className="bg-purple-100 bg-opacity-50 grid grid-cols-5 gap-5 pl-4 pb-2 w-full rounded-md mt-2 pt-2 justify-center">
                  {albums.length === 0 ? (
                         <p >Nothing found. Please rephrase your request.</p>
                    ) : (albums[0] === "start" ? (
                        <p>Nothing yet searched for.</p>
                    ) : (                    
                albums.map((album, i)=>{
                    return(
                        <div key={i} className={`border-solid rounded-md p-2  ${
                    selectedAlbum === album.id ? 'bg-[#545775] bg-opacity-500 text-white font-bold' : ''}`}
                        onClick={() => handleAlbumClick(album)}
                        >
                            {favoriteTrackIds.includes(album.id)?(
                                <FontAwesomeIcon  icon={solidHeart}/>
                                ):(
                                <FontAwesomeIcon icon={regularHeart} />
                                )}
                            <img src= {album.album.images[0].url}
                            alt="Album picture" 
                            id={album.id}
                            width="250" height="250 " />
                            <p className="font-bold text-base">{album.name}</p>
                            <p className="font-light text-opacity-50 text-sm">{album.artists[0].name}</p>
                        </div>  
                            )
                    })
                    ))}
                </div>  
            </div>
            )}
            
            {selectedMenu === "favorites" && (
                <div className="w-[70%]">
                    <div  className="bg-purple-100 bg-opacity-50 grid grid-cols-5 gap-5 pl-4 pb-2 w-full rounded-md mt-2 pt-2 justify-center">
                       {favoriteAlbums.length === 0 ? (
                        
                         <p >Nothing yet favored</p>
                    ) : (
                        favoriteAlbums.map((album, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`border-solid rounded-md p-2  ${
                                        selectedAlbum === album.id ? 'bg-[#545775] bg-opacity-500 text-white font-bold' : ''
                                    }`}
                                    onClick={() => handleAlbumClick(album)}
                                >
                                    <img
                                        src={album.album.images[0].url}
                                        alt="Album picture"
                                        id={album.id}
                                        width="250"
                                        height="250"
                                    />
                                     <p className="font-bold text-base">{album.name}</p>
                                     <p className="font-light text-opacity-50 text-sm">{album.artists[0].name}</p>
                                    
                                </div>
                            );
                        })
                    )}                       
                        </div>
                </div>
            )}
            {selectedAlbum && (
                <div >
                    <Link className=" absolute mt-5 mb-10 px-4 py-2 rounded-md bg-green-400 bg-opacity-50 text-white t-0 "
                         href={{ pathname: `/searchpage/${selectedAlbum}`, query: {
                            albumname: chosenAlbum.name,
                            artistName: chosenAlbum.artist,
                            imageLink: chosenAlbum.imageLink
                        } }}>Klik</Link>
                </div> 
                )}
        </main>
        </>
    )
}