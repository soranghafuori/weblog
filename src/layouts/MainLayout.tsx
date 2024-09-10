import React from "react";
import styles from "@/../styles/mainlayout.module.css"
import Link from "next/link";

interface IMainLayoutProps {
    children: React.ReactNode;
  }
  const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
    
    return(
        <div className={styles.app}>
            <header className={styles.header}>
                <ul>
                    <Link href={'/'}>Home</Link>
                    <Link href={'/addpost'}>Add Post</Link>
                </ul>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <p>this task create for company <a>SAYA SKYCRAFT</a> from <a href="https://ghafuori.ir/">Soran Ghafoori</a></p>
            </footer>
        </div>
    )
  
  }  

export default MainLayout;