import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import Link from 'next/link';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';

import {
  getUserLoginTokenAPI,
  loginAPI,
  getUserInfoAPI,
} from '../../pages/api/user';
import { useCookies } from 'react-cookie';
import * as userActions from '../../store/module/user';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';

const LinkButton = styled(Typography)`
  variant="h6"
  display="inline"
  gutterBottom
  sx={{ width: 300, fontSize: 13.5, mr: 2 }}
`;
const LinkWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 200px;
  justify-content: space-evenly;
`;

export default function LoginPage() {
  const cookie = new Cookies();

  const dispatch = useDispatch();
  const userLoginInfo = useSelector(({ user }) => user.loginInfo);

  useEffect(() => {
    document.title = '로그인 | 싸피사만코';

    // if(userLoginInfo.isLogin==true) {
    //   Swal.fire({
    //     title: '로그인된 상태입니다',
    //     icon: 'warning',
    //     showConfirmButton: false,
    //   });
    //   Router.push('/');
    // }
    if (
      cookie.get('userToken') != null &&
      cookie.get('userToken') != '' &&
      sessionStorage.getItem('nickname') != null &&
      sessionStorage.getItem('nickname') != 'undefined'
    ) {
      Swal.fire({
        title: '로그인된 상태입니다',
        icon: 'warning',
        showConfirmButton: false,
      });
      Router.push('/');
    }
  }, []);

  const [inputState, setInputState] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [cookies, setCookie] = useCookies(['userToken', 'userEmail']);
  const [rememberId, setRememberId] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (cookies.userEmail !== '') {
      setInputState({
        email: cookies.userEmail,
      });
      setRememberId(true);
    } else {
      setRememberId(false);
    }
  }, []);

  const handleRememberIdCheck = (e) => {
    setRememberId(e.target.checked);
  };

  const handleClickShowPassword = () => {
    setInputState({
      ...inputState,
      showPassword: !inputState.showPassword,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isNormal = true;
    let msg = '';

    if (!inputState.email) {
      isNormal = false;
      msg = '이메일을 입력해주세요.';
    } else if (!inputState.password) {
      isNormal = false;
      msg = '비밀번호를 입력해주세요.';
    }

    if (isNormal) {
      // 유효성 검사 통과 시 login API 요청
      loginAPI(inputState).then((res) => {
        switch (res.statusCode) {
          case 200: // 로그인 성공
            setCookie('userToken', res.accessToken); // 쿠키 설정
            if (res.accessToken != null && res.accessToken != '') {
              getUserLoginTokenAPI(res.accessToken).then((res1) => {
                sessionStorage.setItem('userId', res1.userId);
                sessionStorage.setItem('email', inputState.email);
                sessionStorage.setItem('nickname', res1.nickname);

                const userLoginInfo = {
                  nickname: res1.nickname,
                  isLogin: true,
                };
                dispatch(
                  userActions.setLoginInfo({ loginInfo: userLoginInfo })
                );

                getUserInfoAPI(res1.userId).then((res) => {
                  dispatch(userActions.setUserDetail({ detail: res.user }));
                });

                if (rememberId) {
                  setCookie('userEmail', inputState.email);
                } else {
                  setCookie('userEmail', '');
                }
                if (sessionStorage.getItem('nickname') == res1.nickname) {
                  Swal.fire({
                    title: '로그인에 성공했습니다',
                    text: '메인페이지로 이동합니다',
                    icon: 'success',
                    showConfirmButton: false,
                  });
                  window.history.forward();
                  window.location.replace('/');
                }
              });
            }
            break;
          // case 401: // 비밀번호 틀림
          //   alert('비밀번호를 확인해주세요.');
          //   break;
          // case 404: // 유저 정보 X
          //   alert('회원 정보가 존재하지 않습니다.');
          //   break;
          default:
            Swal.fire({
              icon: 'error',
              title: '로그인 중 문제가 발생했습니다',
              text: '지속적으로 같은 문제 발생시 관리자에게 문의하세요',
              confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
            });
            break;
        }
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
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop={8}
        sx={{ flexDirection: 'column' }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          alignItems="center"
          onSubmit={handleSubmit}
          sx={{ flexDirection: 'column' }}
        >
          <h1>로그인</h1>
          <FormControl sx={{ width: 300 }}>
            <OutlinedInput
              id="email"
              placeholder="이메일"
              value={inputState.email || ''}
              onChange={handleChange}
              sx={{ fontSize: 14 }}
            />
          </FormControl>
          <FormControl sx={{ width: 300 }}>
            <OutlinedInput
              id="password"
              placeholder="비밀번호"
              type={inputState.showPassword ? 'text' : 'password'}
              value={inputState.password || ''}
              onChange={handleChange}
              sx={{ fontSize: 14 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ mr: -0.5 }}
                  >
                    {inputState.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              onChange={handleRememberIdCheck}
              checked={rememberId}
              sx={{ width: 260, mt: 1, font: 20 }}
              label="아이디 저장하기"
            />
          </FormGroup>
          <Button
            type="submit"
            variant="contained"
            sx={{ width: 300, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
          >
            로그인
          </Button>
        </Box>
        <LinkWrapper>
          <LinkButton>
            <Link href="/user/password">비밀번호 재설정</Link>
          </LinkButton>
          <LinkButton>
            <Link href="/regist">회원가입</Link>
          </LinkButton>
        </LinkWrapper>
      </Box>
    </>
  );
}
