import React from "react"
import { isClient, isCuttingTheMustard } from '../utils'

export function withPage(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            const isClientValue = isClient();

            this.state = {
                isClient: isClientValue,
                isCuttingTheMustard: isClientValue && isCuttingTheMustard(),
            };
        }

        static async getInitialProps(context) {
            const pageProps = await (WrappedComponent.getInitialProps && WrappedComponent.getInitialProps(context));
            return {
                ...pageProps
            }
        }

        componentDidMount() {
            document.documentElement.className = "js";
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
            return <WrappedComponent {...this.state} {...this.props} />;
        }
    };
}