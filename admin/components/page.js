import React from 'react'
import Head from 'next/head'
import { List, Header, Icon, Image, Grid, Button, Menu } from 'semantic-ui-react'

const Page = ({ children, title, styles = {} }) => (
    <div style={{padding: 20, ...styles}}>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"></link>
        </Head>
        <style jsx global>
            {`
              body {
                color: #222;
                margin: 0;
              }
            `}
        </style>
        <Menu>
            <Menu.Item
                name='editorials'
            >
                Editorials
            </Menu.Item>

            <Menu.Item name='reviews'  >
                Reviews
            </Menu.Item>

            <Menu.Item
                name='upcomingEvents'
            >
                Upcoming Events
            </Menu.Item>
        </Menu>
        {title && <Header as='h2' icon textAlign='center'>
            <Icon name='star' circular />
            <Header.Content>{title}</Header.Content>
        </Header>}
        {children}
    </div>
);

export default Page;

