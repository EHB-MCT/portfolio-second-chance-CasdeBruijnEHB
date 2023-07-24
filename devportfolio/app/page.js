

export default function Home() {
   let fetchUrl = "http://localhost:3001";
  return (
    <main className="flex items-center justify-center h-screen">
      <p>Connect your Spotify and start generating visuals to your songs!</p>
      <button type="button"><a href={`${fetchUrl}/login`}>Login To Spotify</a></button>
    </main>
  )
}
