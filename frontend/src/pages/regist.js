import React, {useCallback, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

import useInput from '../hooks/useInput'
import axios from 'axios'

/**
* Regist page (/:regist)
*
*/
const Regist = ({ data, location }) => {
    // const page = data.ghostPage

    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
    const [phone, onChangePhone] = useInput('');
    const [email, onChangeEmail] = useInput('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const onChangePasswordCheck = useCallback((e)=>{
        setPasswordCheck(e.target.value);
    }, [password])

    const onSubmitForm = useCallback(() => {
        alert([id, password, nickname, phone]);
        if(password!==passwordCheck) {
            return setPasswordError(true);
        }
        // useEffect(() => {
        //     axios.put('')
        // })
    }, [id, nickname, phone, email, password, passwordCheck])

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
                <div className="container">
                    회원가입
                    <form onSubmit={onSubmitForm}>
                        <div class="mb-6">
                            <label for="id" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">아이디</label>
                            <input type="text" id="id" value={id} onChange={onChangeId} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        {/* <div>
                            <label>아이디</label>
                            <input name="id" value={id} required onChange={onChangeId}/>
                        </div> */}
                        <div class="mb-6">
                            <label for="nickname" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">닉네임</label>
                            <input type="text" id="nickname" value={nickname} onChange={onChangeNickname} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        {/* <div>
                            <label>닉네임</label>
                            <input name="nickname" value={nickname} required onChange={onChangeNickname} />
                        </div> */}
                        <div class="mb-6">
                            <label for="password" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">비밀번호</label>
                            <input type="password" id="password" value={password} onChange={onChangePassword} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        {/* <div>
                            <label>비밀번호</label>
                            <input name="password" value={password} required onChange={onChangePassword} />
                        </div> */}
                        {/* <div>
                            <label>비밀번호확인</label>
                            <input name="passwordCheck" required onChange={onChangePasswordCheck} />
                        </div> */}
                        <div class="mb-6">
                            <label for="passwordCheck" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">비밀번호확인</label>
                            <input type="password" id="passwordCheck" value={passwordCheck} onChange={onChangePasswordCheck} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div class="mb-6">
                            <label for="email" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">이메일주소</label>
                            <input type="email" id="email" value={email} onChange={onChangeEmail} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="user@example.com"/>
                        </div>
                        <div class="mb-6">
                            <label for="phone" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">전화번호</label>
                            <input type="number" id="phone" value={phone} onChange={onChangePhone} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="01012345678"/>
                        </div>
                        <div>
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">회원가입하기</button>
                        </div>
                    </form>
                </div>
            </Layout>
        </>
    )
}

Regist.propTypes = {
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

export default Regist

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
