import Document, { Head, NextScript, Main } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            <link rel="stylesheet" href="/static/styles.css"/>
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
            <noscript>
                <style>{`.map-list { display: block }`}</style>          
            </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
