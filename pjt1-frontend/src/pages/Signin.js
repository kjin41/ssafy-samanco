import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { graphql, navigate } from 'gatsby'
import { Helmet } from 'react-helmet'

import { Layout } from '../components/common'

import { registAPI, idCheckAPI } from "../utils/api/user"

const Signin = () => {

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const [idCheck, setIdCheck] = useState(null);
    const [pwCheck, setPwCheck] = useState(null);
    const [pwConfirm, setPwConfirm] = useState(null);

    //input data의 변화가 있을 떄마다 value 값을 변경
    const handleId = (e) => {
        setId(e.target.value)
    }
    const handleName = (e) => {
        setName(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const handlePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value)
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePhone = (e) => {
        setPhone(e.target.value)
    }


    const idHandleChange = (e) => {
        const value = e.target.value;
        idCheckAPI(value).then(res => {
            setIdCheck({code:res.statusCode, msg: res.message})
        })
    };

    const pwHandleChange = (e) => {
        const value = e.target.value;
        setPwCheck(pwReg.test(value)?
            {code:200, msg:"사용 가능한 비밀번호입니다"}
            :
            {code:401, msg:"비밀번호는 영문, 숫자, 특수문자 포함 8~16자"}
        )
    };

    const pwConfirmCheck = (e) => {
        const value = e.target.value;
        setPwConfirm(password == value? true : false)
    }

    const idReg = /^[A-Za-z0-9_-]{4,8}$/;
    const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{8,16}$/;
    const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    const phoneReg = /^[0-9]{10,11}$/;

    const handleSubmit = (event) => {
        event.preventDefault();

        let isNormal = true;
        let msg = "";

        if (!id) {
            isNormal = false;
            msg = "아이디를 입력해주세요."
        } else if (!idReg.test(id)) {
            isNormal = false;
            msg = "아이디의 양식을 확인해주세요."
        } else if (!password) {
            isNormal = false;
            msg = "비밀번호를 입력해주세요."
        } else if (!pwReg.test(password)) {
            isNormal = false;
            msg = "비밀번호 양식을 확인해주세요."
        } else if (password != passwordConfirm) {
            isNormal = false;
            msg = "비밀번호가 동일하지 않습니다."
        } else if (!name) {
            isNormal = false;
            msg = "이름을 입력해주세요."
        } else if (!email) {
            isNormal = false;
            msg = "이메일을 입력해주세요."
        } else if (!emailReg.test(email)) {
            isNormal = false;
            msg = "이메일 양식을 확인해주세요."
        } else if (!phone) {
            isNormal = false;
            msg = "전화번호를 입력해주세요."
        } else if (!phoneReg.test(phone)) {
            isNormal = false;
            msg = "전화번호 양식을 확인해주세요."
        } else {
            isNormal = true;
        }

        if (isNormal) {
            registAPI(id,name,password,email,phone)
            .then(res => {
                if (res.statusCode == 200) {
                    alert("가입이 완료 되었습니다!");
                    navigate("/Login",
                    { replace: true })
                }
                else
                    alert(`${res.message}`); })
        } else {
            alert(msg)
        }
    };


    return (
        <>
            <Helmet></Helmet>
            <Layout>
                <div className="loginContainer">
                    <form onSubmit={handleSubmit}>
                        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                            <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center font-bold'
                            >Sign In🔑</h1><br/>

                        <div className="mb-4">
                            <label
                                className="block text-grey-darker text-sm font-bold mb-2" for="id"
                            >UserId</label>
                            <input
                                type="text"
                                id="id" value={id} onChange={(e) => {handleId(e); idHandleChange(e);}}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                placeholder="아이디"
                                required=""
                            ></input>

                            {/* 유효성 검사 */}
                            {id != "" && idCheck && idCheck.code == 200 ?
                            <div className="p-4 mb-4 text-sm text-green-700 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                                <span className="font-medium">{idCheck.msg}</span>
                            </div>
                            :null}

                            {id != "" && idCheck && idCheck.code != 200 ?
                            <div className="p-4 mb-4 text-sm text-red-700 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                                <span className="font-medium">{idCheck.msg}</span>
                            </div>
                            :null}
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-grey-darker text-sm font-bold mb-2" for="name">이름</label>
                            <input
                                type="text"
                                id="name" value={name}
                                onChange={handleName}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                placeholder="닉네임"
                                required=""
                            ></input>
                        </div>

                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2" for="password">비밀번호</label>
                            <input
                                type="password"
                                id="password" value={password}
                                onChange={(e) => {handlePassword(e); pwHandleChange(e);}}
                                className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                                placeholder="비밀번호"
                                required=""
                            ></input>

                            {/* 유효성 검사 */}
                            {password != "" && pwCheck && pwCheck.code == 200 ?
                            <div className="p-4 mb-4 text-sm text-green-700 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                                <span className="font-medium">{pwCheck.msg}</span>
                            </div>
                            :null}

                            {password != "" && pwCheck && pwCheck.code != 200 ?
                            <div className="p-4 mb-4 text-sm text-red-700 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                                <span className="font-medium">{pwCheck.msg}</span>
                            </div>
                            :null}
                        </div>

                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2" for="passwordConfirm">비밀번호 확인</label>
                            <input
                                type="password"
                                id="passwordConfirm"
                                value={passwordConfirm} onChange={(e) => {handlePasswordConfirm(e); pwConfirmCheck(e);}}
                                className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                                placeholder="비밀번호 확인"
                                required=""></input>
                            { passwordConfirm == "" || pwConfirm ? null:
                                <div className="p-4 mb-4 text-sm text-red-700 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
                                    <span className="font-medium">비밀번호를 확인해주세요!</span>
                                </div>
                            }
                        </div>

                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2" for="email">이메일</label>
                            <input
                                type="email"
                                id="email" value={email} onChange={handleEmail}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                placeholder="이메일"
                                required=""
                            ></input>
                        </div>

                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2" for="phone">전화번호</label>
                            <input type="number"
                                id="phone" value={phone}
                                onChange={handlePhone}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                placeholder="전화번호" required=""
                            ></input>
                        </div>

                        <div className="agreeCheckbox">
                            <div className="accountCheckboxAgree">
                                <input
                                type="checkbox"
                                className="checkbox"
                                />
                                <span className="checkboxContent">
                                &nbsp;I agree to the
                                <span className="line">&nbsp; terms & conditions and privacy policy</span>
                                </span>
                            </div>
                        </div>
                        <br/>

                        <div class="flex items-center justify-between">
                            <button type="submit"
                                className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900"
                            >SignIn</button>
                        </div>

                        </div>
                    </form>
                </div>
            </Layout>
        </>
    )
}

export default Signin

export const postQuery = graphql`
    query($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
