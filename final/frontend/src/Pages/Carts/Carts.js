import * as React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useLocation, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useCallback } from 'react';

const defaultTheme = createTheme();

function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Orders() {
  const [products, setProducts] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { cartid, token } = location.state;
  const navigate = useNavigate();


  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/carts/${cartid}`
      );
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    }
  }, [cartid])

 /*
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/carts/${cartid}`
      );
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    }
  };
*/
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  React.useEffect(() => {
    const calculateTotal = () => {
      let sum = 0;
      products.forEach((product) => {
        sum += product.product.price * product.quantity;
      });
      setTotal(sum);
    };
    calculateTotal();
  }, [products]);

  const handleDeleteProduct = async (productId) => {
    const productToDelete = products.find(({ product }) => product._id === productId);
    let updatedProducts;

    try {
      const response = await fetch(`http://localhost:3000/api/carts/${cartid}/product/${productId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        if (productToDelete && productToDelete.quantity === 1) {
          updatedProducts = products.filter(({ product }) => product._id !== productId);;
          setProducts(updatedProducts);
        } else {
          fetchProducts();
        }
      }
    }
    catch (error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    };

  };

  const handleFinalizePurchase = () => {
    // Call the endpoint to finalize the purchase
    fetch(`http://localhost:3000/api/carts/${cartid}/purchase`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setOpen(true);
        } else {
          throw new Error('Error al finalizar la compra');
        }
      })
      .catch((error) => {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/products', { state: { cartid: cartid, token: token } });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar >
          <Typography variant="h6" color="inherit" noWrap>
            Mi carrito
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Title>Su pedido</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.product._id}>
                      <IconButton aria-label="delete" size="small" onClick={() => handleDeleteProduct(product.product._id)}>
                        <HighlightOffIcon fontSize="small" />
                      </IconButton>
                      <TableCell>{product.product.title}</TableCell>
                      <TableCell>{product.product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell align="right">{`$${product.product.price * product.quantity}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
              }}
            >
              <Title>Total</Title>
              <Typography component="p" variant="h4">
                {`$${total.toFixed(2)}`}
              </Typography>
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleFinalizePurchase}
                >
                  Finalizar compra
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"GRACIAS POR SU COMPRA"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Te esperamos proximamente
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
