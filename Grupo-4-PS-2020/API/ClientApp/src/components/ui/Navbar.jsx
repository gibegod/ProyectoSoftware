import React from "react";
import { useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { Nav, NavDropdown } from "react-bootstrap";
import "../../index.css";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";

export const NavbarDU = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
      <Navbar style={{ backgroundColor: "#25A18E" }}>
        <Navbar.Brand
          onClick={(e) => {
            e.preventDefault();
            history.push("/");
          }}
          style={{cursor: "pointer"}}
        >
          <img
            src="https://www.nicepng.com/png/full/338-3384104_logo-replikat-innovacion-imagen-negro-transparente-logos-con.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          ></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link
              onClick={(e) => {
                e.preventDefault();
                history.push("/");
              }}
            >
              Deporte Online
            </Nav.Link>
            <NavDropdown title="Menú" id="basic-nav-dropdown">
              <NavDropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/catalogue");
                }}
              >
                Catálogo
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/us");
                }}
              >
                Nosotros
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/contact");
                }}
              >
                Contacto
              </NavDropdown.Item>
            </NavDropdown>

            {(token !== null) && (role === "ROLE_ADMIN") ? (
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/admin/categories");
                  }}
                >
                  Categoria
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/admin/subcategories");
                  }}
                >
                  Subcategoria
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/admin/products");
                  }}
                >
                  Producto
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/admin/discounts");
                  }}
                >
                  Descuentos
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          <Navbar.Brand
            style={{
              color: "#0E141B",
              cursor: "pointer",
              paddingRight: "10px",
            }}
            onClick={(e) => {
              e.preventDefault();
              history.replace("/cart");
            }}
          >
            <ShoppingCartOutlinedIcon fontSize="large" />
          </Navbar.Brand>
          {token === null ? (
            <>
              <Navbar.Brand
                style={{ color: "#0E141B", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/Login");
                }}
              >
                Ingresar
              </Navbar.Brand>
              <Navbar.Brand
                style={{ color: "#0E141B", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/signup");
                }}
              >
                Registrarse
              </Navbar.Brand>
            </>
          ) : (
            <>
              <Navbar.Brand
                style={{ color: "#0E141B", cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  localStorage.removeItem("iduser");
                  localStorage.removeItem("role");
                  history.replace("/");
                  window.location.reload();
                }}
              >
                Desconectarse
              </Navbar.Brand>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
