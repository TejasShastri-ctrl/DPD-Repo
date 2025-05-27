package com.fluidmechanics.DPD.Repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fluidmechanics.DPD.Models.Appuser;
import com.fluidmechanics.DPD.Models.UserRole;

public interface UserRepository extends JpaRepository<Appuser, Long> {
    Optional<Appuser> findByUsername(String username);
    Optional<Appuser> findByEmail(String email);
    List<Appuser> findByRole(UserRole role);
}