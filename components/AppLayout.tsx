import React from 'react'
import { Layout } from 'antd';
import NavBar from './NavBar';
import AppFooter from './AppFooter';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children = undefined as any }) => {
    return (
        <Layout style={{ overflow: 'scroll'}}>
            <Header>
                <NavBar></NavBar>
            </Header>
            <Content>
                {children}
            </Content>
            <Footer>
                <AppFooter></AppFooter>
            </Footer>
        </Layout>
    )
};

export default AppLayout