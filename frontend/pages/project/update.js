import React, { useState, useRef, useEffect } from "react";
import { useSelector } from 'react-redux';

import Layout from "../../components/layout"
import { Paper, TextField, Box, Button, Autocomplete } from "@mui/material";
import DateAdapter from '@mui/lab/AdapterDateFns';
import {LocalizationProvider } from '@mui/lab';

import DatePicker from "../../components/Common/DatePicker";
import StackSelect from "../../components/Common/Stack/StackSelect";
import Counter from "../../components/Common/PositionSelect";

import styled from "@emotion/styled";

var FormData = require('form-data');

const position = [
    {name:"Front-end", count: 0},
    {name:"Back-end", count: 0},
    {name:"Embedded", count: 0},
    {name:"Mobile", count: 0}
]

function projectUpdate() {
    const detail = useSelector(({ project }) => project.projectDetail);

    const CusPaper = styled(Paper)`
        width: 100%;
        padding: 10px;

        & > div {
            margin: 10px 0px;
        }

        & .registBtn{
            display: flex;
            justify-content: flex-end;
        }

        & .imgInput{
            display:none;
        }
    `
    const DatePickerWrapper = styled.div`
        display: flex;
        & > div{
            flex: 1;
            margin: 10px 5px;
        }
    `

    const ImgUploadBtn = styled(Button)`
        padding: 20px;
        border: 1px dashed grey;
        min-width: 150px;
        min-height: 150px; 
        margin: 10px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
    `

    const [inputValue, setInputValue] = useState({
        title: detail.title,
        description: detail.description,
        schedule: detail.schedule,
        start_date: detail.start_date,
        end_date: detail.end_date,
        stacks: detail.stacks,
        positions: detail.positions,
        hostPosition: detail.hostPosition
    });

    console.log(detail)

    const [formData, changeFormData] = useState(new FormData());
    const [files, setFiles] = useState('');

    const onImgChange = (event) => {
        const file = event.target.files[0];
        setFiles(file)

        const newData = formData;
        newData.append("file", file);
        changeFormData(newData);
        console.log(file)
    }

    const uploadRef = useRef(null);

    useEffect(() => {
        preview();
    });

    const preview = () => {
        if (!files) return false;

        const imgEl = document.querySelector("#img_box");
        const reader = new FileReader();

        reader.onload = () => (
            imgEl.style.backgroundImage = `url(${reader.result})`
        )

        imgEl.innerText  = "";
        reader.readAsDataURL(files)
    }

    const changeHandle = (value, name) => {
        inputValue[name] = value;
        // 리렌더링 X
    }

    const handleAutocompleteChange = (event) => {
        const name = event.target.innerText;
        inputValue["hostPosition"] = name;
    };

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
        <Layout>
            <h1>Project Update</h1>
            <CusPaper>   
                <ImgUploadBtn id="img_box" onClick={(event) => {
                    event.preventDefault();
                    uploadRef.current.click();
                }}>Image Upload</ImgUploadBtn>
                
                <input ref={uploadRef} type="file"
                    className="imgInput" id="projectImg"
                    accept="image/*" name="file"
                    onChange={onImgChange}></input>

                <TextField fullWidth name="title" label="프로젝트 이름" onChange={(e) => changeHandle(e.target.value, "title")}
                    value={inputValue.title}/>
                <TextField
                    id="outlined-textarea"
                    name="description"
                    label="프로젝트 설명"
                    placeholder="프로젝트 설명"
                    fullWidth
                    rows={4}
                    multiline
                    onChange={(e) => changeHandle(e.target.value, "description")}
                    value={inputValue.description}
                />

                {/* <StackLevelSelect></StackLevelSelect> */}
                <StackSelect changeHandle={changeHandle} initData={inputValue.stacks} label="프로젝트 스택"></StackSelect>
                
                <DatePickerWrapper>
                    <DatePicker initDate={inputValue.start_date} changeHandle={changeHandle} label="시작 날짜"/>
                    <DatePicker initDate={inputValue.end_date}  changeHandle={changeHandle} label="종료 날짜"/>
                </DatePickerWrapper>

                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={inputValue.hostPosition}
                    options={position.map((stack) => stack.name)}
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => <TextField {...params} label="본인 포지션" />}
                />

                <Counter changeHandle={changeHandle} initData={inputValue.positions}></Counter>

                <div className="registBtn">
                    <Button variant="outlined" onClick={() => {
                        console.log(inputValue);
                    }}>수정하기</Button>
                </div>
            </CusPaper>
        </Layout>
        </LocalizationProvider>

    )
}

export default React.memo(projectUpdate);