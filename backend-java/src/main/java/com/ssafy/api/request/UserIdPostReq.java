package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@ApiModel("UserIdPostReq")
public class UserIdPostReq {
    @ApiModelProperty(name="userId", example="10")
    private Long userId;
}
