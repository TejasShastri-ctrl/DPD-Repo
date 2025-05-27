package com.fluidmechanics.DPD.Repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fluidmechanics.DPD.Models.Modeldata;
import com.fluidmechanics.DPD.Models.Status;

public interface ModeldataRepository extends JpaRepository<Modeldata, Long> {

    List<Modeldata> findByAppuserId(Long userId);
    
    @Query("SELECT DISTINCT m FROM Modeldata m " +
           "LEFT JOIN FETCH m.versions v " +
           "LEFT JOIN FETCH m.currentVersion " +
           "WHERE m.appuser.id = :userId")
    List<Modeldata> findByAppuserIdWithVersions(@Param("userId") Long userId);

    List<Modeldata> findByStatus(Status status);

}
