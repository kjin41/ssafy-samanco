import React, { useState } from 'react'
import { graphql, Link, navigate } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { loginAPI } from "../utils/api/user"

const Login = () => {

    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')

    //input data의 변화가 있을 떄마다 value 값을 변경
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let isNormal = true;
        let msg = "";

        if (!inputId) {
            isNormal = false;
            msg = "아이디를 입력해주세요."
        } else if (!inputPw) {
            isNormal = false;
            msg = "비밀번호를 입력해주세요."
        }

        if (isNormal) {
            loginAPI(inputId, inputPw)
            .then(res => {
                switch (res.statusCode) {
                    case 200:
                        alert(`로그인에 성공하였습니다!`)
                        navigate("/")
                        break;
                    default:
                        alert(`로그인에 실패하였습니다. 아이디와 비밀번호를 확인해 주세요.`)
                        break;
                }
            })
        } else {
            alert(msg)
        }
    };


    return (
        <>
            <Helmet></Helmet>
            <Layout>
            <div className="loginContainer">
                    <form onSubmit={handleSubmit} className="">
                        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                            <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center font-bold text-2xl'>Login🔐</h1><br/>
                            <div class="mb-4">
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="inputId">
                                UserID
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                            id="inputId"
                            value={inputId}
                            onChange={handleInputId}
                            type="text"
                            placeholder="아이디"
                            ></input>
                            </div>
                            <div class="mb-6">
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="inputPw">
                                Password
                            </label>
                            <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                            id="inputPw"
                            value={inputPw}
                            onChange={handleInputPw}
                            type="password"
                            placeholder="비밀번호"
                            ></input>
                            <p class="text-red text-xs italic">Forgot your password?</p>
                            </div>
                            <div class="flex items-center justify-between">
                            <button type="submit" class="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">Login</button>
                            <a class="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                                비밀번호 찾기
                            </a>
                            </div>
                        </div>
                    </form>
                </div>
            </Layout>
        </>
    )
}

export default Login

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
