import '../styles/app.css';
import '../styles/globals.css';
import { wrapper, persistedReducer } from '../store';
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector, useDispatch } from 'react-redux';

// import { Container } from "next/app";
import NavItem from './menu/NavItem';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Swal from 'sweetalert2';

import Cookies from 'universal-cookie';
import { useCookies } from 'react-cookie';
import { getUserLoginTokenAPI } from '../pages/api/user';
import Layout from '../components/Layout';

import styled from '@emotion/styled';

const styles = {
  layout: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  header: {
    color: 'white',
    backgroundColor: '#A2C2DC',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px',
  },
  headerContent: {
    textAlign: 'center',
  },
  headerLink: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    marginRight: '10px',
    color: 'black',
    fontSize: '14px',
    padding: '5px',
  },
  main: {
    flex: 1,
    minHeight: '100vh',
  },
  footer: {
    color: 'white',
    backgroundColor: '#A2C2DC',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '70px',
    padding: '10px 10px 13px 10px',
  },
  links: {
    cursor: 'pointer',
  },
};
const ImgMacha = styled.img`
  max-width: 80px;
  max-height: 25px;
`;
const ImgLogo = styled.img`
  max-height: 30px;
  cursor: pointer;
`;

const NAV_LINK_LIST = [
  {
    id: 1,
    linkUrl: '/myinfo',
    linkText: '???????????????',
  },
  {
    id: 2,
    linkUrl: '/myinfo/project',
    linkText: '??? ????????????',
  },
  {
    id: 3,
    linkUrl: '/myinfo/study',
    linkText: '??? ?????????',
  },
  {
    id: 4,
    linkUrl: '/myinfo/board',
    linkText: '??? ?????????',
  },
];

function MyApp({ Component, pageProps }) {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState(null);

  // const userLoginInfo = useSelector(({ user }) => user.loginInfo);

  const cookies = new Cookies();

  useEffect(() => {
    const HOST = process.env.NEXT_PUBLIC_ENV_HOST;
    const PORT = process.env.NEXT_PUBLIC_ENV_PORT;

    // if (userLoginInfo.isLogin == true) {
    //   console.log('???????????????');
    // }

    // console.log('[HOST]:', HOST, '| [PORT]:', PORT);

    const userNickname = sessionStorage.getItem('nickname');
    const token = cookies.get('userToken');
    if (
      token !== null &&
      token !== '' &&
      userNickname !== null &&
      userNickname !== 'undefined'
    ) {
      // console.log(token);
      setIsLogin(true);
      setNickname(userNickname);
    }
    // else if (token != null && token != '' && userNickname == null) {
    //   getUserLoginTokenAPI(token).then((res) => {
    //     sessionStorage.setItem('userId', res.userId);
    //     sessionStorage.setItem('email', res.email);
    //     sessionStorage.setItem('nickname', res.nickname);
    //     setIsLogin(true);
    //     setNickname(userNickname);
    //   });
    // }
  }, [isLogin, nickname]);

  return (
    // PersistGate : state??? ????????? ??? ???????????? ????????? ????????? ??? ????????????????????? UI??? ??????????????? ?????? ????????????
    <PersistGate
      persistor={persistor}
      loading={
        <Layout>
          <div>loading...</div>
        </Layout>
      }
    >
      {(pageProps && pageProps.pathname) === '/meeting/[id]' ? (
        <>
          <Head>
            <title>???????????????</title>
            <meta name="???????????????" content="SSAFY ??????????????? ?????? ????????????!" />
          </Head>

          <div style={styles.layout}>
            <main style={{ backgroundColor: 'gray' }}>
              <Component {...pageProps} />
            </main>
            {/* pageProps.pathname === '/meeting/[id]' ??? ?????? Layout ?????? ????????? */}
          </div>
        </>
      ) : (
        <>
          <Head>
            <title>???????????????</title>
            <meta name="???????????????" content="SSAFY ??????????????? ?????? ????????????!" />
          </Head>
          <div style={styles.layout}>
            <header style={styles.header}>
              <HeaderLink isLogin={isLogin} userId={userId} />
            </header>
            <main style={styles.main}>
              <Component {...pageProps} />
            </main>
            <footer style={styles.footer}>
              <Link href="/developer">
                <ImgMacha style={styles.links} src="/images/pojangmacha.png" />
              </Link>
              {/* <a href="https://lab.ssafy.com/s06-webmobile1-sub2/S06P12A502">
                <ImgMacha src="/images/pojangmacha.png"></ImgMacha>
              </a> */}
              {/* footer */}
            </footer>
          </div>
        </>
      )}
    </PersistGate>
  );

  function HeaderLink(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const UserSpan = styled.button`
      color: black;
      margin-right: 5px;
      background-color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 15px;
    `;

    const UserMenu = () => (
      <>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ marginTop: '8px' }}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {NAV_LINK_LIST.map(
            (
              item // ????????? ??????
            ) => (
              <NavItem
                key={item.id}
                linkUrl={item.linkUrl}
                linkText={item.linkText}
                onClose={handleClose}
              />
            )
          )}

          <MenuItem
            onClick={(e) => {
              sessionStorage.clear();
              cookies.set('userToken', '', -1);
              cookies.remove('userToken', { path: '/myinfo' });
              cookies.remove('userToken', { path: '/' });
              cookies.remove('userToken');
              setIsLogin(false);
              setUserId(null);
              Swal.fire({
                title: '???????????? ???????????????',
                text: '?????????????????? ???????????????',
                icon: 'success',
                showConfirmButton: false,
              });
              window.location.replace('/');
              handleClose();
            }}
          >
            <span className="site-nav-item" style={styles.link}>
              ????????????
            </span>
          </MenuItem>
        </Menu>
      </>
    );

    return (
      <div style={styles.headerLink}>
        <Link href="/" passHref>
          {/* <img src="/images/main-logo-black.png" height="30px"></img> */}
          <ImgLogo src="/images/main-logo-black.png" />
        </Link>
        <div>
          {props.isLogin ? (
            <>
              <span
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <UserSpan>{nickname}???, ???????????????</UserSpan>
              </span>
              <UserMenu />
            </>
          ) : (
            <>
              <span className="site-nav-item" style={styles.link}>
                <Link href="/login">?????????</Link>
              </span>
              <span className="site-nav-item" style={styles.link}>
                <Link href="/regist">????????????</Link>
              </span>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default wrapper.withRedux(MyApp);
