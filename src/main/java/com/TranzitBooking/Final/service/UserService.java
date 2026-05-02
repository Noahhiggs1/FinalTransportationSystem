//Aniya
package com.TranzitBooking.Final.service;

import com.TranzitBooking.Final.model.sql.UserProfile;
import com.TranzitBooking.Final.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfile createUser(String firstName, String lastName,
                                   String email, String password,
                                   String username) {
        UserProfile user = new UserProfile();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password);
        user.setUsername(username);
        return userProfileRepository.save(user);
    }

    public boolean validateUser(UserProfile user, String inputPassword) {
        Optional<UserProfile> found = userProfileRepository
            .findByEmail(user.getEmail());
        if (found.isEmpty()) return false;
        return found.get().getPassword().equals(inputPassword);
    }
}
