import React, {useEffect, useState} from 'react';

function Track ({id,name,image,artists}){

    return(
        <div id={id} className="track">
            <img src={image} alt=""/>
            <h3>{name}</h3>
            <h4>{artists.map(artist => (artist.name)).join(", ")}</h4>
        </div>
    )
}

export default Track;