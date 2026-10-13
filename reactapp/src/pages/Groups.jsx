import React, { useEffect, useState } from "react";

import {
  Users,
  Search,
  Plus,
  ArrowRight,
  UserRound
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    getGroups,
    getGroupsByUser
} from "../services/groupService";

import UserSidebar from "../components/UserSidebar";

import "./UserGroups.css";


function UserGroups() {

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD PERSONALIZED GROUPS
  // =====================================================

const loadGroups = async () => {

    try {

        setLoading(true);
        setError("");

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            setError(
                "User session not found. Please login again."
            );

            setGroups([]);

            return;
        }

        const loggedInUser =
            JSON.parse(storedUser);

        const userId =
            loggedInUser?.id ||
            loggedInUser?.userId;

        const role = String(
            loggedInUser?.role ||
            loggedInUser?.userRole ||
            localStorage.getItem("role") ||
            "USER"
        )
            .trim()
            .toUpperCase();

        const isAdmin =
            role === "ADMIN";


        /*
        =================================================
        ADMIN
        =================================================

        Admin gets EVERY group in SplitPay.
        */

        let data;

        if (isAdmin) {

            console.log(
                "ADMIN: Loading ALL groups"
            );

            data = await getGroups();

        }

        /*
        =================================================
        USER
        =================================================

        Normal user gets ONLY their groups.
        */

        else {

            if (!userId) {

                setError(
                    "User ID not found. Please login again."
                );

                setGroups([]);

                return;
            }

            console.log(
                "USER: Loading groups for:",
                userId
            );

            data =
                await getGroupsByUser(
                    Number(userId)
                );
        }


        setGroups(
            Array.isArray(data)
                ? data
                : []
        );

    } catch (error) {

        console.error(
            "GROUP LOAD ERROR:",
            error
        );

        setError(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Unable to load groups."
        );

        setGroups([]);

    } finally {

        setLoading(false);
    }
};


  useEffect(() => {

    loadGroups();

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredGroups =
    groups.filter((group) => {

      const name =
        group.groupName ||
        group.name ||
        "";

      const description =
        group.description ||
        "";

      const keyword =
        search.toLowerCase();

      return (
        name
          .toLowerCase()
          .includes(keyword) ||

        description
          .toLowerCase()
          .includes(keyword)
      );

    });


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="user-app-layout">

      {/* SIDEBAR */}

      <UserSidebar />


      {/* MAIN CONTENT */}

      <main className="user-groups-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="user-groups-header">

          <div>

            <p className="user-groups-eyebrow">
              GROUP MANAGEMENT
            </p>

            <h1>
              My Groups
            </h1>

            <p>
              Manage your shared expense groups
              and keep everything organized in one place.
            </p>

          </div>


          <button
            className="user-groups-create"
            onClick={() =>
              navigate("/groups/create")
            }
          >

            <Plus size={18} />

            Create Group

          </button>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="user-groups-summary">

          <div className="user-groups-summary-icon">

            <Users size={22} />

          </div>


          <div>

            <span>
              My Groups
            </span>

            <strong>
              {groups.length}
            </strong>

            <small>
              Groups you're currently involved in
            </small>

          </div>


          <div className="user-groups-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search your groups..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </section>


        {/* =================================================
            GROUP SECTION
        ================================================= */}

        <section className="user-groups-section">

          <div className="user-groups-section-header">

            <div>

              <h2>
                Your Groups
              </h2>

              <p>
                {filteredGroups.length}{" "}
                {filteredGroups.length === 1
                  ? "group"
                  : "groups"}{" "}
                available
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/groups/create")
              }
              className="new-group-link"
            >

              <Plus size={16} />

              New Group

            </button>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="groups-state">

              <div className="loading-spinner"></div>

              <h3>
                Loading your groups...
              </h3>

              <p>
                Please wait while we fetch your groups.
              </p>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (

            <div className="groups-state error-state">

              <Users size={35} />

              <h3>
                Unable to load groups
              </h3>

              <p>
                {error}
              </p>

              <button
                onClick={loadGroups}
              >
                Try Again
              </button>

            </div>

          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            filteredGroups.length === 0 && (

              <div className="groups-state">

                <div className="empty-group-icon">

                  <Users size={32} />

                </div>

                <h3>
                  No groups yet
                </h3>

                <p>
                  You are not part of any groups yet.
                </p>

                <button
                  onClick={() =>
                    navigate("/groups/create")
                  }
                >

                  <Plus size={17} />

                  Create Group

                </button>

              </div>

            )}


          {/* =================================================
              GROUP GRID
          ================================================= */}

          {!loading &&
            !error &&
            filteredGroups.length > 0 && (

              <div className="user-groups-grid">

                {filteredGroups.map(
                  (group) => {

                    const groupName =
                      group.groupName ||
                      group.name ||
                      "Unnamed Group";

                    const description =
                      group.description ||
                      "Shared expense group";

                    return (

                      <div
                        className="user-group-card"
                        key={group.id}
                      >

                        {/* TOP */}

                        <div className="user-group-card-top">

                          <div className="group-letter">

                            {groupName
                              .charAt(0)
                              .toUpperCase()}

                          </div>


                          <button
                            className="group-arrow"
                            onClick={() =>
                              navigate(
                                `/groups/${group.id}`
                              )
                            }
                          >

                            <ArrowRight size={19} />

                          </button>

                        </div>


                        {/* CONTENT */}

                        <h3>
                          {groupName}
                        </h3>

                        <p>
                          {description}
                        </p>


                        {/* FOOTER */}

                        <div className="user-group-card-footer">

                          <div className="group-members">

                            <UserRound size={15} />

                            <span>
                              View members
                            </span>

                          </div>


                          <button
                            className="view-group-button"
                            onClick={() =>
                              navigate(
                                `/groups/${group.id}`
                              )
                            }
                          >
                            View Group
                          </button>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

        </section>

      </main>

    </div>

  );

}

export default UserGroups;