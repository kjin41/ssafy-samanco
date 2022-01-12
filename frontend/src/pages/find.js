import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Login page (/:login)
*
*/
const Find = () => {

    return (
        <>
            {/* <MetaData
                data={data}
                location={location}
                type="website"
            /> */}
            <Helmet>
                {/* <style type="text/css">{`${page.codeinjection_styles}`}</style> */}
            </Helmet>
            <Layout>
                <div className="container">
                    비밀번호 찾기
                </div>
            </Layout>
        </>
    )
}

// Login.propTypes = {
//     data: PropTypes.shape({
//         ghostPage: PropTypes.shape({
//             codeinjection_styles: PropTypes.object,
//             title: PropTypes.string.isRequired,
//             html: PropTypes.string.isRequired,
//             feature_image: PropTypes.string,
//         }).isRequired,
//     }).isRequired,
//     location: PropTypes.object.isRequired,
// }

export default Find

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
