import React, {useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

import api from '../apis/api'

/**
* Login page (/:login)
*
*/
const Login = ({ data, location }) => {
    // const page = data.ghostPage

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onChangeId = (e) => {
        setId(e.currentTarget.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        let isNormal = true;

        if(id.length===0) {
            setError('아이디를 입력해 주세요');
            isNormal = false;
        } else if(password.length===0) {
            setError('비밀번호를 입력해 주세요');
            isNormal = false;
        }

        if (isNormal) {
            loginAPI()
            .then(res => {
                alert(`로그인 성공: ${res.data.accessToken}`);
                navigate("/", {replace: true});
            })
            .catch(err => alert(`로그인 실패: ${err}`));
        } else {
        }

        async function loginAPI() {
            return await api.post("/api/v1/auth/login", {
                id: id,
                password: password
            })
        }
    }

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
                <div class="max-w-md w-full space-y-8">
                    <div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        로그인하기
                    </h2>
                    </div>
                    <form class="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div>
                        <label for="id" class="sr-only">아이디</label>
                        <input id="id" name="id" value={id} type="text" onChange={onChangeId} required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="아이디" />
                        </div>
                        <div>
                        <label for="password" class="sr-only">비밀번호</label>
                        <input id="password" name="password" type="password" value={password} onChange={onChangePassword} autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="비밀번호" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                            아이디 저장
                        </label>
                        </div>
                        <div class="text-sm">
                        <a href="/findpw" class="font-medium text-indigo-600 hover:text-indigo-500">
                            비밀번호 찾기
                        </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        로그인
                        </button>
                        {error && <div style={{color:'red'}}>{error}</div>}
                    </div>
                    </form>
                </div>
                </div>
                </>
            </Layout>
        </>
    )
}

Login.propTypes = {
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

export default Login

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
