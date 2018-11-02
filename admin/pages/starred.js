import React from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'
import { get } from '../utils/api'

export default class Index extends React.Component {
    static async getInitialProps () {
        const editedLocales = await get('/get/edited-locales');
        const starredPages = await get('/get/starred-pages');

        return { editedLocales, starredPages }
    }

    render () {
        console.log(this.props);
        return (
            <div>
                <Link prefetch href='/'><a>Back</a></Link>
            </div>
        )
    }
}