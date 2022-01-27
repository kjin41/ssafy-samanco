import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import StackLevelSelectRegister from "../../components/Common/Stack/StackLevelSelectRegister";

import {
  checkLoginTokenInfo,
  registAPI,
  getUserTokenAPI,
  getUserInfoAPI,
  updateUserAPI,
} from "../../pages/api/user";
import {
  TextField,
  Box,
  OutlinedInput,
  Button,
  Autocomplete,
  Select,
  Typography,
} from "@mui/material";
import DatePicker from "../../components/Common/DatePicker";
import styled from "@emotion/styled";
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import MenuItem from "@mui/material/MenuItem";

export default function RegistInfo() {
  const [inputState, setInputState] = useState({
    email: "",
    phone: "",
    birthday: "",
    stacks: [],
    position: "",
    link: "",
    description: "",
    image_id: "",
    // 이미 입력된 값들
    // userId: "",
    // email: "",
    // nickname: "",
    // name: "",
    // userClass: "",
    // generation: "",
    // studentId: "",
    password: sessionStorage.getItem("password"),
    userId: sessionStorage.getItem("userId"),
    email: sessionStorage.getItem("email"),
    nickname: sessionStorage.getItem("nickname"),
    name: sessionStorage.getItem("name"),
    userClass: sessionStorage.getItem("userClass"),
    generation: sessionStorage.getItem("generation"),
    studentId: sessionStorage.getItem("studentId"),
  });

  const positionOptions = [
    { value: "frontend", name: "프론트엔드" },
    { value: "backend", name: "백엔드" },
    { value: "mobile", name: "모바일" },
    { value: "embedded", name: "임베디드" },
  ];

  const DatePickerWrapper = styled.div`
    display: flex;
    & > div {
      flex: 1;
      width: 370px;
      margin: 0px 0px;
    }
  `;

  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 30px;
    flex: 1;
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

  const [files, setFiles] = useState("");

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

    const imgEl = document.querySelector("#img_box");
    const reader = new FileReader();

    reader.onload = () =>
      (imgEl.style.backgroundImage = `url(${reader.result})`);

    imgEl.innerText = "";
    reader.readAsDataURL(files);
  };

  // const changeHandle = (e) => {
  //   const { id, value } = e.target;
  //   inputState[id] = value;
  //   // 리렌더링 X
  // };

  const changeHandle = (value, name) => {
    inputState[name] = value;
    // inputState.stacks = { HTML: value };
    // 리렌더링 X
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const positionHandleChange = (e) => {
    setInputState({
      position: e.target.value,
    });
  };

  const [links, setLinks] = useState([]);
  function handleLinksChange(linkArr) {
    let linkList = "";
    const size = linkArr.length;
    for (let i = 0; i < size; i++) {
      linkList = linkList + " " + linkArr[i];
    }
    linkList = linkList.trim();
    setInputState({
      link: linkList,
    });
  }

  const phoneReg = /^[0-9]{8,13}$/;
  // 전화번호 정규표현식

  const koreanReg = /[ㄱ-ㅎㅏ-ㅣ가-힇ㆍ ᆢ]/g;

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("이전" + inputState);

    let isNormal = true;
    let msg = "";

    inputState.stacks = {
      HTML: inputState.HTML,
      CSS: inputState.CSS,
      JavaScript: inputState.JavaScript,
      VueJS: inputState.VueJS,
      React: inputState.React,
      Python: inputState.Python,
      Java: inputState.Java,
      C: inputState.C,
      SpringBoot: inputState.SpringBoot,
      MySQL: inputState.MySQL,
      Git: inputState.Git,
      AWS: inputState.AWS,
      Docker: inputState.Docker,
      Linux: inputState.Linux,
      Jira: inputState.Jira,
      Django: inputState.Django,
      Redis: inputState.Redis,
    };

    if (isNormal) {
      const formData = new FormData();

      // setInputState({
        // userId: sessionStorage.getItem("userId"),
        // email: sessionStorage.getItem("email"),
        // nickname: sessionStorage.getItem("nickname"),
        // name: sessionStorage.getItem("name"),
        // userClass: sessionStorage.getItem("userClass"),
        // generation: sessionStorage.getItem("generation"),
        // studentId: sessionStorage.getItem("studentId"),
        // password: sessionStorage.getItem("password"),
      // });
      console.log(
        "이후" +
          inputState.userId +
          " " +
          inputState.email +
          " " +
          inputState.studentId
      );

      Object.keys(inputState).map((key) => {
        let value = inputState[key];
        if (key === "stacks") {
          formData.append(key, JSON.stringify(value));
          console.log(value);
        } else {
          formData.append(key, value);
          console.log(key + " " + value);
        }
      });

      formData.append("file", files);

      for (var key of formData.entries()) {
        console.log("key", `${key}`);
      }

      updateUserAPI(formData).then((res) => {
        console.log(res);
        sessionStorage.clear();
        sessionStorage.setItem("userId", inputState.userId);
        sessionStorage.setItem("email", inputState.email);
        sessionStorage.setItem("nickname", inputState.nickname);
        if (res.statusCode == 200) {
          alert("회원정보 추가 성공");
          window.history.forward();
          window.location.replace("/");
        } else {
          alert("회원정보 추가에 실패했습니다. 에러코드:" + res.statusCode);
        }
      });
    } else {
      alert(msg);
    }
  };

  return (
    <div className="container mx-auto max-w-xl cols-6">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        justifyContent="center"
        sx={{ flexDirection: "column" }}
        alignItems="center"
        minHeight="70vh"
        onSubmit={handleSubmit}
      >
        <h1>추가 정보 입력</h1>
        <div>
          {/* 이미지 업로드 */}
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
        </div>
        <div>
          {/* 전화번호 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              전화번호
            </Typography>
            <br />
            <OutlinedInput
              type="number"
              id="phone"
              placeholder="01012345678"
              value={inputState.phone}
              onChange={(e) => {
                handleChange(e);
              }}
              sx={{ width: 370, fontSize: 14 }}
            />
          </div>
          {/* 생년월일 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              생년월일
            </Typography>
            <br />
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePickerWrapper>
                <DatePicker
                  label=""
                  value={inputState.birthday}
                  // onChange={handleChange}
                  changeHandle={changeHandle}
                ></DatePicker>
              </DatePickerWrapper>
            </LocalizationProvider>
          </div>
          {/* 분야 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              분야
            </Typography>
            <br />
            <Select
              id="position"
              name="position"
              onChange={positionHandleChange}
              defaultValue=""
              value={inputState.position || ""}
              sx={{ minWidth: 370, fontSize: 14 }}
            >
              {positionOptions.map((u, i) => {
                return (
                  <MenuItem
                    key={i}
                    value={u.value}
                    sx={{ minWidth: 120, fontSize: 14 }}
                  >
                    {u.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          {/* 기술 스택 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              기술 스택
            </Typography>
            <StackLevelSelectRegister
              changeHandle={changeHandle}
            ></StackLevelSelectRegister>
          </div>
          {/* 링크 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              링크
            </Typography>
            <br />
            <Autocomplete
              multiple
              freeSolo
              // options={links}
              // getOptionLabel={(option) => option}
              options={links.map((l) => l.value)}
              renderInput={(params) => <TextField {...params} />}
              onChange={(e, option, reason) => {
                handleLinksChange(option);
              }}
            />
          </div>
          {/* 자기소개 */}
          <div className="mb-6">
            <Typography display="inline" sx={{ fontSize: 14 }}>
              자기소개
            </Typography>
            <br />
            <TextField
              id="description"
              placeholder="자기자신에 대해 소개해주세요"
              fullWidth
              rows={4}
              multiline
              value={inputState.description || ""}
              onChange={handleChange}
              sx={{ width: 370, fontSize: 14 }}
            />
          </div>
          {/* 가입 버튼 */}
          <Button
            type="submit"
            variant="contained"
            sx={{ width: 370, mb: 2, mt: 1, py: 1.2, fontSize: 14 }}
          >
            추가 정보 입력 완료
          </Button>
        </div>
      </Box>
    </div>
  );
}