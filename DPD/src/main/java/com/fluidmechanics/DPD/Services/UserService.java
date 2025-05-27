package com.fluidmechanics.DPD.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fluidmechanics.DPD.Models.Appuser;
import com.fluidmechanics.DPD.Models.UserRole;
import com.fluidmechanics.DPD.Repos.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
     private UserRepository userRepository;

     public Appuser saveUser(Appuser user) {
        return userRepository.save(user);
    }

    public List<Appuser> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Appuser> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User with ID " + id + " does not exist.");
        }
        userRepository.deleteById(id);
    }

    public Optional<Appuser> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
