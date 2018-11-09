import { sortPagesByTitle, sortLocalesByName, getMinMax } from '../utils'

const lat = 63.5217687; // = 50%
const lng = 22.5216011; // 50%

let {min: latMin, max: latMax} = getMinMax('lat');
let {min: lngMin, max: lngMax} = getMinMax('lng');
//lngMax = 22.5510306;
//latMax = 63.5319811;
//
const latWidth = (latMax - latMin);
const lngWidth = (lngMax - lngMin);


console.log(latMin, latMax);
console.log(lngMin, lngMax);
console.log(latWidth, lngWidth);
console.log('mitt ', (latMin + latMax)/2, (lngMin + lngMax)/2);
const midLng = (lngMax + lngMin) / 2;
const lngC = midLng/22.5428763;

const midLat = (latMax + latMin) / 2;
const latC = 1 //midLat/63.5580228;
//(lat*(mid/lat) - min) / (max - min)

const MapList = ({locales}) => {
    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#ccc'
        }}>
            <ul style={{
                margin: 0,
                listStyle: 'none' +
                ''
            }}>
                {sortLocalesByName(locales).map(({id, name, pages, position}, i) => {
                    if(position){
                        const zoom = 10;
                        let lng = ((position.lng*lngC)-lngMin) / (lngWidth) * 100;
                        //if(lng > 50){
                        //    lng = lng + zoom
                        //} else if(lng < 50){
                        //    lng = lng - zoom
                        //}

                        let lat = ((position.lat*latC)-latMin) / (latWidth) * 100;
                        //if(lat > 50){
                        //    lat = lat + zoom
                        //} else if(lat < 50){
                        //    lat = lat - zoom
                        //}

                        return (
                            <li key={i} data-lng={position.lng} data-lat={position.lat} style={{
                                position: 'absolute',
                                left: `${lng}%`,
                                bottom: `${lat}%`,
                                transform: `translateX(${lng > 50 ? -100 : 0}%) translateY(${lat < 50 ? -100 : 0}%)`
                            }}>
                                <span id={id} style={{
                                    //display: 'none'
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
    )
};

export default MapList;