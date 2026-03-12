package org.launchcode.boxing_mindset_backend.repositories;

import org.launchcode.boxing_mindset_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}
