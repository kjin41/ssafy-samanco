import React, {useCallback, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

import api from '../apis/api'

/**
* Regist page (/:regist)
*
*/
const Regist = ({ data, location }) => {
    // const page = data.ghostPage

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');

    // 아이디 정규표현식 : 최소 8자, 최대 16자
    const idReg = /^[A-Za-z0-9_-]{8,16}$/;
    // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자
    const pwReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    const phoneReg = /^[0-9]{8,13}$/;


    const onChangeId = (e) => {
        setId(e.currentTarget.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.currentTarget.value)
    }
    const onChangePasswordCheck = (e) => {
        setPasswordCheck(e.currentTarget.value)
    }
    const onChangeNickname = (e) => {
        setNickname(e.currentTarget.value);
    }
    const onChangePhone = (e) => {
        setPhone(e.currentTarget.value)
    }
    const onChangeEmail = (e) => {
        setEmail(e.currentTarget.value);
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
        } else if(passwordCheck.length===0) {
            setError('비밀번호 확인용을 입력해 주세요');
            isNormal = false;
        } else if(nickname.length===0) {
            setError('닉네임을 입력해 주세요');
            isNormal = false;
        } else if(email.length===0) {
            setError('이메일을 입력해 주세요');
            isNormal = false;
        } else if(phone.length===0) {
            setError('전화번호를 입력해 주세요');
            isNormal = false;
        } else if(!idReg.test(id)) {
            setError('아이디 입력 양식을 확인해 주세요');
            isNormal = false;
        } else if(!pwReg.test(password)) {
            setError('비밀번호 입력 양식을 확인해 주세요');
            isNormal = false;
        } else if(!emailReg.test(email)) {
            setError('이메일 입력 양식을 확인해 주세요');
            isNormal = false;
        } else if(!phoneReg.test(phone)) {
            setError('전화번호 입력 양식을 확인해 주세요');
            isNormal = false;
        } else if(password!==passwordCheck) {
            setError('비밀번호가 동일한지 확인해 주세요');
            isNormal = false;
        } else {
            setError('');
            isNormal = true;
        }

        if (isNormal) {
            registAPI()
            .then(res => {alert(`회원가입 성공: ${res}`); console.log(res.data.message)})
            .catch(err => alert(`회원가입 실패: ${err}`));
        }

        async function registAPI() {
            return await api.post("/api/v1/users", {
                id: id,
                password: password
            });
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
                <div className="container">
                    회원가입
                    <form onSubmit={onSubmit}>
                        <div class="mb-6">
                            <label for="id" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">아이디</label>
                            <input type="text" id="id" value={id} onChange={onChangeId} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="8자 이상 ~ 16자 이하" />
                        </div>
                        <div class="mb-6">
                            <label for="nickname" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">닉네임</label>
                            <input type="text" id="nickname" value={nickname} onChange={onChangeNickname} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div class="mb-6">
                            <label for="password" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">비밀번호</label>
                            <input type="password" id="password" value={password} onChange={onChangePassword} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="영어, 숫자, 특수문자 포함하여 8자 이상 ~ 16자 이하" />
                        </div>
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
                            {error && <div style={{color:'red'}}>{error}</div>}
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
