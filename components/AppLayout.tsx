import React from 'react'
import { Layout } from 'antd';
import NavBar from './NavBar';
import AppFooter from './AppFooter';
import styles from "../styles/AppLayout.module.css";

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children = undefined as any }) => {
    return (
        <Layout style={{ overflow: 'scroll', display: 'flex', minHeight: '100vh', flexDirection: 'column', zIndex: 2}}>
            <Header className={styles.content} style={{ flexGrow: 0 }}>
                <NavBar></NavBar>
            </Header>
            <Content className={styles.content} style={{ flexGrow: 1 }}>
                {children}
            </Content>
            <Footer className={styles.content} style={{ flexGrow: 0 }}>
                <AppFooter></AppFooter>
            </Footer>
        </Layout>
    )
};

export default AppLayout