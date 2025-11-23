package main.app.Backend.controller;

import main.app.Backend.Entities.UserDetailsEntity;
import main.app.Backend.Entities.UserEntity;
import main.app.Backend.Services.UserDetailService;
import main.app.Backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class Controller {
    @Autowired
    private UserDetailService userDetailService;
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public UserDetailsEntity saving(@RequestBody UserDetailsEntity userDetailsEntity){
        UserEntity user=new UserEntity(userDetailsEntity.getName(),userDetailsEntity.getGmail(),userDetailsEntity.getPassword());
        userService.saveUser(user);
        return userDetailService.saveUserDetails(userDetailsEntity);
    }

    @GetMapping("/login")
    public Map<String,Object> logins(Authentication authentication){
        Optional<UserDetailsEntity> user=userDetailService.findByGmail(authentication.getName());
        Map<String ,Object> map=new HashMap<>();
        map.put("name",user.get().getName());
        map.put("gmail",user.get().getGmail());
        map.put("gender",user.get().getGender());
        map.put("dob",user.get().getDob());
        return map;
    }


}
