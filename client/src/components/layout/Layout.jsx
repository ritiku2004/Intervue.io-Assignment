import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;