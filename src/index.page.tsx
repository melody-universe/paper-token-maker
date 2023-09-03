import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

export const Page = () => (
  <Box display="flex" flexDirection="column" height="100vh">
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="none"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="div" variant="h6" flexGrow={1}>
          Paper Token Maker
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
    <Box
      component="main"
      display="flex"
      padding={1}
      flexGrow={1}
      bgcolor="#F3F6F9"
    >
      <Grid container flexGrow={1} spacing={1}>
        <Grid item display="flex" xs={6}>
          <Paper sx={{ flexGrow: 1 }} />
        </Grid>
        <Grid item display="flex" xs={6}>
          <Paper sx={{ flexGrow: 1 }} />
        </Grid>
        <Grid item display="flex" xs={12}>
          <Paper sx={{ flexGrow: 1 }} />
        </Grid>
      </Grid>
    </Box>
  </Box>
);
