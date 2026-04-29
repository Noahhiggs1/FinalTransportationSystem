package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.UserProfile;
import com.TranzitBooking.Final.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @PostMapping("/validate")
    public String validateUser(@RequestBody UserProfile loginRequest,
                               @RequestParam String inputPassword) {

        Optional<UserProfile> found = userProfileRepository
            .findByEmail(loginRequest.getEmail());

        if (found.isEmpty()) {
            return "No account found with that email";
        }

        UserProfile user = found.get();

        if (user.getPassword().equals(inputPassword)) {
            return "Login successful";
        } else {
            return "Invalid password";
        }
    }

    @PostMapping("/create")
    public UserProfile createUser(@RequestBody UserProfile user) {
        return userProfileRepository.save(user);
    }

    @GetMapping("/email/{email}")
    public Optional<UserProfile> getUserByEmail(@PathVariable String email) {
        return userProfileRepository.findByEmail(email);
    }
}