import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";

import styled from "@emotion/styled"
import { Grid, Skeleton, Card, CardContent, Typography, Pagination, Badge } from '@mui/material';

import projectJSONData from "../../data/projectData.json"
import Router from "next/router";

import { useSelector, useDispatch } from 'react-redux';
import * as projectActions from '../../store/module/project';

import StackList from "./StackList"
import stackData from "../../data/StackData.json"

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


function ItemList() {
    //-------------- redux dispatch로 값 저장, selector로 불러오기
    let projectData = useSelector(({ project }) => project.projectList);

    const dispatch = useDispatch();

    const setDetail = useCallback(
        ({detail}) => {
            dispatch(projectActions.setProjectDetail({detail}))
        },
        [dispatch],
    )

    const setList = useCallback(
        ({list}) => {
            dispatch(projectActions.setProjectList({list}))
        },
        [dispatch],
    )

    // 페이지네이션 페이지
    const [page, setPage] = useState(1);

    // 미디어 쿼리에 따라 화면에 보여지는 그리드 수 변경
    const theme = useTheme();
    
    const xsMaches = useMediaQuery(theme.breakpoints.up('xs'));
    const smMatches = useMediaQuery(theme.breakpoints.up('sm'));
    const mdMatches = useMediaQuery(theme.breakpoints.up('md'));
    const lgMatches = useMediaQuery(theme.breakpoints.up('lg'));
    
    let purPage = useRef(1);
    let allPage = parseInt(projectData.length / purPage.current);
    if (projectData.length % purPage.current > 0) allPage += 1;

    if (lgMatches) {
        purPage.current = 8;
    }
    else if (mdMatches) {
        purPage.current = 6;
    } 
    else if (smMatches) {
        purPage.current = 4;
    } 
    else if (xsMaches) {
        purPage.current = 2;
    }

    // 화면에 요소를 그리기 전에 store에 저장된 아이템 리스트가 있는지 확인
    // 없으면 store에 저장
    useLayoutEffect(() => {
        if (projectData.length == 0) {
            // 빈 배열이면 배열 요청
            // To Do : 나중에 api로 값 가져오게 수정
            setList({list: projectJSONData});
        }
    }, [])

    const handleChange = (index,value) => {
        setPage(value);
    };


    const CusPagination = styled(Pagination)`
        margin-top: 20px;
    `;

    const CusGrid = styled(Grid)`
        min-height: 530px;
    `

    return (
        <>
        <CusGrid container maxWidth="lg" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4}}>
            {
                projectData.slice(purPage.current * (page-1), purPage.current * page).map((data) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={data.no}  onClick={()=>{
                            Router.push("/project/"+data.no);
                            setDetail({detail: data});
                        }}>
                            <Item data={data}></Item> 
                        </Grid>
                    )
                })
            }
        </CusGrid>
        <CusPagination count={allPage} color="primary" page={page} onChange={handleChange} />
        </>
    )
}

export function Item(props) {
    let data = props.data;

    const Container = styled.div`
        display: flex;
        flex-direction: column;
        text-align: left;
    `

    const CusBadge = styled(Badge)`
        top: 30px;
        right: 30px;
    ` 

    let totalSize = 0;
    let currSize = data.positions.reduce((acc, curr) => {
        if (curr.position.includes("current")) {
            acc += curr.size;
        }
        if (curr.position === "totalSize") totalSize = curr.size;
        return acc;
    }, 0)

    return (
        <Container>
            {/* To Do: current 주어지면 변경하기 */}
            <CusBadge badgeContent={currSize+" / "+totalSize} color="primary"></CusBadge>
            <Card>
                <Skeleton variant="rectangular" height={150} animation={false} />
                
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.title}
                    </Typography>
                    
                    <StackList stackData={data.stacks}></StackList>
                </CardContent>
            </Card>
        </Container>
    )
}

export default ItemList;