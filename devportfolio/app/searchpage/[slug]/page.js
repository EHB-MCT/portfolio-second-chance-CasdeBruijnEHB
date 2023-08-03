// Import the required dependencies
"use client"
import { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';




export default function Resultpage({ params }) {
  const [accessToken, setAccessToken] = useState(null);

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

   const trackURI = `spotify:track:${params.slug}`;
  return (
    <>
      <div>My Post: {params.slug}</div>
      <button onClick={() => playMusic()}>Play song</button>
      <SpotifyPlayer
        token={accessToken}
        uris={[trackURI]}
    />
    </>
  );
}