import React from 'react';
import { NavLink } from 'react-router-dom';
import { HandHeart } from 'lucide-react';
import { useLang } from '../lib/lang.js';
import styles from './HeaderDonateButton.module.css';

export default function HeaderDonateButton() {
  const { t } = useLang();
  return (
    <NavLink to="/donate" className={({ isActive }) => `${styles.btn} ${isActive ? styles.active : ''}`}>
      <HandHeart size={17} aria-hidden="true" />
      <span className={styles.label}>{t.navDonate}</span>
    </NavLink>
  );
}
