package com.fluidmechanics.DPD.Repos;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fluidmechanics.DPD.Models.Modeldata;
import com.fluidmechanics.DPD.Models.Modeldataversion;

import java.util.List;
import java.util.Optional;

public interface ModeldataVersionRepository extends JpaRepository<Modeldataversion, Long> {
    List<Modeldataversion> findByModeldataIdOrderByVersionNumberDesc(Long modeldataId);
    Optional<Modeldataversion> findByModeldataIdAndVersionNumber(Long modeldataId, int versionNumber);
    int countByModeldata(Modeldata modeldata);
}
