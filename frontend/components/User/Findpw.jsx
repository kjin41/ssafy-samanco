import React, { useState, useEffect } from "react";
import {
  sendEmailPWCodeAPI,
  checkEmailPWAPI,
  resetPWAPI,
} from "../../pages/api/user";
import Link from "next/link";

import FormControl, { useFormControl } from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckEmailCode from "./CheckEmailCode";

export default function FindPassword() {
  // 비밀번호 재설정

  // 이메일 정규표현식
  const emailReg =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

  const [inputState, setInputState] = useState({
    // email: "",
    // code: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showPasswordConfirm: false,
  });

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [authFin, setAuthFin] = useState(false);
  const [showEmailAgainText, setShowEmailAgainText] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [sendEmailButton, setSendEmailButton] = useState(true);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const emailHandleChange = (e) => {
    setEmail(e.target.value);
  };

  const codeHandleChange = (e) => {
    setCode(e.target.value);
    // console.log(e)
    // const { id, value } = e.target;
    // setCode((prevState) => ({
    //   ...prevState,
    //   // [id]: value,
    //   code : e.target.innerText
    // }));
  };

  const sendEmailClick = (e) => {
    e.preventDefault();
    const value = email;

    if (!email) {
      alert("이메일을 입력해주세요.");
    } else if (!emailReg.test(email)) {
      alert("이메일 양식을 확인해 주세요.");
    } else {
      //   console.log(value);
      //   setCookie("emailAuth",  new Date().getTime()); // 쿠키 설정
      //   sendEmailCodeAPI(value).then((res) => {
      // setInputState.email(false);
      //   });
      setShowCodeInput(true);
      setAuthFin(true);
      setShowEmailAgainText(true);
      setSendEmailButton(false);
    }
  };

  const checkCodeClick = (e) => {
    e.preventDefault();
    const value = code;

    if (!code) {
      alert("인증번호를 입력해주세요.");
    } else {
      //   console.log(value);
      //   setCookie("emailAuth",  new Date().getTime()); // 쿠키 설정
      //   sendEmailCodeAPI(value).then((res) => {
      // setInputState.email(false);
      //   });
      console.log("인증번호 " + code);
      setAuthFin(true);
      // setSendEmailButton(false); // 인증완료로 바꿔야함
    }
  };

  const ShowCodeInputCheck = () => (
    <div>
      <label>인증번호 확인</label>
      <input
        type="text"
        id="code"
        value={code || ''}
        placeholder="인증번호"
        onChange={codeHandleChange}
        required=""
      ></input>
    </div>
  );

  const setSendEmailButtonWork = () => {
    setSendEmailButton(true);
    setShowEmailAgainText(false);
    setAuthFin(false);
    setShowCodeInput(false);
  };

  const ShowEmailAgain = () => (
    <div>
      <button onClick={setSendEmailButtonWork}>
        인증코드 재발급 / 이메일 변경
      </button>
    </div>
  );

  const handleClickShowPassword = () => {
    setInputState({
      ...inputState,
      showPassword: !inputState.showPassword,
    });
  };

  const handleClickShowPasswordConfirm = () => {
    setInputState({
      ...inputState,
      passwordConfirm: !inputState.passwordConfirm,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = "";

    if (!email) {
      isNormal = false;
      msg = "이메일을 입력해주세요.";
    } else if (!emailReg.test(inputState.email)) {
      isNormal = false;
      msg = "이메일 양식을 확인해 주세요.";
    }

    if (isNormal) {
      // 유효성 검사 통과 시 FindPassword API 요청
    }
  };

  return (
    <div>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: "column" }}
        alignItems="center"
        minHeight="70vh"
      >
        <h1>비밀번호 재설정</h1>
        <h4>가입하신 이메일 주소를 입력해주세요</h4>
        <br />
        <FormControl sx={{ width: 280 }}>
          <OutlinedInput
            id="email"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={emailHandleChange}
            disabled={authFin ? true : false}
          />
        </FormControl>
        <br />
        {showEmailAgainText ? <ShowEmailAgain /> : null}
        <br />
        {showCodeInput ? <CheckEmailCode />: null}
        <br />
        {sendEmailButton ? (
          <>
            <Button
              variant="contained"
              sx={{ width: 280 }}
              onClick={sendEmailClick}
            >
              이메일 보내기
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              sx={{ width: 280 }}
              onClick={checkCodeClick}
            >
              비밀번호 재설정하기
            </Button>
          </>
        )}
      </Box>
    </div>
  );
}
