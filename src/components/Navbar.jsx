import React from 'react';
import { NavLink } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuthValue } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import { IoHomeOutline, IoLogInOutline, IoPersonAddOutline, IoAddCircleOutline, IoBarChartOutline, IoInformationCircleOutline, IoLogOutOutline, IoSearchOutline } from 'react-icons/io5';
import { FaRegPlusSquare, FaSearch } from "react-icons/fa";
import { FiHome, FiLogIn,FiSearch, FiUser } from "react-icons/fi";
import { GoPlus } from "react-icons/go";

const Navbar = () => {
    const { user } = useAuthValue();
    const { logout } = useAuthentication();

    return (
        <>
            <div className={styles.headerContent}>
                <NavLink to="/" className={styles.brand}>
                    <img src="../../public/IF.svg" alt="" />
                </NavLink>
            </div>
            <nav className={styles.navbar}>
                <ul className={styles.links_list}>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
                            <FiHome className={`${styles.icon} ${styles.activeIcon}`}/>
                        </NavLink>
                    </li>
                    {!user && (
                        <>
                            <li>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <FiLogIn className={`${styles.icon} ${styles.activeIcon}`}/>
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
                                    <FiSearch  className={`${styles.icon} ${styles.activeIcon}`}/> 
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/publication" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <GoPlus className={`${styles.iconAddCircle} ${styles.activeIcon}`} size="1.5em"/>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : "")}>
                                    <FiUser className={`${styles.icon} ${styles.activeIcon}`}/>
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
