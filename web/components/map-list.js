import { useState } from 'react';
import { sortPagesByTitle, sortLocalesByName, getMinMax } from '../utils'
import Link from 'next/link'

const defaultPosition = {
    lat: 63.52305989999999, lng: 22.5271176
};
let {min: latMin, max: latMax} = getMinMax('lat');
let {min: lngMin, max: lngMax} = getMinMax('lng');
const ratio = (lngMax - lngMin) / (latMax - latMin);

//console.log(`LNG: min ${lngMin}, max ${lngMax}`)
//console.log(`LAT: min ${latMin}, max ${latMax}`)
//console.log(`Ratio: ${ratio}`)

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
        fontSize: 12
    }
}

function scrollTo(e, shouldScrollIntoView){
    if(e && shouldScrollIntoView){
        window.setTimeout(() => {
            e.scrollIntoView(true);
        }, 0) //Temp hack
    }
}

function setStyle(e, freeze) {
    if (e && freeze) {
        //console.log(e.getBoundingClientRect())
        const {top, x, height, width} = e.getBoundingClientRect();
        e.style.top = `${top}px`;
        e.style.left = `${x}px`;
        e.style.height = `${height}px`;
        e.style.width = `${width}px`;
        e.style.position = `absolute`;
    }
}

function getPosition(position = {}, lngMaxZoomed, lngMinZoomed, latMaxZoomed, latMinZoomed){
    const centerLng = position.lng;
    const centerLat = position.lat;

    const midLng = (lngMaxZoomed + lngMinZoomed) / 2;
    const lngC = midLng/centerLng;

    const midLat = (latMaxZoomed + latMinZoomed) / 2;
    const latC = midLat/centerLat;

    return {
        centerLng,
        centerLat,
        lngC,
        latC
    }
}

const MapList = ({locales, userPosition, setLocation, currentLocale = {}}) => {
    const [viewAsMap, toogleView] = useState(false);
    const [zoom, setZoom] = useState(18);
    const z = zoom / 200;

    let latMinZoomed = latMin + z;
    let latMaxZoomed = latMax - z;

    let lngMinZoomed = lngMin + (z * ratio);
    let lngMaxZoomed = lngMax - (z * ratio);

    const latWidth = (latMaxZoomed - latMinZoomed);
    const lngWidth = (lngMaxZoomed - lngMinZoomed);

    const {
        centerLng,
        centerLat,
        lngC,
        latC
    } = getPosition(currentLocale ? currentLocale.position : defaultPosition, lngMaxZoomed, lngMinZoomed, latMaxZoomed, latMinZoomed);

    //console.log(`current`, currentLocale)
    //console.log(`zoom: ${z}`)
    //console.log(`lngZoomed: min ${lngMinZoomed}, max ${lngMaxZoomed}, lngC ${lngC}, lngWidth ${lngWidth}, centerLng, ${centerLng}`)
    //console.log(`latZoomed: min ${latMinZoomed}, max ${latMaxZoomed}, latC ${latC}, latWidth ${latWidth}, centerLat, ${centerLat}`)
    //console.log("=====================================")

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
                        --size: ${ratio > 1 ? '100vh' : '100wv'};
                     }

                    `}</style>
            <div className="map-list" style={viewAsMap ? {
                position: 'relative',
                width: `calc(var(--ratio) * var(--size))`,
                height: 'var(--size)',
                margin: '0 auto',
                overflow: 'auto'
            } : {} }
            >
                <div style={viewAsMap ? {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1
                } : {}}>
                    <div style={{
                        position: 'fixed',
                        top: 10,
                        right: 10
                    }}>
                        {viewAsMap &&  <>
                            <button onClick={() => {
                            setZoom((zoom === 19 ? zoom : zoom + 1))
                            }}>+</button>
                            <span>{`zoom ${zoom}`}</span>
                            <button onClick={() => {
                                setZoom(zoom === -19 ? zoom : zoom - 1)
                            }}>-</button>
                            <button onClick={setLocation}>Hitta mig</button>
                            <button onClick={() => {
                                toogleView(false)
                            }}>Visa som lista</button>
                        </>}
                        {!viewAsMap && <button onClick={() => {
                            toogleView(true)
                        }}>Visa som karta</button>}
                    </div>
                </div>
                <div>
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
                                    ref={node => scrollTo(node, currentLocale.id === id && !viewAsMap)}
                                >

                                    <Link prefetch href={`/?locale=${id}`} ><a>{name}</a></Link>

                                    <ul style={!viewAsMap && currentLocale.id === id ? {
                                       display: 'block'
                                    } : {
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