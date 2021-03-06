import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';

import styled from '@emotion/styled';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

import { getRoomAllAPI } from '../../pages/api/meeting';
import Router from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import * as meetingActions from '../../store/module/meeting';
import { joinRoomAPI } from '../../pages/api/meeting';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';

var _ = require('lodash');

function ItemList() {
  //-------------- redux dispatch로 값 저장, selector로 불러오기
  let meetingData = useSelector(({ meeting }) => meeting.meetingList);
  let filterData = useSelector(({ meeting }) => meeting.meetingFilterList);

  const dispatch = useDispatch();

  const setDetail = useCallback(
    ({ detail }) => {
      dispatch(meetingActions.setMeetingDetail({ detail }));
    },
    [dispatch]
  );

  const setList = useCallback(
    ({ list }) => {
      dispatch(meetingActions.setMeetingList({ list }));
    },
    [dispatch]
  );

  // 페이지네이션 페이지
  const [page, setPage] = useState(1);

  // 미디어 쿼리에 따라 화면에 보여지는 그리드 수 변경
  const theme = useTheme();

  const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
  const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
  const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));

  let purPage = useRef(1);
  let allPage = parseInt(meetingData.length / purPage.current);
  if (meetingData.length % purPage.current > 0) allPage += 1;

  if (lgMatches) {
    purPage.current = 8;
  } else if (mdMatches) {
    purPage.current = 6;
  } else if (smMatches) {
    purPage.current = 4;
  } else if (xsMaches) {
    purPage.current = 2;
  }

  // 화면에 요소를 그리기 전에 store에 저장된 아이템 리스트가 있는지 확인
  // 없으면 store에 저장
  useLayoutEffect(() => {
    getRoomAllAPI().then((res) => {
      if (res.rooms) setList({ list: res.rooms });
      else setList({ list: [] });
    });
  }, []);

  const handleChange = (index, value) => {
    setPage(value);
  };

  const CusPagination = styled(Pagination)`
    margin-top: 20px;
  `;

  const CusGrid = styled(Grid)`
    min-height: 530px;
  `;

  const CusCard = styled(Card)`
    width: 100%;
    padding: 10px;
  `;

  const [openJoin, setOpenJoin] = useState(false);
  const [openPw, setOpenPw] = useState(false);
  const [room, setRoom] = useState({});

  const joinDialogOpen = () => {
    setOpenJoin(true);
  };
  const joinDialogClose = () => {
    setOpenJoin(false);
  };
  const pwDialogOpen = () => {
    setOpenPw(true);
  };
  const pwDialogClose = () => {
    setOpenPw(false);
  };

  return (
    <>
      {!meetingData || meetingData.length == 0 ? (
        <CusGrid>
          <CusCard>등록된 미팅룸이 없습니다.</CusCard>
        </CusGrid>
      ) : (
        <CusGrid
          container
          maxWidth="lg"
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        >
          {
            // 검색된 데이터가 있을 때
            filterData != null
              ? filterData
                  .slice(purPage.current * (page - 1), purPage.current * page)
                  .map((data) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={data.roomId}
                        onClick={() => {
                          if (
                            sessionStorage.getItem('userId') != '' &&
                            sessionStorage.getItem('userId') != undefined
                          ) {
                            joinDialogOpen();
                            setRoom(data);
                          } else {
                            // alert('로그인한 사용자만 이용 가능합니다. 로그인해주세요')
                            Swal.fire({
                              title: '로그인이 필요한 작업입니다.',
                              text: '로그인 페이지로 이동합니다.',
                              icon: 'warning',
                              showConfirmButton: false,
                              timer: 800,
                            }).then(() => {
                              Router.push('/login');
                            });
                          }
                        }}
                      >
                        <Item data={data}></Item>
                      </Grid>
                    );
                  })
              : meetingData
                  .slice(purPage.current * (page - 1), purPage.current * page)
                  .map((data) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={data.roomId}
                        onClick={() => {
                          if (
                            sessionStorage.getItem('userId') != '' &&
                            sessionStorage.getItem('userId') != undefined
                          ) {
                            joinDialogOpen();
                            setRoom(data);
                          } else {
                            // alert('로그인한 사용자만 이용 가능합니다. 로그인해주세요')
                            Swal.fire({
                              title: '로그인이 필요한 작업입니다.',
                              text: '로그인 페이지로 이동합니다.',
                              icon: 'warning',
                              showConfirmButton: false,
                              timer: 800,
                            }).then(() => {
                              Router.push('/login');
                            });
                          }
                        }}
                      >
                        <Item data={data}></Item>
                      </Grid>
                    );
                  })
          }
        </CusGrid>
      )}
      <JoinDialog
        open={openJoin}
        joinDialogClose={joinDialogClose}
        room={room}
        pwDialogOpen={pwDialogOpen}
        setDetail={setDetail}
      ></JoinDialog>
      <PwDialog
        open={openPw}
        pwDialogClose={pwDialogClose}
        room={room}
        setDetail={setDetail}
      ></PwDialog>
      <CusPagination
        count={allPage}
        color="primary"
        page={page}
        onChange={handleChange}
      />
    </>
  );
}

export function Item(props) {
  let data = props.data;

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    cursor: pointer;

    & .title {
      font-weight: bolder;
    }
  `;

  const ChipWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
  `;

  const CusChip = styled(Chip)`
    width: fit-content;
    transform: translate(-10px, 45px);
  `;

  const DefaultImage = styled.div`
    height: 150px;
    background-color: #e0e0e0;
    background-image: url('/images/profile_default_gen0.png');
    background-size: 30%;
    background-repeat: no-repeat;
    background-position: center center;
  `;

  return (
    <Container>
      <ChipWrapper>
        <CusChip label={data.size} icon={<PersonIcon />} />
      </ChipWrapper>
      <Card>
        <DefaultImage></DefaultImage>

        <CardContent>
          <Typography
            className="title"
            gutterBottom
            variant="h5"
            component="div"
          >
            {data.isSecret === 1 ? <LockIcon /> : null} {data.title}
          </Typography>
          <div>{data.isPrivate ? '-' : data.nickname}</div>
          <div>
            <AccessTimeIcon style={{ marginRight: '5px' }} />
            {data.runTime}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

function JoinDialog(props) {
  let { open, joinDialogClose, room, pwDialogOpen, setDetail } = props;

  const [inputValue, setInputValue] = useState({
    roomId: '',
    userId: sessionStorage.getItem('userId'),
    password: '',
  });

  return (
    <Dialog open={open} onClose={joinDialogClose}>
      <DialogTitle>{`[${room.title}]\n방에 입장하시겠습니까?`}</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button onClick={joinDialogClose}>취소</Button>
        <Button
          onClick={
            // 비밀방인지 여부 확인
            room.isSecret === 1
              ? () => {
                  joinDialogClose();
                  pwDialogOpen();
                }
              : () => {
                  // 카메라, 오디오 정보 -> publisher
                  inputValue.roomId = room.roomId;
                  Swal.fire({
                    title: '카메라, 오디오 정보 확인 중입니다',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      joinRoomAPI(inputValue).then((res) => {
                        if (res.statusCode == 200) {
                          Swal.fire({
                            title: '미팅룸에 들어갑니다',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 500,
                          })
                          Router.push('/meeting/' + room.roomId);
                          setDetail({
                            detail: room,
                          });
                        } else {
                          // alert(`${res.message}`);
                          Swal.fire({
                            icon: 'error',
                            title: res.message,
                            confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                          });
                        }
                      });
                    },
                  });
                  joinDialogClose();
                }
          }
          autoFocus
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PwDialog(props) {
  let { open, pwDialogClose, room, setDetail } = props;
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
      <DialogTitle>{`비밀번호를 입력해주세요.`}</DialogTitle>
      <DialogContent>
        <TextField value={pw} onChange={pwChangeHandle}></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={pwDialogClose}>취소</Button>
        <Button
          onClick={
            // 일치하면 입장
            pw === room.password
              ? () => {
                  inputValue.password = pw;
                  inputValue.roomId = room.roomId;
                  Swal.fire({
                    title: '입장 진행 중입니다',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      joinRoomAPI(inputValue).then((res) => {
                        if (res.statusCode == 200) {
                          Swal.fire({
                            title: '방에 입장합니다.',
                            text: '카메라와 마이크를 준비해주세요',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 600,
                          })
                          Router.push('/meeting/' + room.roomId);
                          setDetail({
                            detail: room,
                          });
                          pwDialogClose();
                        } else {
                          // alert(`${res.message}`);
                          Swal.fire({
                            icon: 'error',
                            title: res.message,
                            confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                          });
                        }
                      });
                    },
                  });
                }
              : () => {
                  // alert('비밀번호를 확인해주세요.');
                  Swal.fire({
                    icon: 'error',
                    title: '비밀번호를 확인해주세요.',
                    confirmButtonText: '&nbsp&nbsp확인&nbsp&nbsp',
                  });
                }
          }
          autoFocus
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ItemList;
