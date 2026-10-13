import React, {
    useEffect,
    useState
} from "react";

import {
    UserCircle,
    Mail,
    ShieldCheck,
    CheckCircle,
    Edit3,
    Save,
    X
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import "./Profile.css";


function Profile() {

    const [user, setUser] = useState(null);

    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: ""
    });

    const [message, setMessage] = useState("");


    // =====================================================
    // LOAD USER
    // =====================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

                setForm({
                    name:
                        parsedUser?.name ||
                        parsedUser?.username ||
                        "",

                    email:
                        parsedUser?.email ||
                        ""
                });

            }

        } catch (error) {

            console.error(
                "Unable to load user:",
                error
            );

        }

    }, []);


    // =====================================================
    // USER DETAILS
    // =====================================================

    const userName =
        user?.name ||
        user?.username ||
        "User";


    const userEmail =
        user?.email ||
        "";


    const userRole =
        String(
            user?.role ||
            localStorage.getItem("role") ||
            "USER"
        )
            .toUpperCase()
            .trim();


    const userId =
        user?.id ||
        "—";


    const initial =
        userName
            .charAt(0)
            .toUpperCase();


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {

        setMessage("");

        setForm({
            name:
                user?.name ||
                user?.username ||
                "",

            email:
                user?.email ||
                ""
        });

        setEditing(true);

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        setForm({
            name:
                user?.name ||
                user?.username ||
                "",

            email:
                user?.email ||
                ""
        });

        setEditing(false);

        setMessage("");

    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSave = () => {

        const updatedUser = {
            ...user,
            name: form.name,
            username: form.name,
            email: form.email
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);

        setEditing(false);

        setMessage(
            "Profile updated successfully."
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="app-layout">


            {/* =================================================
                SIDEBAR
                ================================================= */}

            <Sidebar />


            {/* =================================================
                MAIN CONTENT
                ================================================= */}

            <main className="main-content">


                <div className="profile-page">


                    {/* =================================================
                        PAGE HEADER
                        ================================================= */}

                    <div className="profile-header">

                        <div>

                            <p className="profile-eyebrow">
                                ACCOUNT
                            </p>

                            <h1>
                                My Profile
                            </h1>

                            <p className="profile-subtitle">
                                View and manage your personal account
                                information.
                            </p>

                        </div>


                        {!editing ? (

                            <button
                                type="button"
                                className="profile-edit-button"
                                onClick={handleEdit}
                            >

                                <Edit3 size={17} />

                                Edit Profile

                            </button>

                        ) : (

                            <div className="profile-header-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-button"
                                    onClick={handleCancel}
                                >

                                    <X size={17} />

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    className="profile-save-button"
                                    onClick={handleSave}
                                >

                                    <Save size={17} />

                                    Save Changes

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        SUCCESS MESSAGE
                        ================================================= */}

                    {message && (

                        <div className="profile-success">

                            <CheckCircle size={18} />

                            <span>
                                {message}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        PROFILE GRID
                        ================================================= */}

                    <div className="profile-grid">


                        {/* =================================================
                            LEFT CARD
                            ================================================= */}

                        <section className="profile-main-card">


                            {/* PROFILE IDENTITY */}

                            <div className="profile-identity">

                                <div className="profile-avatar">

                                    {initial}

                                </div>


                                <div className="profile-identity-info">

                                    <h2>
                                        {userName}
                                    </h2>

                                    <p>
                                        {userEmail}
                                    </p>


                                    <span className="profile-role-badge">

                                        <ShieldCheck
                                            size={14}
                                        />

                                        {userRole}

                                    </span>

                                </div>

                            </div>


                            {/* DIVIDER */}

                            <div className="profile-divider" />


                            {/* =================================================
                                PERSONAL INFORMATION
                                ================================================= */}

                            <div className="profile-section">

                                <div className="profile-section-heading">

                                    <div className="profile-section-icon">

                                        <UserCircle
                                            size={19}
                                        />

                                    </div>

                                    <div>

                                        <h3>
                                            Personal Information
                                        </h3>

                                        <p>
                                            Your basic account details
                                        </p>

                                    </div>

                                </div>


                                <div className="profile-fields">


                                    {/* NAME */}

                                    <div className="profile-field">

                                        <label>
                                            Full Name
                                        </label>

                                        {editing ? (

                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your name"
                                            />

                                        ) : (

                                            <div className="profile-value">
                                                {userName}
                                            </div>

                                        )}

                                    </div>


                                    {/* EMAIL */}

                                    <div className="profile-field">

                                        <label>
                                            Email Address
                                        </label>

                                        {editing ? (

                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your email"
                                            />

                                        ) : (

                                            <div className="profile-value">

                                                <Mail
                                                    size={16}
                                                />

                                                {userEmail}

                                            </div>

                                        )}

                                    </div>


                                </div>

                            </div>


                            {/* =================================================
                                ACCOUNT INFORMATION
                                ================================================= */}

                            <div className="profile-section">


                                <div className="profile-section-heading">

                                    <div className="profile-section-icon">

                                        <ShieldCheck
                                            size={19}
                                        />

                                    </div>

                                    <div>

                                        <h3>
                                            Account Information
                                        </h3>

                                        <p>
                                            Your SplitPay account details
                                        </p>

                                    </div>

                                </div>


                                <div className="account-info-grid">


                                    <div className="account-info-item">

                                        <span>
                                            USER ID
                                        </span>

                                        <strong>
                                            #{userId}
                                        </strong>

                                    </div>


                                    <div className="account-info-item">

                                        <span>
                                            ACCOUNT ROLE
                                        </span>

                                        <strong>
                                            {userRole}
                                        </strong>

                                    </div>


                                    <div className="account-info-item">

                                        <span>
                                            ACCOUNT STATUS
                                        </span>

                                        <strong className="status-active">

                                            <span className="status-dot" />

                                            Active

                                        </strong>

                                    </div>


                                    <div className="account-info-item">

                                        <span>
                                            MEMBER SINCE
                                        </span>

                                        <strong>
                                            Available in account
                                        </strong>

                                    </div>


                                </div>

                            </div>


                        </section>


                        {/* =================================================
                            RIGHT COLUMN
                            ================================================= */}

                        <aside className="profile-side-column">


                            {/* ACCOUNT STATUS */}

                            <div className="profile-side-card">

                                <div className="side-card-icon green">

                                    <CheckCircle size={21} />

                                </div>

                                <h3>
                                    Account Status
                                </h3>

                                <p>
                                    Your account is currently
                                    active and ready to use.
                                </p>


                                <div className="side-status">

                                    <span className="status-dot" />

                                    Active

                                </div>

                            </div>


                            {/* SECURITY */}

                            <div className="profile-side-card">

                                <div className="side-card-icon purple">

                                    <ShieldCheck size={21} />

                                </div>

                                <h3>
                                    Security
                                </h3>

                                <p>
                                    Your account is protected
                                    with password authentication.
                                </p>


                                <div className="security-row">

                                    <span>
                                        Password
                                    </span>

                                    <strong>
                                        Protected
                                    </strong>

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="profile-side-card">

                                <div className="side-card-icon blue">

                                    <Mail size={21} />

                                </div>

                                <h3>
                                    Email
                                </h3>

                                <p>
                                    Your registered email address.
                                </p>


                                <div className="email-display">

                                    {userEmail}

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="profile-side-card">

                                <div className="side-card-icon orange">

                                    <UserCircle size={21} />

                                </div>

                                <h3>
                                    Account Role
                                </h3>

                                <p>
                                    Your permissions are controlled
                                    by your account role.
                                </p>


                                <div className="role-display">

                                    {userRole}

                                </div>

                            </div>


                        </aside>


                    </div>

                </div>

            </main>

        </div>

    );

}


export default Profile;