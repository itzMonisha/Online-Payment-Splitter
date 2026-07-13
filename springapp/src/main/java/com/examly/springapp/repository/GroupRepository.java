package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Group;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByGroupNameContainingIgnoreCase(String groupName);

    List<Group> findByOwnerId(Long ownerId);

}