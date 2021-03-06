import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const stack = [
  { name: 'HTML', level: 1 },
  { name: 'CSS', level: 1 },
  { name: 'JavaScript', level: 1 },
  { name: 'VueJS', level: 1 },
  { name: 'React', level: 1 },
  { name: 'Angular', level: 1 },
  { name: 'Python', level: 1 },
  { name: 'Java', level: 1 },
  { name: 'C', level: 1 },
  { name: 'C++', level: 1 },
  { name: 'C#', level: 1 },
  { name: 'SpringBoot', level: 1 },
  { name: 'MySQL', level: 1 },
  { name: 'Git', level: 1 },
  { name: 'AWS', level: 1 },
  { name: 'Docker', level: 1 },
  { name: 'Linux', level: 1 },
  { name: 'Jira', level: 1 },
  { name: 'Django', level: 1 },
  { name: 'Redis', level: 1 },
  { name: 'Kotlin', level: 1 },
];

function StackLevelSelectRegister(props) {
  const stackList = JSON.stringify(props.values);

  let initValue;
  if (stackList != null) {
    initValue = JSON.parse(stackList);
  }

  let initArray = [];
  if (stackList && initValue) {
    Object.keys(initValue).forEach(function (obj) {
      const value = initValue[obj];
      initArray.push({ name: value.name, level: value.grade });
    });
  }

  const [stacks, setStacks] = useState(props.values ? initArray : []);

  const handleAutocompleteChange = (event) => {
    const name = event.target.innerText;
    if (!name) return false;
    let isInclude = false;

    stacks.map((row) => {
      if (row.name === name) {
        // 중복된 key가 들어오지 않도록 처리
        isInclude = true;
      }
    });

    if (!isInclude) {
      setStacks([...stacks, { name: name, level: 1 }]);
    }
  };

  const [stackStack, setStackStack] = useState([]);
  useEffect(() => {
    // 상위 컴포넌트에게 바뀐 포지션 전달
    let [
      HTML,
      CSS,
      JavaScript,
      VueJS,
      React,
      Angular,
      Python,
      Java,
      C,
      C2,
      C3,
      SpringBoot,
      MySQL,
      Git,
      AWS,
      Docker,
      Linux,
      Jira,
      Django,
      Redis,
      Kotlin,
    ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    stacks.map((stack) => {
      switch (stack.name) {
        case 'HTML':
          HTML = stack.level;
          props.changeHandle(parseInt(HTML), 'HTML');
          // setStackStack([...stackStack, { HTML:stack.level  }]);
          break;
        case 'CSS':
          CSS = stack.level;
          props.changeHandle(parseInt(CSS), 'CSS');
          break;
        case 'JavaScript':
          JavaScript = stack.level;
          props.changeHandle(parseInt(JavaScript), 'JavaScript');
          break;
        case 'VueJS':
          VueJS = stack.level;
          props.changeHandle(parseInt(VueJS), 'VueJS');
          break;
        case 'React':
          React = stack.level;
          props.changeHandle(parseInt(React), 'React');
          break;
        case 'Angular':
          Angular = stack.level;
          props.changeHandle(parseInt(Angular), 'Angular');
          break;
        case 'Python':
          Python = stack.level;
          props.changeHandle(parseInt(Python), 'Python');
          break;
        case 'Java':
          Java = stack.level;
          props.changeHandle(parseInt(Java), 'Java');
          break;
        case 'C':
          C = stack.level;
          props.changeHandle(parseInt(C), 'C');
          break;
        case 'C++':
          C2 = stack.level;
          props.changeHandle(parseInt(C2), 'C2');
          break;
        case 'C#':
          C3 = stack.level;
          props.changeHandle(parseInt(C3), 'C3');
          break;
        case 'SpringBoot':
          SpringBoot = stack.level;
          props.changeHandle(parseInt(SpringBoot), 'SpringBoot');
          break;
        case 'MySQL':
          MySQL = stack.level;
          props.changeHandle(parseInt(MySQL), 'MySQL');
          break;
        case 'Git':
          Git = stack.level;
          props.changeHandle(parseInt(Git), 'Git');
          break;
        case 'AWS':
          AWS = stack.level;
          props.changeHandle(parseInt(AWS), 'AWS');
          break;
        case 'Docker':
          Docker = stack.level;
          props.changeHandle(parseInt(Docker), 'Docker');
          break;
        case 'Linux':
          Linux = stack.level;
          props.changeHandle(parseInt(Linux), 'Linux');
          break;
        case 'Jira':
          Jira = stack.level;
          props.changeHandle(parseInt(Jira), 'Jira');
          break;
        case 'Django':
          Django = stack.level;
          props.changeHandle(parseInt(Django), 'Django');
          break;
        case 'Redis':
          Redis = stack.level;
          props.changeHandle(parseInt(Redis), 'Redis');
          break;
        case 'Kotlin':
          Kotlin = stack.level;
          props.changeHandle(parseInt(Kotlin), 'Kotlin');
          break;
        default:
          break;
      }
    });

    if (HTML == 0) props.changeHandle(0, 'HTML');
    if (CSS == 0) props.changeHandle(0, 'CSS');
    if (JavaScript == 0) props.changeHandle(0, 'JavaScript');
    if (VueJS == 0) props.changeHandle(0, 'VueJS');
    if (React == 0) props.changeHandle(0, 'React');
    if (Python == 0) props.changeHandle(0, 'Python');
    if (C == 0) props.changeHandle(0, 'C');
    if (C2 == 0) props.changeHandle(0, 'C2');
    if (C3 == 0) props.changeHandle(0, 'C3');
    if (Java == 0) props.changeHandle(0, 'Java');
    if (Angular == 0) props.changeHandle(0, 'Angular');
    if (SpringBoot == 0) props.changeHandle(0, 'SpringBoot');
    if (MySQL == 0) props.changeHandle(0, 'MySQL');
    if (Git == 0) props.changeHandle(0, 'Git');
    if (AWS == 0) props.changeHandle(0, 'AWS');
    if (Docker == 0) props.changeHandle(0, 'Docker');
    if (Linux == 0) props.changeHandle(0, 'Linux');
    if (Jira == 0) props.changeHandle(0, 'Jira');
    if (Django == 0) props.changeHandle(0, 'Django');
    if (Redis == 0) props.changeHandle(0, 'Redis');
    if (Kotlin == 0) props.changeHandle(0, 'Kotlin');

    // if (!CSS) props.changeHandle(0, "CSSLevel");
    // if (!JavaScript) props.changeHandle(0, "JavaScriptLevel");
    // props.changeHandle(stackStack, "stacks");
  }, [stacks]);

  return (
    <>
      <Box>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={stack.map((stack) => stack.name)}
          onChange={handleAutocompleteChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
      <Stack>
        {stacks.length > 0
          ? stacks.slice(0).reverse().map((stack) => (
              <CusPaper
                key={stack.name}
                name={stack.name}
                level={stack.level}
                stacks={stacks}
                setStacks={setStacks}
              ></CusPaper>
            ))
          : null}
      </Stack>
    </>
  );
}

function CusPaper(props) {
  const Item = styled(Paper)`
    margin: 5px 0px;
    padding: 10px 20px;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & .deleteBtn {
      cursor: pointer;
    }
  `;

  function DeleteStack(name) {
    let newStack = props.stacks.filter((stack) => stack.name !== name);
    props.setStacks(newStack);
  }

  function handleLevelChange(event, name) {
    let newStack = JSON.parse(JSON.stringify(props.stacks));
    let level;
    newStack.map((stack) => {
      if (stack.name === name) {
        stack.level = event.target.value;
        level = stack.level;
      }
    });
    if (level <= 0) {
      newStack = props.stacks.filter((stack) => stack.name !== name);
    }
    props.setStacks(newStack);
  }

  return (
    <Item>
      <span>{props.name}</span>
      <ButtonGroup>
        <Rating
          name={props.name}
          value={Number(props.level)}
          size="large"
          max={3}
          onChange={(event) => handleLevelChange(event, props.name)}
        ></Rating>
        <DeleteIcon
          onClick={() => {
            DeleteStack(props.name);
          }}
        />
      </ButtonGroup>
    </Item>
  );
}

export default StackLevelSelectRegister;
