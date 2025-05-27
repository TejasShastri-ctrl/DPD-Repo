package com.fluidmechanics.DPD.Services;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fluidmechanics.DPD.Repos.ModeldataVersionRepository;
import com.fluidmechanics.DPD.Repos.UserRepository;
import com.fluidmechanics.DPD.Models.Appuser;
import com.fluidmechanics.DPD.Models.Modeldata;
import com.fluidmechanics.DPD.Models.Modeldataversion;
import com.fluidmechanics.DPD.Models.Status;
import com.fluidmechanics.DPD.Models.VersionStatus;
import com.fluidmechanics.DPD.Repos.ModeldataRepository;

import org.springframework.transaction.annotation.Transactional;
//!! import jakarta.transaction.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ModeldataService {

    // note-  required args constructor only initiates final fields
    private final ModeldataVersionRepository versionRepository;
    private final ModeldataRepository modeldataRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    // Will look into cloudinary later - //! dropped
    private final String uploadDir = "uploads"; // For local storage

    // ! CREATE NEW MODEL
    public Modeldata createNewModel(Long userId, String name, String type, String description, MultipartFile file)
            throws IOException {
        Appuser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Modeldata modeldata = new Modeldata();
        modeldata.setName(name);
        modeldata.setType(type);
        modeldata.setDescription(description);
        modeldata.setAppuser(user);
        modeldata.setCreatedAt(LocalDateTime.now());
        modeldata.setUpdatedAt(LocalDateTime.now());
        modeldata.setAppUsername(modeldata.getAppuser().getUsername());

        modeldata.setStatus(Status.CREATED);
        modeldata.setVersions(new ArrayList<>());

        Modeldata savedModel = modeldataRepository.save(modeldata);

        return addNewVersion(savedModel.getId(), file, description, "default dimensions");
    }

    // ! ADD NEW VERSION
    public Modeldata addNewVersion(Long modeldataId, MultipartFile file, String description, String dimensions) throws IOException {
    Modeldata modeldata = modeldataRepository.findById(modeldataId)
            .orElseThrow(() -> new IllegalArgumentException("Modeldata not found"));

    String storedFilePath = fileStorageService.storeFile(file);

    int versionNumber = versionRepository.countByModeldata(modeldata) + 1;

    Modeldataversion version = new Modeldataversion();
    version.setModeldata(modeldata);
    version.setVersionNumber(versionNumber);
    version.setTimestamp(LocalDateTime.now());
    version.setFilePath(storedFilePath);
    version.setDescription(description);
    version.setDimensions(dimensions);

    versionRepository.save(version);

    if (modeldata.getVersions() == null) {
        modeldata.setVersions(new ArrayList<>());
    }
    modeldata.getVersions().add(version);

    modeldata.setCurrentVersion(version);
    modeldata.setUpdatedAt(LocalDateTime.now());

    return modeldataRepository.save(modeldata);
}


    // ! DELETE MODEL DATA
    public void deleteModeldata(Long modeldataId) {
        Modeldata modeldata = modeldataRepository.findById(modeldataId)
                .orElseThrow(() -> new IllegalArgumentException("Modeldata not found"));

        List<Modeldataversion> versions = modeldata.getVersions();
        if (versions != null) {
            for (Modeldataversion version : versions) {
                String path = version.getFilePath();
                if (path != null) {
                    File file = new File(path);
                    if (file.exists() && file.isFile()) {
                        boolean deleted = file.delete();
                        if (!deleted) {
                            System.err.println("Warning: Failed to delete file " + path);
                        }
                    }
                }
            }
        }

        Appuser owner = modeldata.getAppuser();
        if (owner != null && owner.getModeldatas() != null) {
            owner.getModeldatas().remove(modeldata);
            userRepository.save(owner);
        }

        modeldataRepository.delete(modeldata);
    }

    @Transactional
    public List<Modeldata> getAllModeldata() {
        return modeldataRepository.findAll();
    }

    @Transactional
    public Optional<Modeldata> getModeldata(Long id) {
        return modeldataRepository.findById(id);
    }

    @Transactional
    public List<Modeldataversion> getVersions(Long modeldataId) {
        return versionRepository.findByModeldataIdOrderByVersionNumberDesc(modeldataId);
    }

    @Transactional
    public List<Modeldata> getModeldataByUserId(Long userId) {
        Appuser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return modeldataRepository.findByAppuserId(userId);
    }

    @Transactional
    public Modeldataversion getVersion(Long versionId) {
        return versionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found with ID: " + versionId));
    }

    // ! QA AND STATUS MANAGEMENT ACTIONS
    @Transactional
    public Modeldata markModeldataUnderScrutiny(Long modeldataId) {
        Modeldata modeldata = modeldataRepository.findById(modeldataId)
                .orElseThrow(() -> new IllegalArgumentException("Modeldata not found with ID: " + modeldataId));

        System.out.println(modeldata.getStatus() + " - current status");

        modeldata.setStatus(Status.UNDER_SCRUTINY);
        modeldata.setUpdatedAt(LocalDateTime.now());

        return modeldataRepository.save(modeldata);
    }

    @Transactional
    public Modeldata markModeldataSentBack(Long modeldataId) {
        Modeldata modeldata = modeldataRepository.findById(modeldataId)
                .orElseThrow(() -> new IllegalArgumentException("Modeldata not found with ID: " + modeldataId));

        System.out.println(modeldata.getStatus() + " - current status");

        modeldata.setStatus(Status.SENT_BACK);
        modeldata.setUpdatedAt(LocalDateTime.now());

        return modeldataRepository.save(modeldata);
    }

    @Transactional
    public Modeldata markModeldataApproved(Long modeldataId) {
        Modeldata modeldata = modeldataRepository.findById(modeldataId)
                .orElseThrow(() -> new IllegalArgumentException("Modeldata not found with ID: " + modeldataId));

        System.out.println(modeldata.getStatus() + " - current status");

        modeldata.setStatus(Status.APPROVED);
        modeldata.setUpdatedAt(LocalDateTime.now());

        return modeldataRepository.save(modeldata);
    }

    @Transactional
    public List<Modeldata> getModelsByStatus(String status) {
        Status stat = Status.valueOf(status.toUpperCase());
        return modeldataRepository.findByStatus(stat);
    }

}