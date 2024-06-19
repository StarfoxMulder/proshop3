import React from 'react'
import { Container } from 'react-bootstrap'
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <h2>Welcome to ProShop</h2>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  )
};

export default App
