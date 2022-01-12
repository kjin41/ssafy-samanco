package com.ssafy.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserRepositorySupport userRepositorySupport;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {

		/*
		Todo : BE - 회원가입시 유효성검사
		1. id 디비에서 중복된거 있는지 체크
		2. id 길이 8자이상 ~ 16자 이하
		3. 비밀번호 8자이상 ~ 16자 이하
		4. 비밀번호 영어, 숫자, 특수문자 필수포함
		5. 이메일은 @ 필수적으로 포함
		6. 전화번호는 01012341234 형식
		*/

		User user = new User();
		user.setUserId(userRegisterInfo.getId());
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setEmail(userRegisterInfo.getEmail());
		user.setPhone(userRegisterInfo.getPhone());
		user.setName(userRegisterInfo.getName());
		return userRepository.save(user);
	}

	@Override
	public User getUserByUserId(String userId) {
		// 디비에 유저 정보 조회 (userId 를 통한 조회).
		User user = userRepositorySupport.findUserByUserId(userId).get();
		return user;
	}
}
