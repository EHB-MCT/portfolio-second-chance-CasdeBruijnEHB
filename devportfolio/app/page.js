
import ButtonComp from "@/components/buttonComponent";

export default function Home() {
   let fetchUrl = "http://localhost:3001";
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <p>Connect your Spotify and start generating visuals to your songs!</p>
      <ButtonComp text={"Login to Spotify"} link={`${fetchUrl}/login`}/>
    </main>
  )
}
