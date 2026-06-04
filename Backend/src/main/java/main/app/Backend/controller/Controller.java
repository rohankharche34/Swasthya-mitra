package main.app.Backend.controller;

import main.app.Backend.Entities.LinkEntity;
import main.app.Backend.Entities.UserDetailsEntity;
import main.app.Backend.Entities.UserEntity;
import main.app.Backend.Services.LinkService;
import main.app.Backend.Services.UserDetailService;
import main.app.Backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class Controller {
    @Autowired
    private UserDetailService userDetailService;
    @Autowired
    private UserService userService;
    @Autowired
    private LinkService linkService;

    @PostMapping("/signup")
    public ResponseEntity<?> saving(@RequestBody UserDetailsEntity userDetailsEntity){
        Optional<UserEntity> existingUser = userService.findByGmail(userDetailsEntity.getGmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("message", "User already exists with this email"));
        }

        UserEntity user=new UserEntity(userDetailsEntity.getName(),userDetailsEntity.getGmail(),userDetailsEntity.getPassword(),"user");
        userService.saveUser(user);
        userDetailsEntity.setType("user");
        UserDetailsEntity savedUser = userDetailService.saveUserDetails(userDetailsEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @GetMapping("/login")
    public ResponseEntity<?> logins(Authentication authentication){
        Optional<UserDetailsEntity> user=userDetailService.findByGmail(authentication.getName());
        
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "User not found"));
        }
        
        Map<String ,Object> map=new HashMap<>();
        map.put("name",user.get().getName());
        map.put("gmail",user.get().getGmail());
        map.put("gender",user.get().getGender());
        map.put("dob",user.get().getDob());
        map.put("image",user.get().getImage());
        map.put("type",user.get().getType());
        System.out.println(user);
        return ResponseEntity.ok(map);
    }
    @PutMapping("/update")
    public UserDetailsEntity update(Authentication authentication,@RequestBody UserDetailsEntity userDetailsEntity){
        String gmail=authentication.getName();
        Optional<UserEntity> userEntity=userService.findByGmail(gmail);
        Optional<UserDetailsEntity> user=userDetailService.findByGmail(gmail);
        userEntity.get().setName(userDetailsEntity.getName());

        user.get().setImage(userDetailsEntity.getImage());
        user.get().setDob(userDetailsEntity.getDob());

        user.get().setGender(userDetailsEntity.getGender());
        user.get().setName(userDetailsEntity.getName());
        userService.updateUser(userEntity.get());
        return userDetailService.saveUserDetails(user.get());
    }

    @PostMapping("/savelink")
    public LinkEntity saveLinks(@RequestBody LinkEntity linkEntity){
        return linkService.saveLink(linkEntity);
    }
    @GetMapping("/getlink")
    public List<LinkEntity> fetchLinks(){
        return linkService.findLinks();
    }
    @DeleteMapping("/deletelink/{id}")
    public void  deleteLink(@PathVariable long id){
        linkService.deleteLink(id);
    }


}
