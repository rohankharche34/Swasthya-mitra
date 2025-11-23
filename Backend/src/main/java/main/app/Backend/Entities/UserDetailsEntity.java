package main.app.Backend.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "userdetails")
public class UserDetailsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String gender;

    private String dob;

    @Column(unique = true)
    private String gmail;

    private String password;

    UserDetailsEntity(){}

    public UserDetailsEntity(String name, String gender, String dob, String gmail,String password) {
        this.name = name;
        this.gender = gender;
        this.dob = dob;
        this.gmail = gmail;
        this.password=password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGmail() {
        return gmail;
    }

    public void setGmail(String gmail) {
        this.gmail = gmail;
    }
}
