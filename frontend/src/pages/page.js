import React, {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'


/**
* Finding Password page (/:findpw)
*
*/
const Page = ({ data, location }) => {
    // const page = data.ghostPage

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="website"
            />
            <Helmet>
                {/* <style type="text/css">{`${page.codeinjection_styles}`}</style> */}
            </Helmet>
            <Layout>
                <>
                <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    비밀번호 찾기
                </div>
                </>
            </Layout>
        </>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            codeinjection_styles: PropTypes.object,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Page

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
