import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { NavbarDU } from './components/ui/Navbar';
import { Auth } from './pages/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Home } from './pages/Home';
import SignupPage from './pages/SignupPage';
import { RecoverPassword } from './components/auth/RecoverPassword';
import Footer from './components/ui/Footer';
import ResetPassword from './components/auth/ResetPassword';
import InstitutionalInfo from './components/ui/menu/InstitutionalInfo';
import ContactForm from './components/ui/menu/ContactForm';
import Categories from './components/crud/categories/Categories';
import SubCategories from './components/crud/categories/SubCategories';
import { ProductsForm } from './components/crud/products/productsForm';
import Catalogue from './components/ui/catalogue/Catalogue';
import { OneProduct } from './components/ui/products/OneProduct';
import Cart from './components/ui/cart/Cart';
import StepperOrder from './components/ui/order/Stepper';
import { CssBaseline } from '@material-ui/core';
import Discount from './components/crud/discountcode/Discount';

function App() {
  const [tokenJWT, settokenJWT] = useState('')

  //consultarAPI();
  //un poco de react rout, basicamente es un pinche switch. Cada route es una ruta que se genera cuando se va a ese lugar
  //realmente las url no existen en react, por lo cual se evita el problema del 404. Si vos le erras, siempre te va a llegar al home.
  return (
    <>
    <CssBaseline />
    <Router>
        <NavbarDU/>
        <Switch>
          <Route exact strict path="/">
            <Home tokenJWT={tokenJWT} />
          </Route>
          <Route exact strict path="/Login">
            <Auth settokenJWT={settokenJWT} />
          </Route>
          <Route exact strict path="/signup">
            <SignupPage />
          </Route>
          <Route exact strict path="/recoverpw">
            <RecoverPassword />
          </Route>
          <Route exact strict path="/resetpw/:iduser">
            <ResetPassword />
          </Route>
          <Route exact strict path="/us">
            <InstitutionalInfo />
          </Route>
          <Route exact strict path="/contact">
            <ContactForm />
          </Route>
          <Route exact strict path="/admin/categories">
            <Categories />
          </Route>
          <Route exact strict path="/admin/subcategories">
            <SubCategories />
          </Route>
          <Route exact strict path="/admin/products">
            <ProductsForm/>
          </Route>
          <Route exact strict path="/admin/products/:id">
            <ProductsForm/>
          </Route>
          <Route exact strict path="/admin/discounts">
            <Discount/>
          </Route>
          <Route exact strict path="/catalogue">
            <Catalogue />
          </Route>
          <Route exact stric path="/product/:idproduct">
            <OneProduct/>
          </Route>
          <Route exact stric path="/cart">
            <Cart />
          </Route>
          <Route exact stric path="/order">
            <StepperOrder />
          </Route>
        </Switch>
        {/* <Redirect from="*" to="/"/> */}
        <Footer />
      </Router>
    </>
  );
}

export default App;
