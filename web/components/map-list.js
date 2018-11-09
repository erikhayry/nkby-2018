import { useState } from 'react';
import { sortPagesByTitle, sortLocalesByName, getMinMax } from '../utils'

let {min: latMin, max: latMax} = getMinMax('lat');
let {min: lngMin, max: lngMax} = getMinMax('lng');

const MapList = ({locales}) => {
    const [current, setCurrent] = useState('');
    const [zoom, setZoom] = useState(0);
    const z = zoom / 100;

    let latMinZoomed = latMin + z;
    let latMaxZoomed = latMax - z;

    let lngMinZoomed = lngMin + z;
    let lngMaxZoomed = lngMax - z;

    let lngC = 1;
    let latC = 1;

    const latWidth = (latMaxZoomed - latMinZoomed);
    const lngWidth = (lngMaxZoomed - lngMinZoomed);

    if(current){
        let centerLng = current.position.lng;
        let centerLat = current.position.lat;

        const midLng = (lngMaxZoomed + lngMinZoomed) / 2;
        lngC = midLng/centerLng;

        const midLat = (latMaxZoomed + latMinZoomed) / 2;
        latC = midLat/centerLat;
    }

    return (
        <>
            <style jsx global>{`
                     :root {
                        --lngC: ${lngC};
                        --latC: ${latC};
                     }

                    `}</style>
            <div style={{
                position: 'relative',
                width: `${400 * (lngWidth / latWidth)}px`,
                height: `400px`,
                backgroundColor: '#ccc',
                margin: '0 auto'
            }}>

                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1
                }}>
                    <button onClick={() => {
                        setZoom((zoom === 9 ? zoom : zoom + 1))
                    }}>+</button>
                    <span>{`zoom ${zoom}`}</span>
                    <button onClick={() => {
                        setZoom(zoom === -9 ? zoom : zoom - 1)
                    }}>-</button>
                </div>
                <ul style={{
                    margin: 0,
                    listStyle: 'none'
                }}>
                    {sortLocalesByName(locales).map(({id, name, pages, position}, i) => {
                        if(position){
                            let lng = ((position.lng*lngC)-lngMinZoomed) / (lngWidth) * 100;
                            let lat = ((position.lat*latC)-latMinZoomed) / (latWidth) * 100;

                            return (
                                <li key={i} data-lng={position.lng} data-lat={position.lat} style={{
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    left: `calc(((${position.lng} * var(--lngC)) - ${lngMinZoomed}) / ${lngWidth} * 100%)`,
                                    bottom: `calc(((${position.lat} * var(--latC)) - ${latMinZoomed}) / ${latWidth} * 100%)`,
                                    transform: `translateX(${lng > 50 ? -100 : 0}%) translateY(${lat < 50 ? -100 : 0}%)`,
                                    transition: 'left 0.3s ease-out, bottom 0.3s ease-out, transform 0.3s ease-out'

                                }}>
                                    <span id={id} style={{
                                        fontSize: 8
                                    }} onClick={() => {
                                        setCurrent({id, position})
                                    }}>{name}</span>
                                    <ul style={{
                                        display: 'none'
                                    }}>
                                        {sortPagesByTitle(pages).map((page, i) => {
                                            return (
                                                <li key={i}>
                                                    <a href={page.url} target="_blank">{page.title}</a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            )
                        }

                        return null;
                    })}
                </ul>
            </div>
        </>
    )
};

export default MapList;