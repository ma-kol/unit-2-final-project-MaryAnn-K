package org.launchcode.boxing_mindset_backend.repositories;

import org.launchcode.boxing_mindset_backend.models.WeighIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeighInRepository extends JpaRepository<WeighIn, Integer> {

    Optional<WeighIn> findTopByUser_IdOrderByDateDesc(int userId);

    List<WeighIn> findByUser_IdOrderByDateDesc(int userId);

}
