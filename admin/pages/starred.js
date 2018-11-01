import React from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'

export default class Index extends React.Component {
    static async getInitialProps () {
        const editedLocalesJson = await fetch('http://localhost:3001/get/edited-locales')
        const editedLocales = await editedLocalesJson.json()

        const starredPagesJson = await fetch('http://localhost:3001/get/starred-pages')
        const starredPages = await starredPagesJson.json()

        return { editedLocales, starredPages }
    }

    render () {
        console.log(this.props)
        return (
            <div>
                <Link prefetch href='/'><a>Back</a></Link>
            </div>
        )
    }
}