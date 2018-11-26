import { sortLocalesByName } from '../utils'
import Link from 'next/link'

const MapList = ({locales}) => {
    return (
        <div style={{
            padding: 20
        }}>
            {sortLocalesByName(locales).map(({id, name, pages, position}, i) => {
                if(position){
                    return (

                        <div key={i}>
                            <Link prefetch href={`/?locale=${id}`} as={`/locale/${id}`} ><a>{name} [{pages.length}]</a></Link>
                        </div>
                    )
                }

                return null;
            })}

        </div>
    )
};

export default MapList;