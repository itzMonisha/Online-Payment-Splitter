package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Group;
import com.examly.springapp.model.User;
import com.examly.springapp.service.GroupService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/user_groups")
@CrossOrigin(origins = "http://localhost:8081")
public class GroupController {

    @Autowired
    private GroupService groupService;

    /*
     * -----------------------------------------
     * Create Group
     * POST : /api/groups
     * -----------------------------------------
     */
    @PostMapping
    public ResponseEntity<Group> createGroup(
            @Valid @RequestBody Group group) {

        Group savedGroup = groupService.createGroup(group);

        return new ResponseEntity<>(savedGroup, HttpStatus.CREATED);
    }

    /*
     * -----------------------------------------
     * Get All Groups
     * GET : /api/groups
     * -----------------------------------------
     */
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {

        return ResponseEntity.ok(groupService.getAllGroups());
    }

    /*
     * -----------------------------------------
     * Get Group By Id
     * GET : /api/groups/{id}
     * -----------------------------------------
     */
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(
            @PathVariable Long id) {

        Group group = groupService.getGroupById(id);

        if (group == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(group);
    }

    /*
     * -----------------------------------------
     * Update Group
     * PUT : /api/groups/{id}
     * -----------------------------------------
     */
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody Group group) {

        Group updatedGroup = groupService.updateGroup(id, group);

        if (updatedGroup == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedGroup);
    }

    /*
     * -----------------------------------------
     * Delete Group
     * DELETE : /api/groups/{id}
     * -----------------------------------------
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGroup(
            @PathVariable Long id) {

        boolean deleted = groupService.deleteGroup(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Group not found");
        }

        return ResponseEntity.ok("Group deleted successfully");
    }

    /*
     * -----------------------------------------
     * Add Member
     * POST : /api/groups/{groupId}/members/{userId}
     * -----------------------------------------
     */
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<String> addMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {

        groupService.addMember(groupId, userId);

        return ResponseEntity.ok("Member added successfully");
    }

    /*
     * -----------------------------------------
     * Remove Member
     * DELETE : /api/groups/{groupId}/members/{userId}
     * -----------------------------------------
     */
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<String> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {

        groupService.removeMember(groupId, userId);

        return ResponseEntity.ok("Member removed successfully");
    }

    /*
     * -----------------------------------------
     * Get Members of Group
     * GET : /api/groups/{groupId}/members
     * -----------------------------------------
     */
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<User>> getGroupMembers(
            @PathVariable Long groupId) {

        return ResponseEntity.ok(groupService.getGroupMembers(groupId));
    }

}