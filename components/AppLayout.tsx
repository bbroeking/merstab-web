import React from 'react'
import { Layout } from 'antd';
import NavBar from './NavBar';
import AppFooter from './AppFooter';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children = undefined as any }) => {
    return (
        <Layout style={{ overflow: 'scroll', display: 'flex', minHeight: '100vh', flexDirection: 'column'}}>
            <Header style={{ flexGrow: 0 }}>
                <NavBar></NavBar>
            </Header>
            <Content style={{ flexGrow: 1 }}>
                {children}
            </Content>
            <Footer style={{ flexGrow: 0 }}>
                <AppFooter></AppFooter>
            </Footer>
        </Layout>
    )
};

export default AppLayout