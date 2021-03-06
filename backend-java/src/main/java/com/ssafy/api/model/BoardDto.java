package com.ssafy.api.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class BoardDto {

    private Long boardId;
    private Long userId;
    private String nickname;
    private String title;
    private String content;
    private String tag;
    private int likes;  // Long으로 캐스팅이 안됨..
    private Long hit=0l;
    private List<FileDto> files;
    private boolean userLike=false;
    private List<CommentDto> comments;
    private String dateOrTime;
    private String dateAndTime;
    private boolean canRegister=false;
    private boolean canJoin=false;
    private Long roomId=0l;
}
