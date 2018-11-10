import { useState } from 'react';
import { sortPagesByTitle, sortLocalesByName, getMinMax } from '../utils'

let {min: latMin, max: latMax} = getMinMax('lat');
let {min: lngMin, max: lngMax} = getMinMax('lng');
const ratio = (lngMax - lngMin) / (latMax - latMin);


const MapList = ({locales, userPosition, setLocation}) => {
    const [current, setCurrent] = useState('');
    const [zoom, setZoom] = useState(0);
    const z = zoom / 200;

    let latMinZoomed = latMin + z;
    let latMaxZoomed = latMax - z;

    let lngMinZoomed = lngMin + (z * ratio);
    let lngMaxZoomed = lngMax - (z * ratio);

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
                        --lngMinZoomed: ${lngMinZoomed};
                        --lngWidth: ${lngWidth};
                     }

                    `}</style>
            <div style={{
                position: 'relative',
                width: `${400 * ratio}px`,
                height: `400px`,
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
                    <button onClick={setLocation}>Hitta mig</button>
                </div>
                <ul style={{
                    margin: 0,
                    listStyle: 'none'
                }}>
                    {userPosition &&
                        <li data-lng={userPosition.lng}
                            data-lat={userPosition.lat}
                            style={{
                                '--lng': `${userPosition.lng}`,
                                '--left': `${((userPosition.lng*lngC)-lngMinZoomed) / (lngWidth) * 100}`,
                                cursor: 'pointer',
                                position: 'absolute',
                                left: `calc(var(--left) * 1%)`,
                                bottom: `calc(((${userPosition.lat} * var(--latC)) - ${latMinZoomed}) / ${latWidth} * 100%)`,
                                transform: `
                                        translateX(${((userPosition.lng*lngC)-lngMinZoomed) / (lngWidth) * 100 > 50 ? -100 : 0}%)
                                        translateY(${((userPosition.lat*latC)-latMinZoomed) / (latWidth) * 100 < 50 ? -100 : 0}%)
                                        `,
                                transition: 'left 0.3s ease-out, bottom 0.3s ease-out, transform 0.3s ease-out',
                                zIndex: 1,
                                color: 'red',
                            }}>
                            JAG
                        </li>}
                    {sortLocalesByName(locales).map(({id, name, pages, position}, i) => {
                        if(position){
                            let lng = ((position.lng*lngC)-lngMinZoomed) / (lngWidth) * 100;
                            let lat = ((position.lat*latC)-latMinZoomed) / (latWidth) * 100;

                            return (
                                <li key={i}
                                    data-lng={position.lng}
                                    data-lat={position.lat}
                                    style={{
                                        '--lng': `${position.lng}`,
                                        '--left': `${((position.lng*lngC)-lngMinZoomed) / (lngWidth) * 100}`,
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        left: `calc(var(--left) * 1%)`,
                                        bottom: `calc(((${position.lat} * var(--latC)) - ${latMinZoomed}) / ${latWidth} * 100%)`,
                                        transform: `translateX(${lng > 50 ? -100 : 0}%) translateY(${lat < 50 ? -100 : 0}%)`,
                                        transition: 'left 0.3s ease-out, bottom 0.3s ease-out, transform 0.3s ease-out'

                                    }}
                                >
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