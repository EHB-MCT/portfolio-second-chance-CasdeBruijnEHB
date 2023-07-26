"use client"

import { useState, useEffect } from "react"

let fetchURL = "http://localhost:3001";
export default function Searchpage(){

    const [searchInput, setSearchInput]=useState("");

/*
    useEffect(()=>{
        fetch('url')
        .then(result=>result.json())
        .then(data=>console.log(data))
    },[])
*/

    async function searchItem(){
        console.log("Searchinggg...: " + searchInput)

         fetch(`${fetchURL}/searchitem/${searchInput}`)
        .then(result=>result.json())
        .then(data=>console.log(data))
         
    }

    return (
        <>
         <main className="flex items-center justify-center h-screen">
            <div className="bg-slate-300 p-5 w-[50%] rounded-lg">
                <p className="">Look for your song...</p>
                <input className="bg-slate-100 rounded-lg p-3" type="text" id="fname" name="fname"
                onKeyDown={event=>{
                    if(event.key=="Enter"){
                        console.log("Enter Clicked!")
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
            <div>
                <div>
                    <img src="#" alt="Album picture" width="100" height="100" />
                    <p>Title</p>
                </div>
            </div>
        </main>
        </>
    )
}