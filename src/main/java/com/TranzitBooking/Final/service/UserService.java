package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.UserProfile;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserProfile createUser(String firstName, String lastName, String email, String password, String role) {
        UserProfile user = new UserProfile();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    public boolean validateUser(UserProfile user, String inputPassword) {
        return user.getPassword().equals(inputPassword);
    }
}