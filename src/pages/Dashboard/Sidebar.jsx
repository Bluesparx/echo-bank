import React, { useState } from "react";
import {FaUserAlt, FaMoneyBillAlt} from "react-icons/fa";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarContent,
} from "react-pro-sidebar";
import {
    FiArrowLeftCircle,
    FiArrowRightCircle,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";

function Sidebar({ rtl }) {
    const [menuCollapse, setMenuCollapse] = useState(false);
    const [handleToggleSidebar] = useState(false);
    const [toggled] = useState();

    const headerStyle = {
        padding: '20px',
        letterSpacing: "1px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        backgroundColor: "#fff",
        transition: "all 0.3s linear"
    };

    const menuIconClick = () => {
        setMenuCollapse(!menuCollapse);
    };

    return (
        <div className="sidebar">
            <ProSidebar
                collapsed={menuCollapse}
                rtl={rtl}
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
            >
                <SidebarHeader style={headerStyle}>
                    <div className="logotext">
                        {menuCollapse ? (
                            <FiArrowRightCircle className="fs-3 d-md-block d-none" onClick={menuIconClick} />
                        ) : (
                            <div className="d-flex justify-content-between">
                                <p className="text-primary fs-5 fw-bold">Dashboard</p>
                                <p><FiArrowLeftCircle className="fs-3 d-md-block d-none" onClick={menuIconClick} /></p>
                            </div>
                        )}
                    </div>
                </SidebarHeader>
                <SidebarContent className="bg-white">
                    <Menu iconShape="circle">
                        <MenuItem icon={<MdDashboard />}>
                            <Link to="/dashboard">Dashboard</Link>
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="circle">
                        <MenuItem icon={<FaUserAlt />}>
                            <Link to="/dashboard/viewAccounts">Accounts</Link>
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="circle">
                        <MenuItem icon={<FaMoneyBillAlt />}>
                            <Link to="/dashboard/viewTransactions">Transactions</Link>
                        </MenuItem>
                    </Menu>
                </SidebarContent>
            </ProSidebar>
        </div>
    );
}

export default Sidebar; 