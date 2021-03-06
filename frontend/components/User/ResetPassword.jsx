import React, { useState } from 'react';
import Router from 'next/router';
// import { useCookies } from 'react-cookie';
import { resetPWAPI } from '../../pages/api/user';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Swal from 'sweetalert2';
// import styled from '@emotion/styled';

export default function ResetPassword() {
  const [pwCheckRes, setPwCheckRes] = useState(null);
  const [pwSameRes, setPwSameRes] = useState(null);

  const [inputState, setInputState] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    showPassword: false,
    showPasswordConfirm: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const pwHandleChange = (e) => {
    const value = e.target.value; // 입력한 값
    setPwCheckRes(
      pwReg.test(value)
        ? { code: 200, msg: '사용 가능한 비밀번호입니다.' }
        : {
            code: 401,
            msg: '비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.',
          }
    );
  };

  const pwSameCheck = (e) => {
    const value = e.target.value;
    setPwSameRes(inputState.password == value ? true : false);
  };
  const pwSameOtherCheck = (e) => {
    const value = e.target.value;
    setPwSameRes(inputState.passwordConfirm == value ? true : false);
  };

  const handleClickShowPassword = () => {
    setInputState({
      ...inputState,
      showPassword: !inputState.showPassword,
    });
  };
  const handleClickShowPasswordConfirm = () => {
    setInputState({
      ...inputState,
      showPasswordConfirm: !inputState.showPasswordConfirm,
    });
  };

  const pwReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{8,16}$/;
  // 비밀번호 정규표현식 : 최소 8자, 최대 16자, 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = '';

    if (!inputState.password) {
      isNormal = false;
      msg = '비밀번호를 입력해주세요.';
    } else if (!pwReg.test(inputState.password)) {
      isNormal = false;
      msg = '비밀번호 양식을 확인해주세요.';
    } else if (inputState.password != inputState.passwordConfirm) {
      isNormal = false;
      msg = '비밀번호가 동일하지 않습니다.';
    }

    inputState.email = sessionStorage.getItem('email');
    if (isNormal) {
      Swal.fire({
        title: '비밀번호 변경 중입니다',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
          resetPWAPI(inputState).then((res) => {
            if (res.statusCode == 200) {
              if (sessionStorage.getItem('nickname') == null) {
                // 비밀번호를 잃어버려서 재설정하는 경우
                Swal.fire({
                  title: '비밀번호 변경에 성공했습니다',
                  text: '메인페이지로 이동합니다',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 500,
                }).then(() => {
                  sessionStorage.clear();
                  window.history.forward();
                  window.location.replace('/login');
                });
              } else {
                // 로그인한 사용자가 비밀번호를 재설정하는 경우
                Swal.fire({
                  title: '비밀번호 변경에 성공했습니다',
                  text: '마이페이지로 이동합니다',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 500,
                }).then(() => {
                  Router.push('/myinfo');
                });
              }
            } else {
              Swal.fire({
                icon: 'error',
                title: '비밀번호 변경 중 문제가 발생했습니다',
                text: '지속적으로 같은 문제 발생시 관리자에게 문의하세요',
                confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
              });
            }
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-xl cols-6">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: 'column' }}
        alignItems="center"
        // minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            새 비밀번호
          </Typography>
          <br />
          <OutlinedInput
            type="password"
            id="password"
            placeholder="8~16자리, 영문자, 숫자, 특수문자"
            value={inputState.password}
            onChange={(e) => {
              handleChange(e);
              pwHandleChange(e);
              pwSameOtherCheck(e);
            }}
            sx={{ width: 370, fontSize: 14 }}
            type={inputState.showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ mr: -0.5 }}
                >
                  {inputState.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {/* 1. 비밀번호 사용 가능 */}
          {inputState.password != '' && pwCheckRes && pwCheckRes.code == 200 ? (
            <div className="" role="alert">
              <span className="font-medium">최고의 비밀번호네요~^^</span>
            </div>
          ) : null}
          {/* 2. 사용 불가능 */}
          {inputState.password != '' && pwCheckRes && pwCheckRes.code != 200 ? (
            <div className="" role="alert">
              <span className="font-medium">{pwCheckRes.msg}</span>
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <Typography display="inline" sx={{ fontSize: 14 }}>
            새 비밀번호 확인
          </Typography>
          <br />
          <OutlinedInput
            type="password"
            id="passwordConfirm"
            value={inputState.passwordConfirm}
            onChange={(e) => {
              handleChange(e);
              pwSameCheck(e);
              pwHandleChange(e);
            }}
            sx={{ width: 370, fontSize: 14 }}
            type={inputState.showPasswordConfirm ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordConfirm}
                  edge="end"
                  sx={{ mr: -0.5 }}
                >
                  {inputState.showPasswordConfirm ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          {/* 비밀번호 동일 체크 */}
          {inputState.passwordConfirm == '' || pwSameRes ? null : (
            <div className="" role="alert">
              <span className="font-medium">비밀번호가 동일하지 않습니다.</span>
            </div>
          )}
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: 370, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
        >
          비밀번호 재설정
        </Button>
      </Box>
    </div>
  );
}
