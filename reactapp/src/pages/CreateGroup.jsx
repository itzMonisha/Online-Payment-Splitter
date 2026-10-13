import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Users,
    Save
} from "lucide-react";

import { createGroup } from "../services/groupService";

function CreateGroup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        groupName: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error("Unable to read user:", error);
    }


    const ownerId =
        user?.id ||
        user?.userId ||
        user?.uid ||
        null;


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =====================================================
    // CREATE GROUP
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        const groupName =
            form.groupName.trim();

        const description =
            form.description.trim();


        // Validate login
        if (!ownerId) {

            setError(
                "Logged-in user was not found. Please login again."
            );

            return;
        }


        // Validate group name
        if (!groupName) {

            setError(
                "Group name is required."
            );

            return;
        }


        try {

            setLoading(true);


            const payload = {

                groupName: groupName,

                description:
                    description || "",

                ownerId: Number(ownerId)

            };


            console.log(
                "CREATE GROUP PAYLOAD:",
                payload
            );


            const createdGroup =
                await createGroup(payload);


            console.log(
                "GROUP CREATED:",
                createdGroup
            );


            setSuccess(
                "Group created successfully!"
            );


            // Navigate after creation
            setTimeout(() => {

                const groupId =
                    createdGroup?.id ||
                    createdGroup?.groupId;

                if (groupId) {

                    navigate(
                        `/groups/${groupId}`
                    );

                } else {

                    navigate("/groups");

                }

            }, 500);


        } catch (error) {

            console.error(
                "CREATE GROUP ERROR:",
                error
            );


            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data ||
                error?.message ||
                "Unable to create group.";


            setError(
                typeof message === "object"
                    ? JSON.stringify(message)
                    : String(message)
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="create-group-page">

            {/* HEADER */}

            <div className="create-group-header">

                <div className="create-group-title-area">

                    <div className="create-group-icon">
                        <Users size={26} />
                    </div>

                    <div>

                        <p className="page-eyebrow">
                            GROUP MANAGEMENT
                        </p>

                        <h1>
                            Create Group
                        </h1>

                        <p>
                            Create a group for shared expenses.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate("/groups")
                    }
                    disabled={loading}
                >
                    <ArrowLeft size={17} />
                    Back to Groups
                </button>

            </div>


            {/* FORM CARD */}

            <div className="create-group-card">

                <div className="create-group-card-icon">
                    <Users size={25} />
                </div>

                <h2>
                    Group Details
                </h2>

                <p className="create-group-description">
                    Enter the details for your new expense group.
                </p>


                {/* ERROR */}

                {error && (

                    <div className="create-group-error">

                        <strong>
                            Unable to create group
                        </strong>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="create-group-success">
                        {success}
                    </div>

                )}


                <form
                    className="create-group-form"
                    onSubmit={handleSubmit}
                >

                    {/* GROUP NAME */}

                    <div className="create-form-group">

                        <label htmlFor="groupName">
                            Group Name
                            <span className="required">
                                *
                            </span>
                        </label>

                        <input
                            id="groupName"
                            name="groupName"
                            type="text"
                            value={form.groupName}
                            onChange={handleChange}
                            placeholder="Example: College Friends"
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="create-form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Example: Trip, food and travel expenses"
                            rows={5}
                            disabled={loading}
                        />

                    </div>


                    {/* OWNER */}

                    <div className="create-form-group">

                        <label htmlFor="ownerId">
                            Owner ID
                        </label>

                        <input
                            id="ownerId"
                            type="text"
                            value={ownerId || ""}
                            readOnly
                        />

                        <small>
                            This is automatically assigned to the logged-in user.
                        </small>

                    </div>


                    {/* OWNER NAME */}

                    <div className="create-form-group">

                        <label>
                            Group Owner
                        </label>

                        <input
                            type="text"
                            value={
                                user?.name ||
                                user?.username ||
                                "Current User"
                            }
                            readOnly
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className="create-group-actions">

                        <button
                            type="button"
                            className="cancel-group-button"
                            onClick={() =>
                                navigate("/groups")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="create-group-button"
                            disabled={loading}
                        >

                            <Save size={17} />

                            {loading
                                ? "Creating..."
                                : "Create Group"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default CreateGroup;