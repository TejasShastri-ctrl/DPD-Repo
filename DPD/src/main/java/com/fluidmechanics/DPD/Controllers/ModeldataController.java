package com.fluidmechanics.DPD.Controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.fluidmechanics.DPD.Models.Modeldata;
import com.fluidmechanics.DPD.Models.Modeldataversion;
import com.fluidmechanics.DPD.Repos.ModeldataRepository;
import com.fluidmechanics.DPD.Repos.ModeldataVersionRepository;
import com.fluidmechanics.DPD.Services.FileStorageService;
import com.fluidmechanics.DPD.Services.ModeldataService;

import ch.qos.logback.core.model.Model;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/modeldata")
@RequiredArgsConstructor
public class ModeldataController {

    private final ModeldataService modeldataService;
    private final ModeldataVersionRepository modeldataVersionRepository;
    private final FileStorageService fileStorageService;
    private final ModeldataRepository modeldataRepository;

    // ! Create new model
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createNewModel(
            @RequestParam Long userId,
            @RequestParam String name,
            @RequestParam String type,
            @RequestParam String description,
            @RequestPart("file") MultipartFile file) {
        try {
            Modeldata created = modeldataService.createNewModel(userId, name, type, description, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating model: " + e.getMessage());
        }
    }

    // ! Add new version to existing Modeldata with file upload
    @PostMapping(value = "/{modeldataId}/versions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addNewVersion(
            @PathVariable Long modeldataId,
            @RequestPart("file") MultipartFile file,
            @RequestPart("description") String description,
            @RequestPart("dimensions") String dimensions) {
        try {
            Modeldata updatedModel = modeldataService.addNewVersion(modeldataId, file, description, dimensions);
            return ResponseEntity.ok(updatedModel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding new version: " + e.getMessage());
        }
    }

    // ! Get all Modeldata
    @GetMapping
    public ResponseEntity<List<Modeldata>> getAllModeldata() {
        List<Modeldata> allModels = modeldataService.getAllModeldata();
        return ResponseEntity.ok(allModels);
    }

    // ! Get single Modeldata by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getModeldata(@PathVariable Long id) {
        return modeldataService.getModeldata(id)
                .<ResponseEntity<Object>>map(modeldata -> ResponseEntity.ok(modeldata))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Modeldata with ID " + id + " not found"));
    }

    // ! Get all versions for a specific Modeldata
    @GetMapping("/{id}/versions")
    public ResponseEntity<List<Modeldataversion>> getVersions(@PathVariable("id") Long modeldataId) {
        List<Modeldataversion> versions = modeldataService.getVersions(modeldataId);
        return ResponseEntity.ok(versions);
    }

    // ! Delete a Modeldata (and cascade delete versions & files)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModeldata(@PathVariable Long id) {
        try {
            modeldataService.deleteModeldata(id);
            return ResponseEntity.ok("Modeldata deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting Modeldata: " + e.getMessage());
        }
    }

    // ! Get all Modeldata for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getModeldataByUserId(@PathVariable Long userId) {
        try {
            List<Modeldata> userModels = modeldataService.getModeldataByUserId(userId);
            return ResponseEntity.ok(userModels);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching modeldata: " + e.getMessage());
        }
    }

    @GetMapping("/versions/{versionId}/download")
    public ResponseEntity<Resource> downloadVersionFile(@PathVariable Long versionId) {
        try {
            Modeldataversion version = modeldataService.getVersion(versionId);
            if (version == null || version.getFilePath() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Path filePath = Paths.get(version.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filePath.getFileName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // QA REMARKS DOWNLOADER
    @GetMapping("/versions/{versionId}/downloadQA")
    public ResponseEntity<Resource> downloadQAFile(@PathVariable Long versionId) {
        try {
            Modeldataversion version = modeldataService.getVersion(versionId);
            if (version == null || version.getQAFilePath() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Path filePath = Paths.get(version.getQAFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

            String filename = filePath.getFileName().toString();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF) // Assuming QA files are PDFs
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ! QA AND STATUS MANAGEMENT ACTIONS
    @PutMapping("/{id}/under-scrutiny")
    public ResponseEntity<String> markUnderScrutiny(@PathVariable Long id) {
        modeldataService.markModeldataUnderScrutiny(id);
        return ResponseEntity.ok("Modeldata marked as UNDER_SCRUTINY");
    }

    @PutMapping("/{id}/sent-back")
    public ResponseEntity<String> markSentBack(@PathVariable Long id) {
        modeldataService.markModeldataSentBack(id);
        return ResponseEntity.ok("Modeldata marked as SENT_BACK");
    }

    @PutMapping("/{id}/approved")
    public ResponseEntity<String> markApproved(@PathVariable Long id) {
        modeldataService.markModeldataApproved(id);
        return ResponseEntity.ok("Modeldata marked as APPROVED");
    }

    @GetMapping("/under-scrutiny")
    public ResponseEntity<List<Modeldata>> getModeldataUnderScrutiny() {
        List<Modeldata> underScrutinyModels = modeldataService.getModelsByStatus("UNDER_SCRUTINY");
        return ResponseEntity.ok(underScrutinyModels);
    }

    @PutMapping("/versions/{versionId}/reject")
    public ResponseEntity<?> rejectModelVersion(
            @PathVariable Long versionId,
            @RequestParam("modeldataId") Long modeldataId,
            @RequestParam("remarks") String remarks,
            @RequestParam("file") MultipartFile file) throws IOException {

        String qaFilePath = fileStorageService.storeFile(file);
        System.out.println("QA file stored at: " + qaFilePath);

        Modeldata modeldata = modeldataRepository.findById(modeldataId)
                .orElseThrow(() -> new RuntimeException("Modeldata not found"));

        Modeldataversion currentVersion = modeldata.getCurrentVersion();
        if (currentVersion == null) {
            throw new RuntimeException("Current version not found for modeldata id: " + modeldataId);
        }

        currentVersion.setQARemarks(remarks);
        currentVersion.setQAFilePath(qaFilePath);

        modeldataVersionRepository.save(currentVersion);

        markSentBack(modeldataId);

        return ResponseEntity.ok().build();
    }

}