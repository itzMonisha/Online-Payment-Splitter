package com.examly.springapp.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Group;
import com.examly.springapp.model.GroupMember;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.GroupMemberRepository;
import com.examly.springapp.repository.GroupRepository;
import com.examly.springapp.repository.UserRepository;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private UserRepository userRepository;

    /*
     * Create Group
     */
    public Group createGroup(Group group) {

        if (group.getCreatedDate() == null) {
            group.setCreatedDate(LocalDate.now());
        }

        return groupRepository.save(group);
    }

    /*
     * Get All Groups
     */
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    /*
     * Get Group By Id
     */
    public Group getGroupById(Long id) {

        Optional<Group> optional = groupRepository.findById(id);

        return optional.orElse(null);
    }

    /*
     * Update Group
     */
    public Group updateGroup(Long id, Group group) {

        Optional<Group> optional = groupRepository.findById(id);

        if (optional.isPresent()) {

            Group existing = optional.get();

            existing.setGroupName(group.getGroupName());
            existing.setDescription(group.getDescription());
            existing.setOwnerId(group.getOwnerId());

            return groupRepository.save(existing);
        }

        return null;
    }

    /*
     * Delete Group
     */
    public boolean deleteGroup(Long id) {

        if (groupRepository.existsById(id)) {

            groupRepository.deleteById(id);

            return true;
        }

        return false;
    }

    /*
     * Add Member
     */
    public void addMember(Long groupId, Long userId) {

        GroupMember member = new GroupMember();

        member.setGroupId(groupId);
        member.setUserId(userId);
        member.setJoinedDate(LocalDate.now());
        member.setRoleInGroup("MEMBER");

        groupMemberRepository.save(member);

    }

    /*
     * Remove Member
     */
    public void removeMember(Long groupId, Long userId) {

        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);

    }

    /*
     * Get Members Of Group
     */
    public List<User> getGroupMembers(Long groupId) {

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);

        List<User> users = new ArrayList<>();

        for (GroupMember member : members) {

            Optional<User> user = userRepository.findById(member.getUserId());

            user.ifPresent(users::add);
        }

        return users;
    }

}