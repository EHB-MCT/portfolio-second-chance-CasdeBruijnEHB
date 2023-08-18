// Import the required dependencies
"use client"
import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import AudioVisualization from '@/components/audiovisnew';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useSearchParams } from 'next/navigation'



export default function Resultpage({ params }) {
  let fetchURL = "http://localhost:3001";
  const [accessToken, setAccessToken] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited]=useState(false);
  const [favoriteTrackIds,setFavoriteTrackIds]=useState([]);

  console.log("chosen album...")
  console.log(params)
  
  //Getting the params out the URL that contain track information
  const searchParams = useSearchParams()
  const selectedTrackid=params.slug;
  const albumname = searchParams.get('albumname')
  const albumartist = searchParams.get('artistName')
  const imageLink = searchParams.get('imageLink')
  

  const hslColorCode = 'hsl(120, 100%, 50%)';
  
  useEffect(() => {
    async function fetchAccessToken() {
      console.log("token ophalen");
      try {
        const response = await fetch('http://localhost:3001/getaccess');
        const data = await response.text();
        setAccessToken(data); 
      } catch (error) {
        console.error('Error :', error);
      }
    }
    fetchAccessToken();
    getFavorites();
  }, []);


  const handleFavoriteToggle = async () => {
    //Check if the track is liked/unliked first
    if (favoriteTrackIds.includes(selectedTrackid)) {
      //Afterwards set the state, remove/add the track from the array, and send the request to database
      setIsFavorited(false)
      setFavoriteTrackIds(prevIds => prevIds.filter(id => id !== selectedTrackid));
      await unfavorite();
    } else {
      setIsFavorited(true)
      setFavoriteTrackIds(prevIds => [...prevIds, selectedTrackid]);
      await favoriteMusic();
    }
  };
  

  //Fetch all favorites to check which one is liked
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
              //Immediately check if track is liked to show it in site
              setIsFavorited(data.tracks.map(track => track.id).includes(selectedTrackid));
          })    
      }


  async function favoriteMusic(){
    console.log("Click favorite...")
     const data = {
      favoriteTrack: `${selectedTrackid}`
    };
     try {
      const response = await fetch('http://localhost:3001/mongoAddFavorite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Server response:', responseData);
      } else {
        console.error('Request failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function unfavorite(){
    console.log("unfavoriting..")
    try {
      const response = await fetch(`http://localhost:3001/mongoDelete/${selectedTrackid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Server response:', responseData);
      } else {
        console.error('Request failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const onPlaybackStatusChange = (status) => {
    setIsPlaying(status.isPlaying);
  };

   const trackURI = `spotify:track:${selectedTrackid}`;
  return (
    <>
    <main className="flex flex-col items-center pt-[10%] h-screen">
        <div className="w-[70%]">
         <div className='justify-center flex'>
            <div className={`border-solid rounded-md p-2 bg-purple-100 bg-opacity-50 max-w-max`}>
              <button onClick={handleFavoriteToggle}>
              {isFavorited ? <div className='flex justify-center items-center p-2'><p className='mr-2'>Unlike</p><FontAwesomeIcon icon={solidHeart} /></div> : <div className='flex justify-center items-center p-2'><p className='mr-2'>Like</p><FontAwesomeIcon icon={regularHeart} /></div>}
              </button>
              <img src= {imageLink}
              alt="Album picture" 
              id={selectedTrackid}
              width="300" height="300 " />
              <div className='p-2'>
                 <p className="font-bold text-base">{albumname}</p>
                        <p className="font-light text-opacity-50 text-sm">{albumartist}</p>
              </div>
            </div> 
          </div>
         

          
      </div>
      <div className='absolute left-0 top-0 -z-10'>
       {isPlaying && <AudioVisualization  hslColor={hslColorCode} />}
       </div>
   </main>
   <div className='absolute bottom-0 w-full'>
   <SpotifyPlayer
            token={accessToken}
            uris={[trackURI]}
            callback={onPlaybackStatusChange}
        />
    </div>
    </>
  );
}

//{isPlaying && <AudioVisualization />}