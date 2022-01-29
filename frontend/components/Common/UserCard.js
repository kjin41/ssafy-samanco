import StackItem from "../Common/Stack/item"
import StackLevelList from "../Common/Stack/StackLevelList"
import { Card, Avatar, Link, IconButton, Tooltip } from "@mui/material"
import styled from "@emotion/styled"
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';

import { quitProject } from "../../pages/api/project"

import ForceReload from "../../util/ForceReload"

export default function UserCard({user, projectId, hostId}) {
    const CusCard = styled(Card)`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: fit-content;
        min-width: 200px;
        min-height: 150px;
        padding: 10px;
        margin-right: 10px;

        & .card-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        & .user-name {
            font-size: 14px;
            margin: 0px 10px;
        }

        & .linkWrapper a, .linkWrapper a:visited{
          font-size: 12px;
          color: #1976d2;
        }
  
        & .linkWrapper a:hover{
          color: #0342A2;
        }

        & .row{
            display: flex;
            flex-direction: row;
        }

        & .user-position {
            font-size: 14px;
            border: 1px solid gray;
            border-radius: 5px;
            padding: 3px;
            text-align: center;
        }
        & .user-content {
            font-size: 12px;
        }
    `

    return (
        <CusCard>
            <div className="card-header">
                <div className="row">
                    <Avatar sx={{ width: 24, height: 24 }} variant="square">{user.nickname[0]}</Avatar>
                    <span className="user-name">{user.nickname}</span>
                </div>
                {
                    sessionStorage.getItem("userId") == hostId? 
                    <Tooltip title="내보내기" placement="top">
                    <IconButton onClick={() => {
                        // 유저 탈퇴시키기
                        quitProject({
                            userId: user.id, 
                            projectId: projectId
                        }).then(res => {
                            if (res.data.statusCode == 200) {
                                alert("해당 유저를 내보냈습니다.")
                                ForceReload();
                            } else {
                                alert(`${res.data.message}`)
                            }
                        })
                    }}>
                        <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                    :null
                }
            </div>
            <div className="card-content">
                {
                    user.description? 
                    <div>{user.description}</div>
                    :
                    <div className="user-content">작성된 자기소개가 없어요.</div>
                }
                {
                    user.link? 
                    <div className="linkWrapper">
                        <Link underline="none" href={user.link} target="_blank">
                        <LinkIcon />{user.link}</Link>
                    </div>
                    : <div className="user-content"><LinkIcon />등록된 링크가 없습니다.</div>
                }
                {
                    user.stacks?
                    <StackLevelList items={user.stacks}></StackLevelList>
                    :<div className="user-content"><LinkIcon />등록된 스택이 없습니다.</div>
                }
                {/* <StackItem title={user.projectPosition}></StackItem> */}
                <div className="user-position">{user.projectPosition}</div>
            </div>

        </CusCard>
    )
}