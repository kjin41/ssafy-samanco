import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Layout from '../../components/Layout';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2';

import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

import DatePicker from '../../components/Common/DatePicker';
import StackSelect from '../../components/Common/Stack/StackSelect';
import Counter from '../../components/Common/PositionSelect';

import styled from '@emotion/styled';
import { updateAPI } from '../api/project';

import Router from 'next/router';
import Head from 'next/head';

const position = [
  { name: 'Frontend', count: 0 },
  { name: 'Backend', count: 0 },
  { name: 'Embedded', count: 0 },
  { name: 'Mobile', count: 0 },
];

function projectUpdate() {
  const detail = useSelector(({ project }) => project.projectDetail);
  const url = '../../../backend-java';

  const CusPaper = styled(Paper)`
    width: 100%;
    padding: 10px;

    & > div {
      margin: 10px 0px;
    }

    & .registBtn {
      display: flex;
      justify-content: flex-end;
    }

    & .imgInput {
      display: none;
    }
  `;
  const DatePickerWrapper = styled.div`
    display: flex;
    & > div {
      flex: 1;
      margin: 10px 5px;
    }
  `;

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
  `;

  const [inputValue, setInputValue] = useState({
    projectId: detail.id,
    hostId: sessionStorage.getItem('userId'),
    startDate: detail.startDate,
    endDate: detail.endDate,
    stacks: detail.stacks,
    positions: detail.positions,
    hostPosition: detail.hostPosition,
  });

  const [files, setFiles] = useState('');

  const onImgChange = (event) => {
    const file = event.target.files[0];
    setFiles(file);
  };

  const uploadRef = useRef(null);

  useEffect(() => {
    preview();
  });

  const preview = () => {
    if (!files) return false;

    const imgEl = document.querySelector('#img_box');
    const reader = new FileReader();
    let saveFile, saveFolder;

    if (detail.file) {
      saveFile = detail.file.saveFile;
      saveFolder = detail.file.saveFolder;
    }
    reader.onload = () =>
      detail.file
        ? (imgEl.style.backgroundImage = `url(${url}/${saveFolder}/${saveFile})`)
        : (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = '';
    reader.readAsDataURL(files);
  };

  const changeHandle = (value, name) => {
    inputValue[name] = value;
    // ???????????? X
  };

  const handleAutocompleteChange = (event) => {
    const name = event.target.innerText;
    inputValue['hostPosition'] = name;
  };

  function validateCheck() {
    let [check, msg] = [true, ''];

    if (typeof inputValue.title == 'undefined')
      inputValue['title'] = detail.title;
    else if (inputValue.title == '')
      [check, msg] = [false, '???????????? ????????? ??????????????????.'];
    if (typeof inputValue.collectStatus == 'undefined')
      inputValue['collectStatus'] = detail.collectStatus;
    if (typeof inputValue.description == 'undefined')
      inputValue['description'] = detail.description;
    if (typeof inputValue.hostPosition == 'undefined')
      [check, msg] = [false, '????????? ???????????? ??????????????????.'];
    if (typeof inputValue.stacks == 'undefined')
      inputValue['stacks'] = detail.stacks;
    else if (inputValue.stacks.length == 0)
      [check, msg] = [false, '???????????? ????????? ????????? ?????? ??????????????????.'];
    else if (
      inputValue.positions.totalFrontendSize +
        inputValue.positions.totalBackendSize +
        inputValue.totalEmbeddedSize +
        inputValue.positions.totalMobileSize <=
      1
    )
      [check, msg] = [false, '????????? ??? ????????? ???????????? ?????????.'];

    // if (!check) alert(msg);
    if (!check) {
      // alert(msg);
      Swal.fire({
        icon: 'error',
        title: msg,
        confirmButtonText: '&nbsp&nbsp??????&nbsp&nbsp',
      });
    }
    return check;
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Layout>
        <Head>
          <title>???????????? ?????? | ???????????????</title>
        </Head>
        <h1 style={{ marginTop: '20px' }}>???????????? ??????</h1>
        <CusPaper>
          <ImgUploadBtn
            id="img_box"
            onClick={(event) => {
              event.preventDefault();
              uploadRef.current.click();
            }}
          >
            Image Upload
          </ImgUploadBtn>

          <input
            ref={uploadRef}
            type="file"
            className="imgInput"
            id="projectImg"
            accept="image/*"
            name="file"
            encType="multipart/form-data"
            onChange={onImgChange}
          ></input>

          <FormControl>
            <InputLabel id="status-select-label">?????? ??????</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              name="collectStatus"
              defaultValue={detail.collectStatus}
              value={inputValue.collectStatus}
              label="?????? ??????"
              onChange={(e) => changeHandle(e.target.value, 'collectStatus')}
            >
              <MenuItem value={'ING'}>?????????</MenuItem>
              <MenuItem value={'END'}>?????? ??????</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="title"
            label="???????????? ??????"
            onChange={(e) => changeHandle(e.target.value, 'title')}
            defaultValue={detail.title}
            value={inputValue.title}
          />
          <TextField
            id="outlined-textarea"
            name="description"
            label="???????????? ??????"
            placeholder="???????????? ??????"
            fullWidth
            rows={4}
            multiline
            onChange={(e) => changeHandle(e.target.value, 'description')}
            defaultValue={detail.description}
            value={inputValue.description}
          />

          <StackSelect
            changeHandle={changeHandle}
            initData={detail.stacks}
            label="???????????? ??????"
          ></StackSelect>

          <DatePickerWrapper>
            <DatePicker
              initDate={inputValue.startDate}
              changeHandle={changeHandle}
              label="?????? ??????"
            />
            <DatePicker
              initDate={inputValue.endDate}
              changeHandle={changeHandle}
              label="?????? ??????"
            />
          </DatePickerWrapper>

          <Autocomplete
            id="free-solo-demo"
            freeSolo
            value={inputValue.hostPosition}
            options={position.map((stack) => stack.name)}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField {...params} label="?????? ?????????" />
            )}
          />

          <Counter
            changeHandle={changeHandle}
            initData={inputValue.positions}
          ></Counter>

          <div className="registBtn">
            <Button
              variant="outlined"
              onClick={() => {
                if (validateCheck()) {
                  Swal.fire({
                    title: '???????????? ?????? ????????????',
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();

                      const formData = new FormData();

                      Object.keys(inputValue).map((key) => {
                        let value = inputValue[key];
                        if (key === 'stacks' || key == 'positions')
                          formData.append(key, JSON.stringify(value));
                        else formData.append(key, value);
                      });
                      formData.append('file', files);

                      // for(var key of formData.entries())
                      // {
                      //     console.log(`${key}`);
                      // }

                      updateAPI(formData).then((res) => {
                        if (res.statusCode == 200) {
                          // alert('??????????????? ?????????????????????.');
                          // Router.push('/project/' + inputValue.projectId);
                          Swal.fire({
                            title: '??????????????? ?????????????????????.',
                            // text: '?????????????????? ???????????????',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                          }).then(() => {
                            Router.push('/project/' + inputValue.projectId);
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
              }}
            >
              ????????????
            </Button>
          </div>
        </CusPaper>
      </Layout>
    </LocalizationProvider>
  );
}

export default React.memo(projectUpdate);
