import Layout from "../../components/layout";
import { useSelector } from 'react-redux';

import styled from "@emotion/styled";
import StackList from "../../components/Club/StackList"
import stackData from "../../data/StackData.json"
import PositionList from "../../components/Club/PositionList"
import positionData from "../../data/positionData.json"

import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Card, Container, Skeleton, CardContent, Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ButtonGroup } from "@mui/material";
import { useState } from "react";
import Router from "next/router";


const StudyDetail = () => { 
    const detail = useSelector(({ study }) => study.studyDetail);

    const DetailWrapper = styled.div`
        display: flex;
        flex-direction: row;
    `

    const ContentWrapper = styled.div`
        display: flex;
        flex-direction: column;
        padding: 0px 30px;
        flex: 1;
    `

    const CusSkeleton = styled(Skeleton)`
        display: flex;
        flex: 1;
        min-width: 200px;
        min-height: 200px;
        height: auto;
    `

    const CusContainer = styled(Container)`
        float: left
    `

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
    `
    
    return (
    <Layout>
        <CusContainer maxWidth="md">
            <br></br>
            <DetailHeader>
                <h2>{detail.title}</h2>
                <DetailOperation></DetailOperation>
            </DetailHeader>
            <DetailWrapper maxWidth="sm">
                <CusSkeleton variant="rectangular" animation={false} />
                <StudyInfo detail={detail}></StudyInfo>
            </DetailWrapper>    
            <StudyDetail></StudyDetail>
        </CusContainer>
    </Layout>);

    function DetailOperation() {
        const [open, setOpen] = useState(false);

        const JoinDialogOpen = () => { setOpen(true) }
        const JoinDialogClose = () => { setOpen(false) }


        return (
            <>
            <ButtonGroup variant="outlined">
                <Button onClick={() => {
                    Router.push("/study/update");
                }}>수정</Button>
                <Button onClick={JoinDialogOpen}>삭제</Button>
            </ButtonGroup>
            <Dialog
                open={open}
                onClose={JoinDialogClose}
                >
                <DialogTitle>
                    {"삭제 하시겠습니까?"}
                </DialogTitle>
                <DialogActions>
                <Button onClick={JoinDialogClose}>취소</Button>
                <Button onClick={JoinDialogClose} autoFocus>
                    확인
                </Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }

    function StudyInfo(){
        return (
            <ContentWrapper>
                <div>기술 스택</div>
                <StackList stackData={detail.stacks}></StackList>
                <br />
                <div>모집 팀원</div>
                <PositionList positionData={detail.positions}></PositionList>        
            </ContentWrapper>
        )
    }

    function StudyDetail() {
        const CusCard = styled(Card)`
            margin-top: 10px;
        `

        return (
            <CusCard sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 16 }}  variant="body1">
                        {detail.description}
                    </Typography>
                    <br />
                    <Divider light />
                    <br />
                    <DetailFooter detail={detail}></DetailFooter>
                </CardContent>
                <DetailAction detail={detail}></DetailAction>
            </CusCard>
        )
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
    `
        let detail = props.detail;

        return (
            <FooterWrapper>
                <div>
                    <Typography sx={{ fontSize: 14 }} gutterBottom>
                        진행 기간
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} >
                        {detail.start_date} ~  {detail.end_date}
                    </Typography>
                </div>
                <div>
                    <Typography sx={{ fontSize: 14 }} gutterBottom>
                        예정 스케쥴
                    </Typography>

                    <Typography sx={{ mb: 1.5 }}>
                        {detail.schedule} 
                    </Typography>
                </div>
            </FooterWrapper>
        )
    }

    function DetailAction(props) {
        let detail = props.detail;
        const ActionWrapper = styled.div`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 20px;
            & > div, a {
                display: flex;
                flex-direction: row;
                align-items: center;
                text-align: center;
            }

            & span {
                margin : 0px 5px;
            }
        `
        const [open, setOpen] = useState(false);

        const JoinDialogOpen = () => { setOpen(true) }
        const JoinDialogClose = () => { setOpen(false) }

        return (
            <ActionWrapper>
                <ButtonGroup variant="outlined" aria-label="text button group">
                    <Button  style={{ pointerEvents: "none" }}> 
                        <VisibilityIcon /> 
                        <span>{detail.hit}</span>
                    </Button>
                    <Button>
                        <FavoriteIcon /> 
                        <span>{detail.like}</span>
                    </Button>
                </ButtonGroup>
                <>
                    <Button variant="outlined" onClick={JoinDialogOpen}>지원하기</Button>
                    <Dialog
                        open={open}
                        onClose={JoinDialogClose}
                        >
                        <DialogTitle>
                            {"지원 하시겠습니까?"}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            마이페이지에 기입된 정보가 전달됩니다. 
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={JoinDialogClose}>취소</Button>
                        <Button onClick={JoinDialogClose} autoFocus>
                            확인
                        </Button>
                        </DialogActions>
                    </Dialog>
                </>
            </ActionWrapper>
        )
    }
} 


export default StudyDetail;