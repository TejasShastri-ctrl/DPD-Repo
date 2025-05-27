package com.fluidmechanics.DPD.DTO;

import com.fluidmechanics.DPD.Models.UserRole;
import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
    private String email;
    private UserRole role;
}