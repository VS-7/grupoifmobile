import React from 'react';
import { NavLink } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import { IoHomeOutline, IoLogInOutline, IoPersonAddOutline, IoCreateOutline, IoBarChartOutline, IoInformationCircleOutline, IoLogOutOutline } from 'react-icons/io5';

const Navbar = () => {
    const { user } = useAuthValue();
    const { logout } = useAuthentication();

    return (
        <>
            <div className={styles.headerContent}>
                <NavLink to="/" className={styles.brand}>
                    IF <span>Mobile</span>
                </NavLink>
                {user && (
                    <button onClick={logout} className={styles.logoutButton}>
                        <IoLogOutOutline /> Sair
                    </button>
                )}
            </div>
            <nav className={styles.navbar}>
                <ul className={styles.links_list}>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <IoHomeOutline className={styles.icon}/>
                        </NavLink>
                    </li>
                    {!user && (
                        <>
                            <li>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoLogInOutline className={styles.icon}/>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoPersonAddOutline className={styles.icon}/>
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && (
                        <>
                            <li>
                                <NavLink to="/posts/create" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoCreateOutline className={styles.icon}/>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoBarChartOutline className={styles.icon}/>
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li>
                        <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <IoInformationCircleOutline className={styles.icon}/>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navbar;
