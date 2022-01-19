import React from 'react'
import { Layout } from 'antd';
import styles from '../styles/AppLayout.module.css'
import NavBar from './NavBar';
import AppFooter from './AppFooter';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children = undefined as any }) => {
    return (
        <Layout>
            <Header className={styles.header}>
                <NavBar></NavBar>
            </Header>
            <Content style={{ overflow: 'scroll', paddingBottom: 50 }}>
                {children}
            </Content>
            <Footer>
                <AppFooter></AppFooter>
            </Footer>
        </Layout>
    )
};

export default AppLayout