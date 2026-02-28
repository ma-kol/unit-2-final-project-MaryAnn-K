package org.launchcode.boxing_mindset_backend.repositories;

import org.launchcode.boxing_mindset_backend.models.WeighIn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeighInRepository extends JpaRepository<WeighIn, Integer> {
}
