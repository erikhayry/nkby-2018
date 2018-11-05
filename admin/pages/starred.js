import React from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'
import { get } from '../utils/api'
import locales from '../static/crawler-result-with-locales.json';

export default class Index extends React.Component {
    static async getInitialProps () {
        const editedLocales = await get('/get/edited-locales');
        const starredPages = await get('/get/starred-pages');

        return { editedLocales, starredPages }
    }

    render () {
        const {starredPages, editedLocales} = this.props;
        const res = [];

        starredPages.forEach(starredPage => {
            let s = {
                url: starredPage,
                locales: []
            };

            Object.keys(editedLocales).forEach(key => {
                const {approvedPages = []} = editedLocales[key];

                const pageIndex = approvedPages.findIndex(approvedPage => {
                    return approvedPage.url ===  starredPage;
                })

                if(pageIndex > -1){
                    s.locales.push({id: key, ...approvedPages[pageIndex]})
                }

            })
            
            res.push(s)
        })

        return (
            <div>
                <h1>Starred</h1>
                <ul>

                    {res.map((starredPage, i) => {
                        return (
                            <li key={starredPage.url}>
                                <h2>{starredPage.url}</h2>
                                <ul>
                                    {starredPage.locales.map((locale, i) => {
                                        return (
                                            <li key={i}>
                                                {locale.id}
                                            </li>
                                        )
                                    })}

                                </ul>
                            </li>
                        )
                    })}
                </ul>

                <Link prefetch href='/'><a>Back</a></Link>
            </div>
        )
    }
}