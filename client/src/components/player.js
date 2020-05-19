import React, {useEffect, useState} from 'react';
import Script from 'react-load-script';
import queryString from 'query-string';
import './fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Track from './track';
import './player.css';

function Player(props) {

    const [track, setTrack] = useState({name:"",
        artists:[],
        image:""
    });
    const [results, setResults] = useState([]);
    const [queue, setQueue] = useState([]);
    const [playState, setPlayState] = useState(false);
    const [search, setSearch] = useState("");

    const values = queryString.parse(props.location.search);
    const token = values.access_token;

    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
              name: 'Jukebox',
              getOAuthToken: cb => { cb(token); }
            });

            player.connect();
            player.addListener('player_state_changed',(state) => {
                console.log(state);
                setTrack({name:state.track_window.current_track.name,
                    artists:state.track_window.current_track.artists,
                    image:state.track_window.current_track.album.images[0].url
                });

                if (queue[0] != undefined){
                    console.log(queue[0].id,state.track_window.current_track.id)
                    if (state.track_window.current_track.id == queue[0].id){
                    var temp= queue;
                    temp.shift();
                    setQueue(temp);
                }}
                
                
                setPlayState(state.paused);
            });

            player.addListener('ready', ({ device_id }) => {
                let response = fetch('https://api.spotify.com/v1/me/player',{
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({device_ids:[device_id]})
                });
            });
        }
    }, []);

    const play = () => {
        fetch('https://api.spotify.com/v1/me/player/play',{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }

    const pause = () => {
        fetch('https://api.spotify.com/v1/me/player/pause',{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }

    const searchTracks = async() => {
        let response = await fetch(`https://api.spotify.com/v1/search?type=track&limit=10&q=${search}`,{
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        let result = await response.json();
        setResults(result.tracks.items);
    }

    const updateSearch = e => {
        setSearch(e.target.value);
    }
    const click = e => {
        if(e.target.parentElement.classList[0] === "track"){
            addToQueue(e.target.parentElement.id);
            getTrack(e.target.parentElement.id);
            
        }
    }

    const addToQueue = (id) => {
        fetch(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${id}`,{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }

    const getTrack = async (id) =>{
        let response = await fetch(`https://api.spotify.com/v1/tracks/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        let result = await response.json();
        var temp= queue;
        temp.push(result);
        setQueue(temp);
    }

    const removeSearch = () => {
        setResults([])
    }

    return (
        <div className="Player">
            <Script
                url="https://sdk.scdn.co/spotify-player.js"
            />
            <input className="search-input" type="text" value={search} onChange={updateSearch}/>
            <button onClick={searchTracks} className="search-btn" type="submit"></button>
            <button onClick={removeSearch} className="remove-btn"></button>
            <div className="results" onClick={click}>
            {results.map(result => (
                <Track key={result.id} 
                id={result.id} 
                name={result.name} 
                image={result.album.images[1].url} 
                artists={result.artists}/>
            ))}
            </div>
            <div className='current'>
                <h2 className="current-track">{track.name}</h2>
                <h3 className="current-artists">{track.artists.map(artist => (artist.name)).join(", ")}</h3>
                <img className="current-image" src={track.image} alt=""/>
            
            
                <br/>
                <button onClick={playState ? play : pause}><FontAwesomeIcon icon={playState ? 'play-circle' : 'pause-circle'} size="4x" /></button>
                <br/>
            </div>

            <div className="queue"> Next In Queue:
                {queue.map(result =>(
                    <Track key={result.id} 
                    id={result.id} 
                    name={result.name} 
                    image={result.album.images[1].url} 
                    artists={result.artists}/>
                ))}
            </div>
        </div>
    );
}

export default Player;