package com.examly.springapp.model;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "group_members")
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Group Id is required")
    private Long groupId;

    @NotNull(message = "User Id is required")
    private Long userId;

    private LocalDate joinedDate;

    private String roleInGroup;

    public GroupMember() {
    }

    public GroupMember(Long id,
            Long groupId,
            Long userId,
            LocalDate joinedDate,
            String roleInGroup) {
        this.id = id;
        this.groupId = groupId;
        this.userId = userId;
        this.joinedDate = joinedDate;
        this.roleInGroup = roleInGroup;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(LocalDate joinedDate) {
        this.joinedDate = joinedDate;
    }

    public String getRoleInGroup() {
        return roleInGroup;
    }

    public void setRoleInGroup(String roleInGroup) {
        this.roleInGroup = roleInGroup;
    }
}