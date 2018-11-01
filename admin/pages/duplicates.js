import React from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'

export default class Index extends React.Component {
    static async getInitialProps () {
        const editedLocalesJson = await fetch('http://localhost:3001/get/edited-locales')
        const editedLocales = await editedLocalesJson.json()

        return { editedLocales }
    }

    render () {
        const {editedLocales} = this.props;
        const res = {};

        for(var key in editedLocales){
            const approvedPages = editedLocales[key].approvedPages || [];

            approvedPages.forEach(page => {
                const {url} = page;
                if(res[url]){
                    res[url].push(key)
                } else {
                    res[url] = [key]
                }
            })
        }

       let duplicates = Object.keys(res)
            .filter( key => res[key].length > 1 )
            .reduce( (r, key) => (r[key] = res[key], r), {} );

        console.log(duplicates)
        return (
            <div>
                <Link prefetch href='/'><a>Back</a></Link>
            </div>
        )
    }
}