import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { URL } from '../const';

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const { handleSubmit, control, formState: { errors } } = useForm({ mode: "all" });
  const [state, setState] = useState({
    showAlert: false,
    menssage: ""
  });
  const onSubmit = (data) => {
    let url = `${URL}/api/session/login`;
    const user = { email: data.email, password: data.password };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (!response.ok || response.status !== 200) {
        setState({ ...state, showAlert: true, menssage: "Usuario no encontrado" });
        setTimeout(() => {
          setState({ ...state, showAlert: false, menssage: "" });
          navigate("/login");
        }, 2000);
        throw new Error("Usuario no encontrado");
      }
      return response.json()
    }).then((data) => {
      navigate("/products", { state: { cartid: data.usercartid, token: data.token } })
    }).catch(function (error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {state.showAlert ? <Alert severity="error">{state.menssage}</Alert> : null}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'El email es requerido'
              }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'La contraseña es requerida'
              }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" onClick={() => navigate("/register")}  variant="body2">
                ¿Aún no tienes una cuenta? Regístrate.
                </Link>
              </Grid>
            </Grid>            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}