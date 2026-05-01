package com.TranzitBooking.Final.controller;

import com.TranzitBooking.Final.model.sql.UserProfile;
import com.TranzitBooking.Final.repository.UserProfileRepository;
import com.TranzitBooking.Final.repository.EmployeeRepository;
import com.TranzitBooking.Final.model.sql.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired private UserProfileRepository userProfileRepository;
    @Autowired private EmployeeRepository employeeRepository;

    @PostMapping("/create")
    public UserProfile createUser(@RequestBody UserProfile user) {
        return userProfileRepository.save(user);
    }

    @PostMapping("/validate")
    public String validateUser(@RequestBody UserProfile loginRequest,
                               @RequestParam String inputPassword) {
        Optional<UserProfile> found = userProfileRepository.findByEmail(loginRequest.getEmail());
        if (found.isEmpty()) return "No account found with that email";
        UserProfile user = found.get();
        if (user.getPassword().equals(inputPassword)) return "Login successful";
        return "Invalid password";
    }

    @GetMapping("/email/{email}")
    public Optional<UserProfile> getUserByEmail(@PathVariable String email) {
        return userProfileRepository.findByEmail(email);
    }

    @PostMapping("/employee-login")
    public ResponseEntity<?> employeeLogin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        Optional<Employee> found = employeeRepository.findByEmail(email);
        if (found.isEmpty()) return ResponseEntity.status(401).body("No employee found with that email");
        Employee emp = found.get();
        if (!password.equals(emp.getPassword())) return ResponseEntity.status(401).body("Invalid password");
        Map<String, Object> result = new HashMap<>();
        result.put("employeeId", emp.getEmployeeId());
        result.put("firstName", emp.getFirstName());
        result.put("lastName", emp.getLastName());
        result.put("email", emp.getEmail());
        result.put("role", emp.isAdmin() ? "admin" : "operator");
        return ResponseEntity.ok(result);
    }
}