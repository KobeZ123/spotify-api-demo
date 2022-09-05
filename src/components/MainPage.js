// https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn


import {useEffect, useState} from 'react';
import axios from 'axios';

const CLIENT_ID = "ENTER CLIENT ID"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SCOPES = "user-top-read"

function MainPage() {
    function loadSpotifyAPI() {
        fetch('http://example.com/movies.json')
            .then((response) => response.json())
            .then((data) => console.log(data));
    }


    const [token, setToken] = useState("")

    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [topArtists, setTopArtists] = useState([])
    const [topTracks, setTopTracks] = useState([])
    const [userInfo, setUserInfo] = useState("")

    const [displayProfile, setDisplayProfile] = useState(false)


    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            console.log(hash)
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            
            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    // searches the artist with the given search key and sets result list
    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
    
        setArtists(data.artists.items)
    }

    // retrieves user informations and sets the user info 
    const searchUserInfo = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            // params: {
            //     q: searchKey,
            //     type: "artist"
            // }
        })
        setUserInfo(data);
    }

    // retrieves information about the user's top artists 

    const searchTopArtists = async (e) => {
        e.preventDefault()
        console.log("searching top artists");
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            // params: {
            //     q: searchKey,
            //     type: "artist"
            // }
        })
        
        setTopArtists(data.items);
    }

    // retrieves information about the user's top songs 
    const searchTopTracks = async (e) => {
        e.preventDefault()
        console.log("searching top tracks");
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            // params: {
            //     limit: 20
            // }
        })
        
        setTopTracks(data.items);
    }
    
    // list of artists component 
    const renderArtists = () => {
        return (
            artists.map(artist => (SearchArtistCard(artist)))
        )
    }

    // user information component 
    const renderUserInfo = () => {
        if (userInfo) {
            return (
                <div className="user-info-container">
                    <h3>{userInfo.display_name}</h3>
                    <img className="userInfo-profilepic" src={userInfo.images[0].url} alt=""/>
                </div>
            );
        }
    }

    // list of top artists component 
    const renderTopArtists = () => {
        return (
            <div className="top-artists-grid">
                {topArtists.map(artist => (ArtistCard(artist)))}
            </div>
            
        )
    }

    // list of top artists component 
    const renderTopTracks = () => {
        console.log("GETTING TOP TRACKS")
        console.log(topTracks);
        return (
            <div className="top-tracks-grid">
                {topTracks.map(track => (TrackCard(track)))}
            </div>
        )
    }

    // component for api authentication and logout 
    const viewerLogin = () => {
        return (
            <div>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>Login
                        to Spotify</a>
                    : <button className="button-logout" onClick={logout}>LOGOUT</button>}
            </div>
        );
    }


    // component for the user information 
    const viewerUserInfo = () => {
        if (token) {
            if (displayProfile) {
                console.log("getting here");
                return (
                    <div>
                        {renderUserInfo()}
                    </div>
                )
            }
            else {
                return <button className="button-main" onClick={(event)=>{searchUserInfo(event); setDisplayProfile(true);}}>GET USER INFO</button>
            }
        }
    }


    // component for artist search 
    const viewerArtists = () => {
        if (token) {
            return (
                <div className="search-component-container">
                    <form onSubmit={searchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                        <button type={"submit"}>SEARCH</button>
                    </form>
                    {renderArtists()}
                </div>
                
            );
        }
    }

    // component for top artist list
    const viewerTopArtists = () => {
        if (token) {
            if (topArtists.length == 0) {
                return <button className="button-main" onClick={(event)=>{searchTopArtists(event);}}>GET TOP ARTISTS</button>
            }
            else {
                return (
                    <div className="top-artists-container">
                        <h2 style={{margin: "0rem"}}>Top Artists</h2>
            
                        
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {renderTopArtists()}
                        </div>
                        <button onClick={()=>{setTopArtists([])}}>CLOSE</button>
                    </div>
                )
            }
        }
    }

    // component for top tracks list
    const viewerTopTracks = () => {
        if (token) {
            if (topTracks.length == 0) {
                return <button className="button-main" onClick={(event)=>{searchTopTracks(event);}}>GET TOP TRACKS</button>
            }
            else {
                return (
                    <div className="top-tracks-container">
                        <h2 style={{margin: "0rem"}}>Top Tracks</h2>
            
                        
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {renderTopTracks()}
                        </div>
                        <button onClick={()=>{setTopTracks([])}}>CLOSE</button>
                    </div>
                )
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {/* {renderUserInfo()} */}
                {viewerUserInfo()}
                {viewerTopArtists()}
                {viewerTopTracks()}
                {viewerArtists()}
                {viewerLogin()}
                
            </header>
            
        </div>
    );

    
}

function ArtistCard(artist_data) {
    return (
        <div className="artist-card-container" key={artist_data.id}>
            {artist_data.images.length ? <div className='artist-image-container' style={{backgroundImage: `url(${artist_data.images[0].url})`}}> </div> : <div>No Image</div>}
            {artist_data.name}
        </div>
    );
}

function TrackCard(track_data) {
    return (
        <div className="track-card-container" key={track_data.id}>
            <div className='track-image-container' style={{backgroundImage: `url(${track_data.album.images[0].url})`}}></div>
            {track_data.name}
        </div>
    )
}

function SearchArtistCard(artist_data) {
    return (
        <div className="search-result-container" key={artist_data.id}>
            {artist_data.images.length ? <div className='search-image-container' style={{backgroundImage: `url(${artist_data.images[0].url})`}}></div> : <div>No Image</div>}
            <div className="search-result-font">
                {artist_data.name}
            </div>
        </div>        
    )
}
// <img width={"128px"} height={"128px"} backgroundSize={"contain"} src={artist_data.images[0].url} alt=""/>


export default MainPage;