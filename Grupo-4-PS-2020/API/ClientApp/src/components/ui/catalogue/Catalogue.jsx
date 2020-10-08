import {
  ButtonBase,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useState, useEffect } from "react";
import Tile from "./Tile";
import "./catalogue.css";
import Sidebar from "./Sidebar";
import MediaCard from "./Card";
import Search from "./Search";
import PaginationOutlined from "./PaginationOutlined";
import { apiAxios } from "../../../config/axios";
import Spinner from "../../ui/Spinner";

const Catalogue = () => {
  //States
  const [visual, setvisual] = useState("card");
  const [search, setsearch] = useState("");
  const [order, setorder] = useState("Default");
  const [productlist, setproductlist] = useState([]);
  const [categorieslist, setcategorieslist] = useState([]);
  const [show, setshow] = useState(false);

  const getProductsAPI = () => {
    apiAxios
      .get("/product/allproduct")
      .then(({ data }) => {
        setproductlist(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  const getCategoriesAPI = () => {
    apiAxios
      .get("/category/allcategories", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
          "Access-Control-Allow-Headers":
            "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        setcategorieslist(data);
        console.log(data);
        setshow(true);
      })
      .catch((error) => console.log(error));
  };

  const listacategorias = [
    { id: 1, name: "Categoria1" },
    { id: 2, name: "Categoria2" },
    { id: 3, name: "Categoria3" },
    { id: 4, name: "Categoria4" },
  ];

  //Ordenar productos
  if (order === "Menor precio") {
    productlist.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
  } else if (order === "Mayor precio") {
    productlist.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
  } else if (order === "Nombre ascendente") {
    productlist.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (order === "Nombre descendente") {
    productlist.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  useEffect(() => {
    getProductsAPI();
    getCategoriesAPI();
  }, [])

  return show ? (
    <div className="contenedor">
      <Container maxWidth={"lg"} className="tilescolumn">
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Search search={search} setsearch={setsearch} />
            <Sidebar
              visual={visual}
              setvisual={setvisual}
              categorieslist={categorieslist}
              order={order}
              setorder={setorder}
            />
          </Grid>
          {productlist.length === 0 ? (
            <p>
              No hay productos que coincidan con su busqueda, intente otra vez.
            </p>
          ) : visual === "tiles" ? (
            <Grid item xs={9}>
              {productlist.map((prod) => (
                <Tile key={prod.idProducto} prod={prod} />
              ))}
            </Grid>
          ) : (
            <Fragment>
              <Grid item xs={9}>
                <div className="card-group">
                  {productlist.map((prod) => (
                    <MediaCard key={prod.idProducto} prod={prod} />
                  ))}
                </div>
              </Grid>
            </Fragment>
          )}
        </Grid>
        <Grid container>
          <PaginationOutlined />
        </Grid>
      </Container>
    </div>
  ) : (
    <div style={{ padding: "200px" }}>
      <Spinner />
    </div>
  );
};

export default Catalogue;