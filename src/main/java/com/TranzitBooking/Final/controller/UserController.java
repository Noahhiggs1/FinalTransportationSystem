package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.UserProfile;
import com.TranzitBooking.Final.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public UserProfile createUser(@RequestBody UserProfile user) {
        return userService.createUser(
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPassword(),
            user.getRole()
        );
    }

    @PostMapping("/validate")
    public String validateUser(@RequestBody UserProfile user, @RequestParam String inputPassword) {
        boolean valid = userService.validateUser(user, inputPassword);
        return valid ? "Login successful" : "Invalid password";
    }
}