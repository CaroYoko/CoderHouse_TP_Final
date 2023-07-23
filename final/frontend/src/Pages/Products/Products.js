import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const styles = {
  cartIcon: {
    position: 'absolute',
    right: 16,
  },
};

export default function Album() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [cards, setCards] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const location = useLocation();
  const { cartid, token } = location.state;
  const navigate = useNavigate();

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = async (event, pid) => {
    try {
      event.preventDefault()
      const response = await fetch(`http://localhost:3000/api/carts/${cartid}/product/${pid}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al añadir el producto al carrito');
      }
      console.log('Producto añadido al carrito con éxito');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLookAtCart = async () => navigate("/carts", { state: { cartid: cartid, token: token } });

  const handleLogout = async (event) => {
    try {
      event.preventDefault()
      const response = await fetch(`http://localhost:3000/api/session/logout`);
      if (!response.ok) throw new Error('Error al cerrar session');
      navigate("/login")
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products?limit=6&page=${currentPage}&sort=1`);
        if (!response.ok) {
          throw new Error('Error al obtener las cards');
        }
        const data = await response.json();
        setCards(data.payload || []);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCards();
  }, [currentPage]);

  //style={styles.cartIcon}
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar >
          <Typography variant="h6" color="inherit" noWrap>
            Bienvenido
          </Typography>
            <div style={{ flexGrow: 1 }} />
            <IconButton aria-label="cart" color="inherit" onClick={() => handleLookAtCart()}>
              <ShoppingCartIcon justifyContent='flex-end' />
            </IconButton>
            <IconButton color="inherit" aria-label="logout" onClick={(event) => handleLogout(event)}>
              <LogoutIcon />
            </IconButton>

        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Tienda de ropa
            </Typography>
            <Typography variant="body1" align="justify" color="text.secondary" paragraph>
              ¡Bienvenido a nuestra tienda de ropa online, tu destino perfecto para encontrar todo lo que necesitas para vestirte con estilo y elegancia!
              Aquí, en nuestro exclusivo catálogo en línea, descubrirás una amplia selección de prendas y accesorios que seguramente te encantarán.
              Ofrecemos una amplia gama de tallas para garantizar que todos puedan encontrar prendas que se ajusten perfectamente a su cuerpo y resalten su belleza única.
              Además, mantenemos nuestros precios competitivos y ofrecemos promociones y descuentos especiales para que puedas obtener más por tu dinero.
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                      objectFit: 'cover'
                    }}
                    image={`http://localhost:3000/img/products/${card.thumbnail[0]}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography xs={12} >{`$ ${card.price}.- `}</Typography>
                    <Typography xs={12} >{card.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={(event) => handleAddToCart(event, card._id)}>
                      Añadir al carrito
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Box sx={{ py: 4 }} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          ¡Gracias por elegirnos y esperamos poder brindarte una experiencia de compra excepcional!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}