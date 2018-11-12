import { useState } from 'react';
import { sortPagesByTitle, sortLocalesByName, getMinMax } from '../utils'

let {min: latMin, max: latMax} = getMinMax('lat');
let {min: lngMin, max: lngMax} = getMinMax('lng');
const ratio = (lngMax - lngMin) / (latMax - latMin);

console.log(`LNG: min ${lngMin}, max ${lngMax}`)
console.log(`LAT: min ${latMin}, max ${latMax}`)
console.log(`Ratio: ${ratio}`)

function getMarkerStyle(position, lngC, lngMinZoomed, lngWidth, latC, latMinZoomed, latWidth){
    let lng = ((position.lng*lngC)-lngMinZoomed) / (lngWidth) * 100;
    let lat = ((position.lat*latC)-latMinZoomed) / (latWidth) * 100;

    return {
        '--lng': `${position.lng}`,
        '--lat': `${position.lat}`,
        '--bottom': 'calc(((var(--lat) * var(--latC)) - var(--latMinZoomed)) / var(--latWidth) * 100%)',
        '--left': 'calc(((var(--lng) * var(--lngC)) - var(--lngMinZoomed)) / var(--lngWidth) * 100%)',
        cursor: 'pointer',
        position: 'absolute',
        left: `var(--left)`,
        bottom: `var(--bottom)`,
        transform: `
            translateX(${lng > 50 ? -100 : 0}%)
            translateY(${lat < 50 ? -100 : 0}%)
        `,
        transition: 'left 0.3s ease-out, bottom 0.3s ease-out, transform 0.3s ease-out',
    }
}

function setStyle(e, freeze) {
    if (e && freeze) {
        console.log(e.getBoundingClientRect())
        const {top, x, height, width} = e.getBoundingClientRect();
        e.style.top = `${top}px`;
        e.style.left = `${x}px`;
        e.style.height = `${height}px`;
        e.style.width = `${width}px`;
        e.style.position = `absolute`;
    }
}

const MapList = ({locales, userPosition, setLocation}) => {
    const [current, setCurrent] = useState('');
    const [viewAsMap, toogleView] = useState(false);
    const [freeze, setFreezed] = useState(false);
    const [zoom, setZoom] = useState(0);
    const z = zoom / 200;

    let latMinZoomed = latMin + z;
    let latMaxZoomed = latMax - z;

    let lngMinZoomed = lngMin + (z * ratio);
    let lngMaxZoomed = lngMax - (z * ratio);

    let lngC = 1;
    let latC = 1;
    let centerLng;
    let centerLat;

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

    console.log(`current`, current)
    console.log(`zoom: ${z}`)
    console.log(`lngZoomed: min ${lngMinZoomed}, max ${lngMaxZoomed}, lngC ${lngC}, lngWidth ${lngWidth}, centerLng, ${centerLng}`)
    console.log(`latZoomed: min ${latMinZoomed}, max ${latMaxZoomed}, latC ${latC}, latWidth ${latWidth}, centerLat, ${centerLat}`)

    console.log("=====================================")

    return (
        <>
            <style jsx global>{`
                     :root {
                        --lngC: ${lngC};
                        --latC: ${latC};
                        --lngMinZoomed: ${lngMinZoomed};
                        --latMinZoomed: ${latMinZoomed};
                        --lngWidth: ${lngWidth};
                        --latWidth: ${latWidth};
                        --ratio: ${ratio};
                        --size: 400px;
                     }

                    `}</style>
            <div style={viewAsMap ? {
                position: 'relative',
                width: `calc(var(--ratio) * var(--size))`,
                height: 'var(--size)',
                margin: '0 auto'
            } : {} }>
                <div style={viewAsMap ? {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1
                } : {}}>
                    {viewAsMap && <>
                        <button onClick={() => {
                        setZoom((zoom === 19 ? zoom : zoom + 1))
                        }}>+</button>
                        <span>{`zoom ${zoom}`}</span>
                        <button onClick={() => {
                            setZoom(zoom === -19 ? zoom : zoom - 1)
                        }}>-</button>
                        <button onClick={setLocation}>Hitta mig</button>
                    </>}
                    {!viewAsMap && <button onClick={() => {
                        toogleView(true)
                    }}>Som karta</button>}
                </div>
                <div ref={(node) => setStyle(node, freeze)}>
                    {userPosition &&
                        <h2 data-lng={userPosition.lng}
                            data-lat={userPosition.lat}
                            style={viewAsMap ? {
                                ...getMarkerStyle(userPosition, lngC, lngMinZoomed, lngWidth, latC, latMinZoomed, latWidth),
                                zIndex: 1,
                                color: 'pink',
                            } : {}}>
                            JAG
                        </h2>}
                    {sortLocalesByName(locales).map(({id, name, pages, position}, i) => {
                        if(position){
                            return (
                                <h2 key={i}
                                    data-lng={position.lng}
                                    data-lat={position.lat}
                                    style={viewAsMap ? getMarkerStyle(position, lngC, lngMinZoomed, lngWidth, latC, latMinZoomed, latWidth) : {}}
                                    ref={(node) => setStyle(node, freeze)}
                                >
                                    <span id={id} style={viewAsMap ? {
                                        fontSize: 8
                                    } : {}} onClick={() => {
                                        setCurrent({id, position})
                                    }}>{name}</span>
                                    <ul style={viewAsMap || freeze ? {
                                        display: 'none'
                                    } : {}}>
                                        {sortPagesByTitle(pages).map((page, i) => {
                                            return (
                                                <li key={i}>
                                                    <a href={page.url} target="_blank">{page.title}</a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </h2>
                            )
                        }

                        return null;
                    })}
                </div>
            </div>
        </>
    )
};

export default MapList;