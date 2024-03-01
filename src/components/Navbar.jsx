import React from 'react';
import { NavLink } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import { IoHomeOutline, IoLogInOutline, IoPersonAddOutline, IoAddCircleOutline, IoBarChartOutline, IoInformationCircleOutline, IoLogOutOutline, IoSearchOutline } from 'react-icons/io5';
import { FaRegPlusSquare, FaSearch } from "react-icons/fa";

const Navbar = () => {
    const { user } = useAuthValue();
    const { logout } = useAuthentication();

    return (
        <>
            <div className={styles.headerContent}>
                <NavLink to="/" className={styles.brand}>
                    <img src="../../../IF.svg" alt="" />
                    IF <span>mobile</span>
                </NavLink>
            </div>
            <nav className={styles.navbar}>
                <ul className={styles.links_list}>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <IoHomeOutline className={`${styles.icon} ${styles.activeIcon}`}/>
                        </NavLink>
                    </li>
                    {!user && (
                        <>
                            <li>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoLogInOutline className={`${styles.icon} ${styles.activeIcon}`}/>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoPersonAddOutline className={`${styles.icon} ${styles.activeIcon}`}/>
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && (
                        <>
                            <li>
                                <NavLink to="/searchpage" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoSearchOutline  className={`${styles.icon} ${styles.activeIcon}`}/> 
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/publication" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoAddCircleOutline className={`${styles.icon} ${styles.activeIcon}`} size="1.5em"/>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <IoBarChartOutline className={`${styles.icon} ${styles.activeIcon}`}/>
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li>
                        <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <IoInformationCircleOutline className={`${styles.icon} ${styles.activeIcon}`}/>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navbar;
