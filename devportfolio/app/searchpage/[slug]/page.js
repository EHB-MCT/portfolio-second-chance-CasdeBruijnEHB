// Import the required dependencies
"use client"
import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import AudioVisualization from '@/components/audiovisnew';
import LoadScript from 'react-load-script';




export default function Resultpage({ params }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorited, setIsFavorited]=useState(false);

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
  }, []);

  


  async function playMusic() {
    //const response = await fetch(`http://localhost:3001/play/${params.slug}`);
    //const data = await response.json();
    console.log("Click play music");
    console.log(accessToken)
  }

  function favoriteMusic(){
    setIsFavorited(!favorited)
  }

  const onPlaybackStatusChange = (status) => {
    setIsPlaying(status.isPlaying);
  };

   const trackURI = `spotify:track:${params.slug}`;
  return (
    <>
      <div>My Post: {params.slug}</div>
      <button onClick={() => playMusic()}>Play song</button>
      <button onClick={favoriteMusic}>
      {favorited ? 'Favorited' : 'Save visuals'}
      </button>

      <SpotifyPlayer
        token={accessToken}
        uris={[trackURI]}
        callback={onPlaybackStatusChange}
    />
   {isPlaying && <AudioVisualization />}
    </>
  );
}

//{isPlaying && <AudioVisualization />}