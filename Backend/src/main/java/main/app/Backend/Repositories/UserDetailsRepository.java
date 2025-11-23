package main.app.Backend.Repositories;

import main.app.Backend.Entities.UserDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailsRepository extends JpaRepository<UserDetailsEntity,Long> {
    Optional<UserDetailsEntity> findByGmail(String  gmail);
}
