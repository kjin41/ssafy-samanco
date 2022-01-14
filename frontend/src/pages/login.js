import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { graphql, Link, navigate } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

import { getUserInfo, loginAPI } from "../utils/api/user"
/**
* Login page (/:login)
*
*/
const Login = () => {

    const [inputState, setInputState] = useState({
        id: "",
        password: "",
      });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInputState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let isNormal = true;
        let msg = "";

        if (!inputState.id) {
            isNormal = false;
            msg = "아이디를 입력해주세요."
        } else if (!inputState.password) {
            isNormal = false;
            msg = "비밀번호를 입력해주세요."
        }

        if (isNormal) { // 유효성 검사 통과 시 login API 요청

            loginAPI(inputState)
            .then(res => {
                switch (res.statusCode) {
                    case 200: // 로그인 성공
                        alert(`로그인 성공: ${res.accessToken}`)
                        sessionStorage.setItem("userToken", res.accessToken);
                        sessionStorage.setItem("userId", inputState.id);
                        getUserInfo(res.accessToken).then(res=>console.log(res))
                        navigate("/")
                        break;
                    case 401: // 비밀번호 틀림
                        alert("비밀번호를 확인해주세요.")
                        break;
                    case 404: // 유저 정보 X
                        alert("회원 정보가 존재하지 않습니다.")
                        break;
                    default:
                        alert(`로그인 중 문제가 발생했습니다. 관리자에게 문의하세요. 에러코드 (${res.statusCode})`)
                        break;
                }
            })
        } else {
            alert(msg)
        }
    };


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
                <div className="container mx-auto max-w-xl">
                    <form onSubmit={handleSubmit} className="">
                        <div className="mb-6">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">아이디</label>
                            <input
                                type="text" id="id" value={inputState.id} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="4~8자리" required=""></input>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">비밀번호</label>
                            <input type="password" id="password" value={inputState.password} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="8~16자리, 영문자, 숫자, 특수문자" required=""></input>
                        </div>
                        <div className="flex justify-between mb-6">
                            <div className="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required=""></input>
                                <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-900 dark:text-gray-300">정보 기억하기</label>
                                </div>
                            </div>
                            <div className="ml-3 text-sm">
                                <Link to="/find" className="float-right text-blue-700" >비밀번호 찾기</Link>
                            </div>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">로그인</button>
                    </form>
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

export default Login

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`