package com.examly.springapp.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class GroupRequest {

    @NotBlank(message = "Group name is required")
    private String groupName;

    private String description;

    @NotNull(message = "Owner Id is required")
    private Long ownerId;

    public GroupRequest() {

    }

    public GroupRequest(String groupName,
            String description,
            Long ownerId) {

        this.groupName = groupName;
        this.description = description;
        this.ownerId = ownerId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

}