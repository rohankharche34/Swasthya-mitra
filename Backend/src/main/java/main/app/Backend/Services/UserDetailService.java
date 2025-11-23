package main.app.Backend.Services;

import jakarta.persistence.Access;
import main.app.Backend.Entities.UserDetailsEntity;
import main.app.Backend.Repositories.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailService {
    @Autowired
    private UserDetailsRepository userDetailsRepository;

    public UserDetailsEntity saveUserDetails(UserDetailsEntity userDetailsEntity){
        return userDetailsRepository.save(userDetailsEntity);
    }
    public Optional<UserDetailsEntity> findByGmail(String gmail){
       return userDetailsRepository.findByGmail(gmail);
    }
}
