import Layout from '../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';

import styled from '@emotion/styled';
import StackList from '../../components/Club/StackList';

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

import { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import * as studyActions from '../../store/module/study';
import {
  deleteAPI,
  updateStudyLike,
  joinStudyAPI,
  getStudyById,
  joinCancelStudy,
  getUserAtStudy,
  changeStudyHost,
  quitStudy,
  studyImageDownload,
} from '../api/study';
import { joinRoomAPI, getRoomById } from '../api/meeting';
import * as meetingActions from '../../store/module/meeting';

const StudyDetail = () => {
  const detail = useSelector(({ study }) => study.studyDetail);
  const roomDetail = useSelector(({ meeting }) => meeting.meetingDetail);
  const userData = useSelector(({ study }) => study.userList);
  const [reloadCondition, setReloadCondition] = useState(false);
  const [like, changeLike] = useState(detail.userLike);
  const [detailLikes, setLikes] = useState(detail.likes);
  let [imageUrl, setImageUrl] = useState(undefined);
  const [openPw, setOpenPw] = useState(false);

  const pwDialogOpen = () => {
    setOpenPw(true);
  };
  const pwDialogClose = () => {
    setOpenPw(false);
  };

  const dispatch = useDispatch();

  const setDetail = useCallback(
    ({ detail }) => {
      dispatch(meetingActions.setMeetingDetail({ detail }));
    },
    [dispatch]
  );

  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64); // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

  function createAndDownloadBlobFile(body, filename) {
    const blob = new Blob([body]);
    const fileName = `${filename}`;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const url = window.URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }

  function changeToBlob(file) {
    studyImageDownload(file).then((res) => {
      //console.log(res);
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        //console.log(res.data);
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      } else {
        // console.log('????????? ???????????? ????????????. ??????????????? ??????????????????.');
      }
    });
  }

  function fetchData(addHit) {
    getUserAtStudy({
      studyId: detail.id,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(studyActions.setUserList({ list: res.users }));
      })
      .catch((err) => console.log(err));

    getStudyById({
      studyId: detail.id,
      userId:
        sessionStorage.getItem('userId') == null
          ? 0
          : sessionStorage.getItem('userId'),
      addHit: addHit,
    }).then((res) => {
      changeLike(res.study?.userLike);
      dispatch(studyActions.setStudyDetail({ detail: res.study }));
    });
  }

  useEffect(() => {
    if (!detail.userLike) {
      // ????????? ???????????? ????????? ????????????
      if (like) {
        // ?????? ????????? ??? == ?????????
        setLikes(detail.likes + 1);
      } else {
        setLikes(detail.likes);
      }
    } else {
      // ????????? ???????????? ?????? ?????????
      if (like) {
        // ?????? ????????? ??? == ????????? ??????
        setLikes(detail.likes);
      } else {
        setLikes(detail.likes - 1);
      }
    }
  }, [like]);

  useEffect(() => {
    fetchData('0');
  }, []);

  useEffect(() => {
    if (detail && detail.file) changeToBlob(detail.file);
  }, [detail]);

  useEffect(() => {
    if (reloadCondition) {
      // fetchData();
      fetchData('0');
      setReloadCondition(false);
    }
  }, [reloadCondition]);

  const DetailWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  `;

  const ImageWrapper = styled.div`
    margin-right: 30px;
    margin-bottom: 10px;
    min-width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
  `;

  const CusSkeleton = styled(Skeleton)`
    min-width: 300px;
    min-height: 200px;
    height: auto;
    width: 100%;
  `;

  const CusContainer = styled(Container)`
    float: left;
  `;

  const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px;
    & > h2 {
      margin: 0;
    }
    & > div {
      height: fit-content;
    }
  `;

  const EndImage = styled.img`
    width: 100px;
    height: 100px;
    // margin-right: auto;
    // transform: translate(-90%, 10%);
    position: absolute;
  `;

  return (
    <Layout>
      <Head>
        <title>????????? ???????????? | ???????????????</title>
      </Head>
      <CusContainer maxWidth="md">
        <br></br>
        <DetailHeader>
          <h2>{detail.title}</h2>
          {sessionStorage.getItem('userId') == detail.hostId ? (
            <DetailOperation detail={detail} pwDialogOpen={pwDialogOpen} />
          ) : null}
        </DetailHeader>
        <DetailWrapper maxWidth="sm">
          {detail.collectStatus === 'ING' ? (
            <ImageWrapper>
              {imageUrl ? (
                <img src={imageUrl} height={200}></img>
              ) : (
                <CusSkeleton variant="rectangular" animation={false} />
              )}
            </ImageWrapper>
          ) : (
            <ImageWrapper>
              <EndImage src="/images/apply_end.png"></EndImage>
              {imageUrl ? (
                <img src={imageUrl} height={200}></img>
              ) : (
                <CusSkeleton variant="rectangular" animation={false} />
              )}
            </ImageWrapper>
          )}
          <StudyInfo detail={detail}></StudyInfo>
        </DetailWrapper>
        <StudyDetail></StudyDetail>
        <PwDialog
          open={openPw}
          pwDialogClose={pwDialogClose}
          room={roomDetail}
          setDetail={setDetail}
        ></PwDialog>
      </CusContainer>
    </Layout>
  );

  function DetailOperation({ detail, pwDialogOpen }) {
    const [openQuit, setOpenQuit] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);

    const QuitDialogOpen = () => {
      if (sessionStorage.getItem('userId')) setOpenQuit(true);
      else {
        // alert('???????????? ????????? ???????????????.');
        // Router.push('/login');
        Swal.fire({
          title: '???????????? ????????? ???????????????.',
          text: '????????? ???????????? ???????????????.',
          icon: 'warning',
          showConfirmButton: false,
          timer: 800,
        }).then(() => {
          Router.push('/login');
        });
      }
    };
    const QuitDialogClose = () => {
      setOpenQuit(false);
    };

    const UserDialogOpen = () => {
      setOpenUsers(true);
    };
    const UserDialogClose = () => {
      setOpenUsers(false);
    };

    const [hostAssign, setHostAssign] = useState(null);
    const [nextHost, setNextHost] = useState(null);

    const [inputValue, setInputValue] = useState({
      password: '', // ???????????? ?????? ???
      roomId: '',
      userId: sessionStorage.getItem('userId'),
    });

    return (
      <>
        <ButtonGroup variant="outlined">
          {sessionStorage.getItem('userId') == detail.hostId ? (
            <>
              {detail.canRegister ? (
                <Button
                  onClick={() => {
                    Router.push({
                      pathname: '/meeting/regist',
                      query: { tag: 'study' },
                    });
                  }}
                >
                  ??? ??????
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  Router.push('/study/update');
                }}
              >
                ??????
              </Button>
            </>
          ) : null}
          {sessionStorage.getItem('userId') != detail.hostId &&
          detail.canJoin &&
          detail.roomId != 0 ? (
            <Button
              onClick={() => {
                inputValue.roomId = detail.roomId;

                getRoomById(detail.roomId).then((res) => {
                  if (res.statusCode == 200) {
                    let roomData = res.room;

                    setDetail({
                      detail: roomData,
                    });

                    if (roomData.isSecret) {
                      // ???????????????
                      pwDialogOpen();
                    } else {
                      // ????????? ????????? ?????? ??????
                      Swal.fire({
                        title: '????????? ?????? ????????????',
                        showConfirmButton: false,
                        didOpen: () => {
                          Swal.showLoading();
                          joinRoomAPI(inputValue).then((res) => {
                            if (res.statusCode == 200) {
                              Swal.fire({
                                title: '????????? ???????????????',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 500,
                              });
                              Router.push('/meeting/' + detail.roomId);
                            } else {
                              // ??? ?????? ??????
                              // alert(`${res.message}`);
                              Swal.fire({
                                icon: 'error',
                                title: res.message,
                                confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                              });
                            }
                          });
                        },
                      });
                    }
                  } else {
                    // ??? ?????? ?????? ???
                    // alert(`${res.message}`);
                    Swal.fire({
                      icon: 'error',
                      title: res.message,
                      confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                    });
                  }
                });
              }}
            >
              ??? ??????
            </Button>
          ) : null}
          <Button onClick={QuitDialogOpen}>??????</Button>
        </ButtonGroup>

        <Dialog open={openUsers} onClose={UserDialogClose}>
          <DialogTitle>{'?????? ????????? ?????? ????????? ??????????????????.'}</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                name="newHost"
                onChange={(e) => {
                  e.persist();
                  setNextHost(e.target.value);
                }}
              >
                {userData && userData !== null
                  ? userData.map((user) => {
                      return user.id !== detail.hostId ? (
                        <FormControlLabel
                          value={user.id}
                          control={<Radio />}
                          label={user.nickname}
                        />
                      ) : null;
                    })
                  : null}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={UserDialogClose}>??????</Button>
            <Button
              onClick={() => {
                let newHostId = nextHost;
                Swal.fire({
                  title: '?????? ?????? ????????????',
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                    changeStudyHost({
                      studyId: detail.id,
                      oldHostId: detail.hostId,
                      newHostId: newHostId,
                    }).then((res) => {
                      if (res.statusCode == 200) {
                        alert('????????? ?????????????????????.');
                        quitStudy({
                          userId: detail.hostId,
                          studyId: detail.id,
                        });
                        Router.push('/study');
                      } else {
                        // alert(`${res.message}`);
                        Swal.fire({
                          icon: 'error',
                          title: res.message,
                          confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                        });
                      }
                      // ????????? ????????????
                      setReloadCondition(true);
                    });
                  },
                });
              }}
            >
              ??????
            </Button>
          </DialogActions>
        </Dialog>

        {/* ?????? ??????????????? */}
        <Dialog open={openQuit} onClose={QuitDialogClose}>
          <DialogTitle>{'???????????? ?????? ???????????????????'}</DialogTitle>
          <DialogContent>
            {
              // ????????? ?????? ?????? ?????????
              sessionStorage.getItem('userId') == detail.hostId ? (
                <DialogContentText>
                  ???????????? ??????????????? ?????? ????????? ?????? ??? ????????????.<br></br>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={hostAssign}
                      onChange={(e) => {
                        setHostAssign(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="quit"
                        control={<Radio />}
                        label="?????? ?????? ?????????"
                      />
                      <FormControlLabel
                        value="delete"
                        control={<Radio />}
                        label="????????? ??????"
                      />
                    </RadioGroup>
                  </FormControl>
                </DialogContentText>
              ) : null
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={QuitDialogClose}>??????</Button>
            <Button
              onClick={() => {
                QuitDialogClose();

                if (sessionStorage.getItem('userId') == detail.hostId) {
                  if (hostAssign === null) {
                    // alert('????????? ?????? ?????? ?????? ?????? ???????????? ??????????????????.');
                    Swal.fire({
                      icon: 'warning',
                      title:
                        '????????? ?????? ?????? ?????? ?????? ???????????? ??????????????????.',
                      confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                    });
                  }
                  if (hostAssign === 'quit') {
                    if (userData.length == 1) {
                      // alert('????????? ???????????? ????????????.');
                      Swal.fire({
                        icon: 'error',
                        title: '????????? ???????????? ????????????.',
                        confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                      });
                    } else UserDialogOpen();
                    // ?????? ?????? ?????????
                  } else if (hostAssign === 'delete') {
                    Swal.fire({
                      title: '????????? ?????? ????????????',
                      showConfirmButton: false,
                      didOpen: () => {
                        Swal.showLoading();

                        deleteAPI({
                          id: detail.id,
                          hostId: sessionStorage.getItem('userId'),
                        }).then((res) => {
                          if (res.statusCode === 200) {
                            // alert('???????????? ?????? ???????????????.');
                            Swal.fire({
                              title: '???????????? ?????? ???????????????.',
                              text: '????????? ???????????? ???????????????',
                              icon: 'success',
                              showConfirmButton: false,
                              timer: 500,
                            });
                            Router.push('/study');
                          } else {
                            // alert(`${res.message}`);
                            Swal.fire({
                              icon: 'error',
                              title: res.message,
                              confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                            });
                          }
                        });
                      },
                    });
                    // ???????????? ??????
                  }
                } else {
                  // ????????? ?????? ???
                  Swal.fire({
                    title: '????????? ?????? ????????????',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();
                      quitStudy({
                        userId: sessionStorage.getItem('userId'),
                        studyId: detail.id,
                      }).then((res) => {
                        if (res.statusCode === 200) {
                          // alert('???????????? ?????? ???????????????.');
                          Swal.fire({
                            title: '????????? ?????????????????????',
                            text: '????????? ???????????? ???????????????',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 500,
                          });
                          Router.push('/study');
                        } else {
                          // alert(`${res.message}`);
                          Swal.fire({
                            icon: 'error',
                            title: res.message,
                            confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                          });
                        }
                      });
                    },
                  });
                }
              }}
              autoFocus
            >
              ??????
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  function StudyInfo() {
    return (
      <ContentWrapper>
        <div>????????? ?????? (??????)</div>
        <StackList stackData={detail.stacks}></StackList>
        <br />
      </ContentWrapper>
    );
  }

  function StudyDetail() {
    const CusCard = styled(Card)`
      margin-top: 10px;
    `;

    return (
      <CusCard sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 16 }} variant="body1">
            {detail.description.split('\n').map((line, index) => {
              return (
                <span key={index}>
                  {line}
                  <br />
                </span>
              );
            })}
          </Typography>
          <br />
          <Divider light />
          <br />
          <DetailFooter detail={detail}></DetailFooter>
        </CardContent>
        <DetailAction detail={detail}></DetailAction>
      </CusCard>
    );
  }

  function DetailFooter(props) {
    const FooterWrapper = styled.div`
      display: flex;
      flex-direction: row;
      & > div {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin: 10px;
      }
    `;
    let detail = props.detail;

    return (
      <FooterWrapper>
        <div>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            ?????? ?????????
          </Typography>

          <Typography sx={{ mb: 1.5 }}>{detail.schedule}</Typography>
        </div>
      </FooterWrapper>
    );
  }

  function DetailAction(props) {
    let detail = props.detail;
    const ActionWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20px;
      & > div,
      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;
      }

      & span {
        margin: 0px 5px;
      }
    `;
    const [open, setOpen] = useState(false);
    const [joinCancel, setJoinCalcel] = useState(false);

    const JoinDialogOpen = () => {
      if (sessionStorage.getItem('userId')) setOpen(true);
      else {
        // alert('???????????? ????????? ???????????????.');
        // Router.push('/login');
        Swal.fire({
          title: '???????????? ????????? ???????????????.',
          text: '????????? ???????????? ???????????????.',
          icon: 'warning',
          showConfirmButton: false,
          timer: 800,
        }).then(() => {
          Router.push('/login');
        });
      }
    };
    const JoinDialogClose = () => {
      setOpen(false);
    };

    const JoinCancelDialogOpen = () => {
      setJoinCalcel(true);
    };
    const JoinCancelDialogClose = () => {
      setJoinCalcel(false);
    };

    return (
      <ActionWrapper>
        <ButtonGroup variant="outlined" aria-label="text button group">
          <Button style={{ pointerEvents: 'none' }}>
            <VisibilityIcon />
            <span>{detail.hit}</span>
          </Button>
          <Button
            onClick={() => {
              if (sessionStorage.getItem('userId')) {
                changeLike(!like);
                updateStudyLike({
                  tag: 'STUDY',
                  studyId: detail.id, // ????????? ?????????
                  userId: sessionStorage.getItem('userId'),
                }).then((res) => console.log(res));
              } else {
                // alert('???????????? ????????? ???????????????.');
                // Router.push('/login');
                Swal.fire({
                  title: '???????????? ????????? ???????????????.',
                  text: '????????? ???????????? ???????????????.',
                  icon: 'warning',
                  showConfirmButton: false,
                  timer: 800,
                }).then(() => {
                  Router.push('/login');
                });
              }
            }}
            variant={like ? 'contained' : 'outlined'}
          >
            {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            {/* <span>{detail.likes}</span> */}
            <span>{detailLikes}</span>
          </Button>
        </ButtonGroup>
        <>
          <div>
            {
              // ??? ????????? ?????? === ?????? ????????? ??? ?????? => ????????? ??????
              sessionStorage.getItem('userId') == detail.hostId ? (
                <Button
                  variant="outlined"
                  onClick={() => {
                    Router.push('/study/applylist');
                  }}
                >
                  ????????? ?????? ??????
                </Button>
              ) : null
            }
            {
              // ????????? ??????, ????????? ????????????, ????????? ???????????? ???????????? ?????? ??????
              (detail.collectStatus === 'ING' &&
                detail.studyJoinStatus == null) ||
              detail.studyJoinStatus == 'CANCEL' ? (
                <Button variant="outlined" onClick={JoinDialogOpen}>
                  ????????????
                </Button>
              ) : null
            }
            {
              // ????????? ???????????? ?????? ?????? ??????
              detail.collectStatus === 'ING' &&
              detail.studyJoinStatus == 'BEFORE' ? (
                <Button variant="outlined" onClick={JoinCancelDialogOpen}>
                  ????????????
                </Button>
              ) : null
            }
          </div>
          <Dialog open={open} onClose={JoinDialogClose}>
            <DialogTitle>{'?????? ???????????????????'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ?????????????????? ????????? ????????? ???????????????.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={JoinDialogClose}>??????</Button>
              <Button
                onClick={() => {
                  JoinDialogClose();

                  Swal.fire({
                    title: '????????? ?????? ?????? ????????????',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      joinStudyAPI({
                        studyId: detail.id,
                        userId: sessionStorage.getItem('userId'),
                      })
                        .then((res) => {
                          if (res.statusCode === 200) {
                            // alert('????????? ?????? ????????? ???????????????.');
                            Swal.fire({
                              title: '????????? ?????? ????????? ???????????????.',
                              icon: 'success',
                              showConfirmButton: false,
                              timer: 600,
                            });
                          } else {
                            // alert(`${res.message}`);
                            Swal.fire({
                              icon: 'error',
                              title: res.message,
                              confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                            });
                          }
                        })
                        .catch((err) => console.log(err));
                      setReloadCondition(true);
                    },
                  });
                }}
                autoFocus
              >
                ??????
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={joinCancel} onClose={JoinCancelDialogClose}>
            <DialogTitle>{'?????? ?????? ???????????????????'}</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
              <Button onClick={JoinCancelDialogClose}>?????????</Button>
              <Button
                onClick={() => {
                  JoinCancelDialogClose();
                  Swal.fire({
                    title: '????????? ?????? ?????? ????????????',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      joinCancelStudy({
                        studyId: detail.id,
                        userId: sessionStorage.getItem('userId'),
                      })
                        .then((res) => {
                          if (res.statusCode === 200) {
                            // alert('????????? ?????? ????????? ???????????????.');
                            Swal.fire({
                              title: '????????? ?????? ????????? ???????????????.',
                              icon: 'success',
                              showConfirmButton: false,
                              timer: 600,
                            });
                          } else {
                            // alert(`${res.message}`);
                            Swal.fire({
                              icon: 'error',
                              title: res.message,
                              confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                            });
                          }
                        })
                        .catch((err) => console.log(err));
                      setReloadCondition(true);
                    },
                  });
                }}
                autoFocus
              >
                ???
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </ActionWrapper>
    );
  }
};

function PwDialog(props) {
  let { open, pwDialogClose, room } = props;
  let [pw, setPw] = useState('');

  const [inputValue, setInputValue] = useState({
    roomId: '',
    userId: sessionStorage.getItem('userId'),
    password: '',
  });

  const pwChangeHandle = (e) => {
    setPw(e.target.value);
  };

  return (
    <Dialog open={open} onClose={pwDialogClose}>
      <DialogTitle>{`??????????????? ??????????????????.`}</DialogTitle>
      <DialogContent>
        <TextField value={pw} onChange={pwChangeHandle}></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={pwDialogClose}>??????</Button>
        <Button
          onClick={
            // ????????? ??????????????? ???????????? ??????
            pw === room.password
              ? () => {
                  inputValue.password = pw;
                  inputValue.roomId = room.roomId;
                  Swal.fire({
                    title: '???????????? ?????? ????????????',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      joinRoomAPI(inputValue).then((res) => {
                        if (res.statusCode == 200) {
                          Swal.fire({
                            title: '?????? ????????? ???????????????',
                            icon: 'success',
                            confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                          }).then(() => {
                            Router.push('/meeting/' + room.roomId);
                            pwDialogClose();
                          });
                        } else {
                          // alert(`${res.message}`);
                          Swal.fire({
                            icon: 'error',
                            title: res.message,
                            confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                          });
                        }
                      });
                    },
                  });
                }
              : () => {
                  // alert('??????????????? ??????????????????.');
                  pwDialogClose();
                  Swal.fire({
                    icon: 'error',
                    title: '??????????????? ??????????????????.',
                    confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                  });
                }
          }
          autoFocus
        >
          ??????
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudyDetail;
