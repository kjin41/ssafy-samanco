package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserRegisterPostReq userRegisterInfo);
//	User getUserByUserId(String userId);
	User getUserByEmail(String email);
	int pwdCheck(String userPwd);
	int nameCheck(String userName);
	int emailCheck(String userEmail);
	int phoneCheck(String userPhone);

    int nickCheck(String nickname);
}