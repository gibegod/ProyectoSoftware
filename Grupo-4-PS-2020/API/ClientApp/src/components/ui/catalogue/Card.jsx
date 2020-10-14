import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  root: {
    width: 290,
    marginBottom: 10,
    marginLeft: 15,
    height: 340
  },
  media: {
    maxWidth: "100%",
    height: 220,
  },
});

export default function MediaCard({ prod }) {
  const classes = useStyles();
  const history = useHistory();

  const { idProducto, nombre, precio, precioOferta, imagen } = prod;

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={(e) => history.push(`/product/${idProducto}`)}>
        <CardMedia className={classes.media} image={imagen} title={nombre} />
        <CardContent>
          {precioOferta === 0 ? (
            <Fragment>
              <div className="mb-4"></div>
              <Typography gutterBottom variant="h5" component="h2">
                $ {precio}
              </Typography>
            </Fragment>
          ) : (
            <Fragment>
              <Typography color="textSecondary">
                <del>$ {precioOferta}</del>
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                $ {precio}
              </Typography>
            </Fragment>
          )}
          <Typography variant="body1" color="textSecondary">
            {nombre}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
