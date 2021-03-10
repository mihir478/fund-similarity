import React from 'react';
import { useFormik, Field, FormikProvider } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './App.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

const validationSchema = yup.object({
  name: yup
    .string('Enter fund name')
    .required('Fund name is required'),
  manager: yup
    .string('Enter manager name')
    .required('Manager name is required'),
  year: yup
    .number('Enter launch year')
    .required('Launch year is required')
    .positive()
    .integer(),    
  type: yup
    .string('Enter fund type')
    .required('Fund type is required')
});

const AddFund = () => {
  const classes = useStyles();
  
  const formik = useFormik({
    initialValues: {
      name: '',
      manager: '',
      year: null,
      type: '',
      open: true
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Box p={4}>
          <Paper className={classes.paper}>
            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  <TextField
                    id="manager"
                    name="manager"
                    label="Fund Manager"
                    type="manager"
                    value={formik.values.manager}
                    onChange={formik.handleChange}
                    error={formik.touched.manager && Boolean(formik.errors.manager)}
                    helperText={formik.touched.manager && formik.errors.manager}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  <TextField
                    id="year"
                    name="year"
                    label="Launch Year"
                    type="year"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    error={formik.touched.year && Boolean(formik.errors.year)}
                    helperText={formik.touched.year && formik.errors.year}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      name="type"
                      type="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      helperText={formik.touched.type && formik.errors.type}
                    >
                      <MenuItem value={'Venture Capital'}>Venture Capital</MenuItem>
                      <MenuItem value={'Real Estate'}>Real Estate</MenuItem>
                      <MenuItem value={'Hedge Fund'}>Hedge Fund</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                <FormControl className={classes.formControl}>
                  <FormLabel>Status</FormLabel>
                  <FormikProvider value={formik}>
                    <label>
                      <Field type="checkbox" name="open" />
                      {`${formik.values.open ? 'Open' : 'Closed'}`}
                    </label>
                  </FormikProvider>
                </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  <Button color="primary" variant="contained" type="submit">
                    Add Fund
                  </Button>
                </Box>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Grid>    
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AddFund />
    </div>
  );
}

export default App;
