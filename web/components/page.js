import React from "react"
import {withRouter} from 'next/router'
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import '../styles/global.scss';

class Page extends React.PureComponent {
    componentDidMount() {
        const isDev = process.env.NODE_ENV !== 'production';
        if (!isDev) {
            ReactGA.initialize('UA-129661075-1', {
                debug: true,
                titleCase: false
            });
            Sentry.init({
                dsn: 'https://89980de6a8aa466695ae8186dba70f9b@sentry.io/1305873'
            });
        }
    }

    render() {
        return (
            <div style={{
                padding: 20
            }}>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(Page);
