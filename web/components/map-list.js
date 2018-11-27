import { sortLocalesByName } from '../utils'
import Link from 'next/link'

const MapList = ({locales}) => {
    const sortedLocales = sortLocalesByName(locales).filter(({position}) => position);
    const letterList = sortedLocales.map(({name}) => name[0]).filter((value, index, self) => self.indexOf(value) === index);

    return (
        <div style={{
            padding: 20
        }}>
            <ul>
                {letterList.map((letter, i) => <li key={i}><a href={`#${letter}`}>{letter}</a></li>)}
            </ul>

            {sortedLocales.map(({id, name, pages, position}, i) => {
                if(position){
                    const firstLetter = name[0];
                    const firstOnLetterLocale = sortedLocales.find(({name}) => firstLetter === name[0]);
                    const heading = firstOnLetterLocale.id === id ? <h2 id={firstLetter}>{firstLetter}</h2> : null;

                    return (
                        <>
                            {heading}
                            <div key={i}>
                                <Link prefetch href={`/?locale=${id}`} as={`/locale/${id}`} ><a>{name} [{pages.length}]</a></Link>
                            </div>
                        </>
                    )
                }

                return null;
            })}
        </div>
    )
};

export default MapList;