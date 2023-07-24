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

export default function SignUp() {
  const navigate = useNavigate();
  const { handleSubmit, control, formState: { errors } } = useForm({mode: "all"});
  const [state, setState] = useState({
    showAlert: false,
    menssage: ""
  });

  const onSubmit = (data) => {
    let url = `${URL}/api/users`;
    let user = {
      first_name: data.firstName,
      last_name: data.lastName,
      age: data.age,
      email: data.email,
      password: data.password
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 201) throw new Error("No se pudo crear el usuario")
      return response.json()
    }).then(data => {
      console.log(data)
      state.showAlert = true;
      state.menssage = data.message;
      setState({ ...state, showAlert: true, menssage: data.message });
      setTimeout(() => {
        setState({ ...state, showAlert: false, menssage: "" });
        navigate("/login");
      }, 2000);
    }).catch(function (error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {state.showAlert ? <Alert severity="success">{state.menssage}</Alert> : null}
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
            Crea un usuario
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Nombre es requerido',
                    pattern: {
                      value: /^[A-Za-zÁ-ÿ\s]+$/,
                      message: 'Ingrese un nombre válido sin números ni caracteres especiales',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      type="text"
                      id="firstName"
                      label="Nombre"
                      autoFocus
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName?.message}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Apellido es requerido',
                    pattern: {
                      value: /^[A-Za-zÁ-ÿ\s]+$/,
                      message: 'Ingrese un apellido válido sin números ni caracteres especiales',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      type="text"
                      id="lastName"
                      label="Apellido"
                      name="lastName"
                      autoComplete="family-name"
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName?.message}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="age"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Edad es requerida',
                    pattern: {
                      value: /^\d+$/,
                      message: 'Ingrese una edad válida',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="age"
                      label="Edad"
                      name="age"
                      autoComplete="age"
                      error={Boolean(errors.age)}
                      helperText={errors.age?.message}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ingrese una dirección de correo electrónico válida',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      type="email"
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{                   
                    required: 'Contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Contraseña"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" onClick={() => navigate("/login")} variant="body2">
                  ¿Ya tienes una cuenta? Inicia sesión.
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box> 
      </Container>
    </ThemeProvider>
  );
}