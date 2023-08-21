[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/DhYPBlwE)

# Portfolio

For my development course of my Multimedia & Creative Technologies study at the Erasmushogeschool, I made an application with which you can generate a visual for your favorite music. It is connected to your Spotify account – first the user has to login, afterwards you can search for you track and look at a unique visual when you enjoy the music. The user also has the option to save their favorite visuals.

### Methodology

The application has a frontend build with NextJS and P5.js and a backend that is set up with an express server that connects you to Spotify and MongoDB. P5.js is the library with which the application creates a unique visual according to the amplitude of the music. It will generate a gradient visual that is personalized according to the music; the gradient will move according to the amplitude of the music and the color is determined according to the dominant color in the albumcover. Next to that the user is able to save their favorite visuals, which will be stored in a MongoDB database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Running](#running)
- [Technology](#technology)
- [Sources](#sources)

## Prerequisites

Before you begin, ensure you have the following prerequisites installed on your system:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker (to use Docker Compose for deployment)
- MongoDB (to run a local instance or connect to a remote database)
- A Spotify Premium account

## Installing

Install all packages with Node Package Manager:

```sh
   npm i
```

## Running

Follow these steps to run the project:

2.  Frontend: Navigate to the /frontend directory:

```sh
  cd /frontend
```

- Install dependencies

```sh
   npm install
```

- Start the frontend solely

```sh
   npm run dev
```

3. Backend: In a new terminal window/tab, navigate to the /backend directory:

```sh
   cd /backend
```

- Rename .env.example to .env.local and configure the environment variables, especially Spotify API credentials.
- Install backend dependencies:

```sh
   npm install
```

- Start the node server

```sh
   node app.js
```

4. Lerna - run the front- and backend together with Lerna
   - Go back to the root folder
   ```sh
   cd ..
   ```
   - Run lerna
   ```sh
   npx lerna run dev
   ```

### Dockerized deployment

To deploy the application using Docker Compose, follow these steps:

1. Make sure you have Docker and Docker Compose installed on your system.
2. Navigate to the project directory.
3. Run the following command to build and start the containers:

```sh
docker-compose up 
```
Sometimes the deployment, especially connecting with the database, runs a little slower on Docker which could make fetching favorites a bit slower. Refresh your browser if it takes too long!


## Technology

Several packages, API's, databases or libraries were used to create this website.

- Spotify API
- React-Spotify-Web-Playback package to play music
- P5.js
- React-p5
- Mongodb API
- Colorthief

## Sources

Several sources were consulted to create this project.

- Spotify API Search https://www.youtube.com/watch?v=1PWDxgqLmDA&list=LL&index=6&t=2035s
- Nextjs Docs https://nextjs.org/docs/
- Spotify Developer Docs https://developer.spotify.com/documentation/
- Spotify Web Playback https://github.com/gilbarbara/react-spotify-web-playback
- P5.js Frequency Analysis https://www.youtube.com/watch?v=2O3nm0Nvbi4
- Creative Coding with p5.js https://www.youtube.com/watch?v=1h6vZl-OuB0

- React-p5 https://github.com/Gherciu/react-p5
- P5.js in React https://levelup.gitconnected.com/integrating-p5-sketches-into-your-react-app-de44a8c74e91
- Toggle states https://dommagnifi.co/2020-12-03-toggle-state-with-react-hooks/
- MongoDB check for string https://sparkbyexamples.com/mongodb/mongodb-check-if-a-field-contains-a-string/

- Fontawesome https://www.js-craft.io/blog/using-font-awesome-icons-with-the-nextjs-app-folder/

- Colorthief https://www.npmjs.com/package/colorthief
- Convert RGB to HSL https://www.30secondsofcode.org/js/s/rgb-to-hsl/
- Next Dynamic https://dev.to/vvo/how-to-solve-window-is-not-defined-errors-in-react-and-next-js-5f97
