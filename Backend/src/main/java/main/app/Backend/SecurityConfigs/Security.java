package main.app.Backend.SecurityConfigs;

import main.app.Backend.Services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class Security {
    private final UserService userService;

    public Security(UserService userService) {
        this.userService = userService;
    }



    @Bean
    public UserDetailsService userDetailsService() {
        return gmail -> userService.findByGmail(gmail)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getGmail())
                        .password(user.getPassword())
                        .roles("USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/signup").permitAll()
                        .requestMatchers("/api/login")
                        .authenticated()
                        .anyRequest().permitAll()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
