import {Card, CardContent, Button, Divider} from "@mui/material";
import styled from "@emotion/styled";
import * as projectActions from '../../store/module/project';
import * as studyActions from '../../store/module/study';
import { useSelector, useDispatch } from 'react-redux';
import {getProjectByUserId} from "../../pages/api/project"
import {getStudyByUserId} from "../../pages/api/study"
import { useEffect, useCallback } from "react";

import StackList from "../Club/StackList"
import Router from "next/router";


function MyClub(props){
    const MyClubWrapper = styled.div`
        width: 100%;
        & .img-wrapper{
            background-Color: #c9c9c9;
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }
    `

    const CusCardContent = styled(CardContent)`
        display: flex;
        flex-direction: row;
    `

    const ProjectInfo = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0px 10px;

        & .title {
            font-size: 18px;
        }

        & .date {
            font-size: 10px;
            color: #1976D6;
        }
    `

    const CusCard = styled(Card)`
        max-width: 430px;
    `

    const CusDivider = styled(Divider)`
      margin: 20px 0px;
    `

    const dispatch = useDispatch();
    let clubData;
    if (props.from === "project") {
        clubData = useSelector(({ project }) => project.myProject);
    } else if (props.from === "study") {
        clubData = useSelector(({ study }) => study.myStudy);
    }

    useEffect(() => {
        switch (props.from) {
            case "project":
                getProjectByUserId(parseInt(sessionStorage.getItem("userId")))
                .then(res => {
                    console.log(res)
                    dispatch(projectActions.setMyProject({project: res.project}))
                    dispatch(projectActions.setProjectDetail({detail: res.project}))
                });
                break;
            case "study":
                getStudyByUserId(parseInt(sessionStorage.getItem("userId")))
                .then(res => {
                    console.log(res)
                    // To Do: 내 스터디 리스트 처리
                    dispatch(studyActions.setMyStudy({study: res.studies[0]}))
                    dispatch(studyActions.setStudyDetail({detail: res.study}))
                });
                break;
            default:
                break;
        }
        
    }, [])

    return (
        typeof(clubData) === "undefined" || clubData == null?
        null : 
        <>
        <MyClubWrapper>
            <h2>{props.label}</h2>
            <CusCard>
                <CusCardContent>
                    <div className="img-wrapper"></div>
                    <ProjectInfo>
                        <div className="title">{clubData.title}</div>
                        {
                            props.from === "project"?
                            <div className="date">{clubData.startDate} ~ {clubData.endDate}</div>
                            :
                            <div className="date">{clubData.schedule}</div>
                        }
                        
                        {/* 리스트에서 보이는 클럽 스택은 최대 3개까지 표시 */}
                        {
                            clubData.stacks?
                            <StackList stackData={clubData.stacks.length > 3? 
                                clubData.stacks.slice(0,3)
                                : 
                                clubData.stacks
                            }></StackList>: null
                        }
                        <Button variant="outlined" onClick={() => {
                            if (props.from === "project")
                                Router.push("/project/info")
                            else if (props.from === "study")
                                Router.push("/study/info")
                        }}>상세 보기 </Button>
                    </ProjectInfo>
                    
                </CusCardContent>
            </CusCard>
        </MyClubWrapper>
        <CusDivider variant="middle" />
        </>
    )
}

export default MyClub;