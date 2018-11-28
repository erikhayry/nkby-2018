import ReactGA from 'react-ga';
import { sortPagesByTitle, parseImageSrc } from '../utils'

const PageList = ({pages = []}) =>
    <ul>
        {sortPagesByTitle(pages).map((page, i) => {
            return (
                <li key={i}>
                    <img src={parseImageSrc(page.image)} />
                    <br/>
                    <ReactGA.OutboundLink
                        eventLabel="to-nykarlebyvyer"
                        to={page.url}
                        target="_blank"
                    >
                        {page.title}`
                    </ReactGA.OutboundLink>s
                </li>
            )
        })}
    </ul>;

export default PageList;