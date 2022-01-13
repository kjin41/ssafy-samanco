import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'

import api from "../utils/api"

/**
* Regist page (/:regist)
*/
const Regist = () => {

    const [inputState, setInputState] = useState({
        id: "",
        name: "",
        password: "",
        passwordConfirm: "",
        email: "",
        phone: "",
      });

    const handleChange = (e) => {
        const { id, value } = e.target;

        setInputState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const idReg = /^[A-Za-z0-9_-]{4,8}$/;
    // 아이디 정규표현식 : 최소 4자, 최대 8자

    const pwReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자

    const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/

    const phoneReg = /^[0-9]{8,13}$/;

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputState)

        let isNormal = true;
        let msg = "";

        if (!inputState.id) {
            isNormal = false;
            msg = "아이디를 입력해주세요."
        } else if (!idReg.test(inputState.id)) {
            isNormal = false;
            msg = "아이디의 양식을 확인해주세요."
        } else if (!inputState.password) {
            isNormal = false;
            msg = "비밀번호를 입력해주세요."
        } else if (!pwReg.test(inputState.password)) {
            isNormal = false;
            msg = "비밀번호 양식을 확인해주세요."
        } else if (inputState.password != inputState.passwordConfirm) {
            isNormal = false;
            msg = "비밀번호가 동일하지 않습니다."
        } else if (!inputState.name) {
            isNormal = false;
            msg = "이름을 입력해주세요."
        } else if (!inputState.email) {
            isNormal = false;
            msg = "이메일을 입력해주세요."
        } else if (!emailReg.test(inputState.email)) {
            isNormal = false;
            msg = "이메일 양식을 확인해주세요."
        } else if (!inputState.phone) {
            isNormal = false;
            msg = "전화번호를 입력해주세요."
        } else if (!phoneReg.test(inputState.phone)) {
            isNormal = false;
            msg = "전화번호 양식을 확인해주세요."
        } else {
            isNormal = true;
        }

        if (isNormal) {
            registAPI()
            .then(res => {alert(`회원가입 성공: ${res.data.message}`); })
            .catch(err => alert(`회원가입 실패: ${err}`));
        } else {
            alert(msg)
        }

        async function registAPI() {
            return await api.post("/api/v1/users", {
                email: inputState.email,
                id: inputState.id,
                name: inputState.name,
                password: inputState.password,
                phone: inputState.phone
            });
        }
    };


    return (
        <>
            <Helmet>
                {/* <style type="text/css">{`${page.codeinjection_styles}`}</style> */}
            </Helmet>
            <Layout>
                <div className="container mx-auto max-w-xl cols-6">
                    <form onSubmit={handleSubmit}>
                        {/* 아이디 */}
                        <div className="mb-6">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">아이디</label>
                            <input
                                type="text" id="id" value={inputState.id} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="4~8자리" required=""></input>
                        </div>
                        {/* 비밀번호 */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">비밀번호</label>
                            <input type="password" id="password" value={inputState.password} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="8~16자리, 영문자, 숫자, 특수문자" required=""></input>
                        </div>
                        {/* 비밀번호 확인 */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">비밀번호 확인</label>
                            <input type="password" id="passwordConfirm" value={inputState.passwordConfirm} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="" required=""></input>
                        </div>
                        {/* 이름 */}
                        <div className="mb-6">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">이름</label>
                            <input
                                type="text" id="name" value={inputState.name} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="" required=""></input>
                        </div>
                        {/* 이메일 */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">이메일</label>
                            <input type="email" id="email" value={inputState.email} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="" required=""></input>
                        </div>
                        {/* 전화번호 */}
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">전화번호</label>
                            <input type="number" id="phone" value={inputState.phone} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="'-' 없이 입력해주세요" required=""></input>
                        </div>

                        {/* 가입 버튼 */}
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">가입하기</button>
                    </form>
                </div>
            </Layout>
        </>
    )
}

export default Regist

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
