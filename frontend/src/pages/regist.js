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

    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [error, setError] = useState('');

    // 아이디 정규표현식 : 최소 4자, 최대 16자
    const idReg = /^[A-Za-z0-9_-]{4,16}$/;
    // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자
    const pwReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    const phoneReg = /^[0-9]{10,11}$/;

    const onChangeId = (e) => {
        setId(e.currentTarget.value);

        let id = e.currentTarget.value;
        if(id.length===0) {
            setIdError('아이디를 입력해 주세요');
        } else if(!idReg.test(id)) {
            setIdError('아이디 입력 양식을 확인해 주세요');
        } else if(idReg.test(id) && id.length!==0) {
            setIdError('');
            onChangeIdCheck(e);
        }
    }

    const onChangeIdCheck = (e) => {
        let id = e.target.value;

        idCheckAPI()
        .then(res => {
            console.log(res);
            console.log(res.data.message);
            if(res.data.statusCode == 402) {
                setIdError('중복된 아이디입니다');
            }
        })
        .catch(err => { });

        async function idCheckAPI() {
            return await api.get('/api/v1/users/idcheck/'+id, {
                id: id,
            });
        }
    }

    const onChangePassword = (e) => {
        setPassword(e.currentTarget.value)

        let pw = e.currentTarget.value;
        if(pw.length===0) {
            setPwError('비밀번호를 입력해 주세요');
        } else if(!pwReg.test(pw)) {
            setPwError('비밀번호 입력 양식을 확인해 주세요');
        } else if(pw !== passwordCheck) {
            setPwError('비밀번호 동일하게 입력해 주세요');
        } else {
            setPwError('');
        }
    }
    const onChangePasswordCheck = (e) => {
        setPasswordCheck(e.currentTarget.value)

        if(e.currentTarget.value !== password) {
            setPwError('비밀번호 동일하게 입력해 주세요');
        } else {
            setPwError('');
        }
    }
    const onChangeNickname = (e) => {
        setNickname(e.currentTarget.value);

        let nickname = e.currentTarget.value;
        if(nickname.length===0) {
            setNameError('이름을 입력해 주세요');
        } else {
            setNameError('');
        }
    }
    const onChangePhone = (e) => {
        setPhone(e.currentTarget.value)

        let phone = e.currentTarget.value;
        if(phone.length===0) {
            setPhoneError('전화번호를 입력해 주세요');
        } else if(!phoneReg.test(phone)) {
            setPhoneError('전화번호 입력 양식을 확인해 주세요');
        } else {
            setPhoneError('');
        }
    }
    const onChangeEmail = (e) => {
        setEmail(e.currentTarget.value);

        let email = e.currentTarget.value;
        if(email.length===0) {
            setEmailError('이메일을 입력해 주세요');
        } else if(!emailReg.test(email)) {
            setEmailError('이메일 입력 양식을 확인해 주세요');
        } else {
            setEmailError('');
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        let isNormal = true;
        if(nickname.length===0 || email.length===0 || phone.length===0 || !emailReg.test(email) || !phoneReg.test(phone) || id.length===0 || !idReg.test(id) ||
         password!==passwordCheck || !pwReg.test(password) || passwordCheck.length===0 || password.length===0) {
            isNormal = false;
        }

        if (isNormal) {
            registAPI()
            .then(res => {alert(`회원가입 성공: ${res}`); console.log(res.data); console.log(res.data.message)})
            .catch(err => alert(`회원가입 실패: ${err}`));
        } else {
        }

        async function registAPI() {
            return await api.post("/api/v1/users", {
                id: id,
                password: password,
                name: nickname,
                email: email,
                phone: phone
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
                            <input type="text" id="id" value={id} onChange={(e) => {onChangeId(e); }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="8자 이상 ~ 16자 이하" />
                            {idError && <div style={{color:'red'}}>{idError}</div>}
                        </div>
                        <div class="mb-6">
                            <label for="nickname" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">닉네임</label>
                            <input type="text" id="nickname" value={nickname} onChange={onChangeNickname} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            {nameError && <div style={{color:'red'}}>{nameError}</div>}
                        </div>
                        <div class="mb-6">
                            <label for="password" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">비밀번호</label>
                            <input type="password" id="password" value={password} onChange={onChangePassword} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="영어, 숫자, 특수문자 포함하여 8자 이상 ~ 16자 이하" />
                            {pwError && <div style={{color:'red'}}>{pwError}</div>}
                        </div>
                        <div class="mb-6">
                            <label for="passwordCheck" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">비밀번호확인</label>
                            <input type="password" id="passwordCheck" value={passwordCheck} onChange={onChangePasswordCheck} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div class="mb-6">
                            <label for="email" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">이메일주소</label>
                            <input type="email" id="email" value={email} onChange={onChangeEmail} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="user@example.com"/>
                            {emailError && <div style={{color:'red'}}>{emailError}</div>}
                        </div>
                        <div class="mb-6">
                            <label for="phone" class="block mb-2 text-sm font-large text-gray-900 dark:text-gray-300">전화번호</label>
                            <input type="number" id="phone" value={phone} onChange={onChangePhone} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="01012345678"/>
                            {phoneError && <div style={{color:'red'}}>{phoneError}</div>}
                        </div>
                        <div>
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">회원가입하기</button>
                            {/* {error && <div style={{color:'red'}}>{error}</div>} */}
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
