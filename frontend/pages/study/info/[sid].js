import styled from '@emotion/styled';
import Layout from '../../../components/Layout';
import StackList from '../../../components/Club/StackList';
import UserCard from '../../../components/Common/UserCard';

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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

import {
  deleteAPI,
  getUserAtStudy,
  changeStudyHost,
  getStudyByUserId,
  quitStudy,
  studyImageDownload,
  getStudyById,
} from '../../api/study';
import * as studyActions from '../../../store/module/study';
import { joinRoomAPI, getRoomById } from '../../api/meeting';
import * as meetingActions from '../../../store/module/meeting';

import Router, { useRouter } from 'next/router';
import Head from 'next/head';

function StudyInfo() {
  let clubData = useSelector(({ study }) => study.studyDetail);
  let userData = useSelector(({ study }) => study.userList);
  const roomDetail = useSelector(({ meeting }) => meeting.meetingDetail);
  const [reloadCondition, setReloadCondition] = useState(false);
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

  const setStudyDetail = useCallback(
    ({ studyDetail }) => {
      dispatch(studyActions.setStudyDetail({ studyDetail: res.study }));
    },
    [dispatch]
  );

  let { sid } = useRouter().query;

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
      if (res.data && res.data.statusCode === 200 && res.data.fileString) {
        const arrayBuffer = base64ToArrayBuffer(res.data.fileString);
        createAndDownloadBlobFile(arrayBuffer, file.originFile);
      } else {
        // console.log('????????? ???????????? ????????????. ??????????????? ??????????????????.');
      }
    });
  }

  function fetchData() {
    getUserAtStudy({
      studyId: sid,
      userId: sessionStorage.getItem('userId'),
    })
      .then((res) => {
        dispatch(studyActions.setUserList({ list: res.users }));
      })
      .catch((err) => console.log(err));

    getStudyById({
      studyId: sid,
      userId: sessionStorage.getItem('userId'),
    }).then((res) => {
      dispatch(
        studyActions.setStudyDetail({
          detail: res.study,
        })
      );
    });
  }

  useLayoutEffect(() => {
    fetchData();
  }, [sid]);

  useEffect(() => {
    if (clubData && clubData.file) changeToBlob(clubData.file);
  }, [clubData]);

  useEffect(() => {
    if (reloadCondition) {
      fetchData();
      setReloadCondition(false);
    }
  }, [reloadCondition]);

  const CusContainer = styled(Container)`
    float: left;
    margin-bottom: 50px;
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 30px;
    flex: 1;
  `;

  const DetailWrapper = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const ImageWrapper = styled.div`
    margin-right: 30px;
    margin-bottom: 10px;
    min-width: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const CusSkeleton = styled(Skeleton)`
    display: flex;
    flex: 1;
    min-width: 200px;
    min-height: 200px;
    height: auto;
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
      <CusContainer maxWidth="md">
        <Head>
          <title>??? ????????? | ???????????????</title>
        </Head>
        <br></br>
        {clubData ? (
          <>
            <DetailHeader>
              <DetailOperation
                detail={clubData}
                imageUrl={imageUrl}
                dispatch={dispatch}
                pwDialogOpen={pwDialogOpen}
              ></DetailOperation>
            </DetailHeader>
            <h2>{clubData.title}</h2>
            <DetailWrapper maxWidth="sm">
              {clubData.collectStatus === 'ING' ? (
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
              <StudyInfo detail={clubData}></StudyInfo>
            </DetailWrapper>
            <StudyDetail></StudyDetail>
            <PwDialog
              open={openPw}
              pwDialogClose={pwDialogClose}
              room={roomDetail}
              setDetail={setDetail}
            ></PwDialog>
          </>
        ) : null}
      </CusContainer>
    </Layout>
  );

  function DetailOperation({ detail, imageUrl, dispatch, pwDialogOpen }) {
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

    // console.log(detail);

    return (
      <>
        {sessionStorage.getItem('userId') == detail.hostId ? (
          <Button
            variant="outlined"
            onClick={() => {
              Router.push('/study/applylist');
            }}
          >
            ????????? ?????? ??????
          </Button>
        ) : (
          <div></div>
        )}
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
                  dispatch(
                    studyActions.setStudyDetail({
                      detail: { ...detail, imageUrl: imageUrl },
                    })
                  );
                }}
              >
                ??????
              </Button>
            </>
          ) : null}
          {sessionStorage.getItem('userId') != detail.hostId &&
          detail.canJoin ? (
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
                      return user.id !== clubData.hostId ? (
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
                UserDialogClose();
                let newHostId = nextHost;
                Swal.fire({
                  title: '?????? ?????? ????????????',
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                    changeStudyHost({
                      studyId: clubData.id,
                      oldHostId: clubData.hostId,
                      newHostId: newHostId,
                    }).then((res) => {
                      if (res.statusCode == 200) {
                        // alert('????????? ?????????????????????.');
                        Swal.fire({
                          title: '????????? ?????????????????????.',
                          text: '????????? ???????????? ???????????????',
                          icon: 'success',
                          showConfirmButton: false,
                          timer: 800,
                        }).then(() => {
                          quitStudy({
                            userId: clubData.hostId,
                            studyId: clubData.id,
                          });
                          Router.push('/study');
                        });
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
                    // ------- ?????? ?????? ????????? ??????
                    if (userData.length == 1) {
                      // alert('????????? ???????????? ????????????.');
                      Swal.fire({
                        icon: 'error',
                        title: '????????? ???????????? ????????????.',
                        confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
                      });
                    } else UserDialogOpen();
                    // ?????? ?????? ????????? ???????????????
                  } else if (hostAssign === 'delete') {
                    Swal.fire({
                      title: '????????? ?????? ????????????',
                      showConfirmButton: false,
                      didOpen: () => {
                        Swal.showLoading();
                        deleteAPI({
                          id: sid,
                          hostId: sessionStorage.getItem('userId'),
                        }).then((res) => {
                          if (res.statusCode === 200) {
                            // alert('???????????? ?????? ???????????????.');
                            Swal.fire({
                              title: '???????????? ?????? ???????????????.',
                              text: '????????? ???????????? ???????????????',
                              icon: 'success',
                              showConfirmButton: false,
                              timer: 800,
                            }).then(() => {
                              Router.push('/study');
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
                        studyId: clubData.id,
                      }).then((res) => {
                        if (res.statusCode === 200) {
                          // alert('???????????? ?????? ???????????????.');
                          Swal.fire({
                            title: '???????????? ?????? ???????????????.',
                            text: '????????? ???????????? ???????????????',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                          }).then(() => {
                            Router.push('/study');
                          });
                          // Router.push('/study');
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
    const DateWrapper = styled.div`
      display: flex;
      flex-direction: row;
      & > div {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    `;

    const RowWrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      & > div {
        padding-bottom: 20px;
      }
    `;

    return (
      <ContentWrapper>
        <div>????????? ?????? (??????)</div>
        <StackList stackData={clubData.stacks}></StackList>
        <br />
        <RowWrapper>
          <DateWrapper>
            <div>
              <div>?????? ?????????</div>
              <Typography>{clubData.schedule}</Typography>
            </div>
          </DateWrapper>
        </RowWrapper>
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
            {clubData.description && clubData.description.includes('\n') ? (
              clubData.description.split('\n').map((line, index) => {
                return (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                );
              })
            ) : (
              <span>{clubData.description}</span>
            )}
          </Typography>
          <br />
          <Divider light />
          <br />
          <StudyUser detail={clubData}></StudyUser>
          <br />
        </CardContent>
      </CusCard>
    );

    function StudyUser({ detail }) {
      const UserWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;

        & > div {
          display: flex;
          flex-direction: column;
          margin: 10px;
        }
        & .no-user {
          font-size: 14px;
        }
        & .fill {
          display: flex;
          flex: 1;
        }
      `;

      const FollowerWrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      `;

      return (
        <UserWrapper>
          <div style={{ width: 'fit-content' }}>
            <div>??????</div>
            <div>
              {!userData || userData == null ? (
                <div className="no-user">?????? ????????? ????????? ???.???</div>
              ) : (
                userData.map((user) => {
                  return user.id == clubData.hostId ? (
                    <UserCard
                      key={user.id}
                      user={user}
                      from="study"
                      setReloadCondition={setReloadCondition}
                    ></UserCard>
                  ) : null;
                })
              )}
            </div>
          </div>
          <div>
            <div>??????</div>
            <FollowerWrapper>
              {!userData || userData == null ? (
                <div className="no-user">?????? ????????? ????????? ???.???</div>
              ) : (
                userData.map((user) => {
                  return user.id != clubData.hostId ? (
                    <UserCard
                      key={user.id}
                      user={user}
                      clubId={clubData.id}
                      hostId={clubData.hostId}
                      from="study"
                      setReloadCondition={setReloadCondition}
                    ></UserCard>
                  ) : null;
                })
              )}
            </FollowerWrapper>
          </div>
        </UserWrapper>
      );
    }
  }
}

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
                          Router.push('/meeting/' + room.roomId);
                          pwDialogClose();
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

export default StudyInfo;
