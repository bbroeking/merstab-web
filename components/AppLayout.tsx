import React from 'react'
import { Layout } from 'antd';
import styles from '../styles/AppLayout.module.css'
import NavBar from './NavBar';

const { Header, Content, Footer } = Layout;

const AppLayout = ({children = undefined as any}) => {
    return (
        <Layout>
            <Header className={styles.header}>
                <NavBar></NavBar>
            </Header>
            <Content style={{ overflow: 'scroll', paddingBottom: 50 }}>
                {children}
            </Content>
            <Footer>Footer</Footer>
        </Layout>
    )
};

export default AppLayout