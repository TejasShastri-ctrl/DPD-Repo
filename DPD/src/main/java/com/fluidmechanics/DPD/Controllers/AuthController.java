package com.fluidmechanics.DPD.Controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fluidmechanics.DPD.DTO.LoginRequest;
import com.fluidmechanics.DPD.DTO.SignupRequest;
import com.fluidmechanics.DPD.Models.Appuser;
import com.fluidmechanics.DPD.Models.UserRole;
import com.fluidmechanics.DPD.Repos.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Appuser> user = userRepository.findByUsername(loginRequest.getUsername());

        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            Appuser foundUser = user.get();
            foundUser.setPassword(null);
            return ResponseEntity.ok(foundUser);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()
                || userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("This user already exists");
        }

        Appuser newUser = new Appuser();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(request.getPassword());
        newUser.setEmail(request.getEmail());
        newUser.setRole(request.getRole() != null ? request.getRole() : UserRole.PRODUCTION);

        Appuser savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

}
