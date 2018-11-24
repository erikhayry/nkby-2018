import { sortPagesByTitle, sortLocalesByName } from '../utils'
import Link from 'next/link'
import ReactGA from 'react-ga';

const MapList = ({locales, currentLocale = {}}) => {

    return (
        <div style={{
            padding: 20
        }}>
            {sortLocalesByName(locales).map(({id, name, pages, position}, i) => {
                if(position){
                    return (

                        <div key={i}>
                            <Link prefetch href={`/?locale=${id}`} as={`/locale/${id}`} ><a>{name}</a></Link>
                            <ul style={currentLocale.id === id ? {
                                display: 'block'
                            } : {
                                display: 'none'
                            }}>
                                {sortPagesByTitle(pages).map((page, i) => {
                                    return (
                                        <li key={i}>
                                            <ReactGA.OutboundLink
                                                eventLabel="to-nykarlebyvyer"
                                                to={page.url}
                                                target="_blank"
                                            >
                                                {page.title}`
                                            </ReactGA.OutboundLink>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                }

                return null;
            })}

        </div>
    )
};

export default MapList;