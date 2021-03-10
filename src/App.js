import React, { useState } from 'react';
import { useFormik, Field, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Box,
  Button, 
  FormControl, 
  FormLabel,
  Grid, 
  InputLabel,  
  MenuItem, 
  Select, 
  TextField, 
  Typography,
  Paper,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Graph } from 'react-d3-graph';
import * as yup from 'yup';
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

const config = {
  height: 400,
  width: 800,
  node: {
    color: '#2196f3',
    fontColor: 'black',
    fontSize: 12,
    fontWeight: 'normal',
    highlightColor: 'SAME',
    highlightFontSize: 12,
    highlightFontWeight: 'normal',
    highlightStrokeColor: 'SAME',
    highlightStrokeWidth: 'SAME',
    labelProperty: 'name',
    renderLabel: true,
    size: 1000,
    strokeColor: 'none',
    strokeWidth: 1.5,
    symbolType: 'circle'
  },
  link: {
    color: 'gray',
    fontColor: 'gray',
    fontSize: 8,
    highlightColor: 'SAME',
    labelProperty: 'label',
    mouseCursor: 'pointer',
    opacity: 1,
    fontWeight: 'normal',
    highlightFontSize: 8,
    highlightFontWeight: 'normal',
    highlightStrokeColor: 'SAME',
    highlightStrokeWidth: 'SAME',
    renderLabel: true,
    semanticStrokeWidth: false,
    strokeWidth: 1,
    markerHeight: 6,
    markerWidth: 6,
    strokeDasharray: 0,
    strokeDashoffset: 0
  }
};

// globals within app
const data = {
  nodes: [],
  links: []
};

const fundAttributes = ['manager', 'year', 'type', 'status'];

const linkCache = {
  manager: [],
  year: [],
  type: [],
  status: []
};

// utility functions
const compareAndUpdateLinkCache = (a, b, prop, links) => {
  if (a[prop] === b[prop])
    links.push({ 
      source: a.id,
      target: b.id,
      label: prop === 'status' ? (a[prop] ? 'Open' : 'Closed') : a[prop].toString()
    });
}

let actionsRef = null;

const onSubmitHandler = (values, actions) => {
  // cache actions to call from graph
  if(!actionsRef) {
    actionsRef = actions;
  }
  // add fund to graph
  data.nodes.push({
    id: Math.random(),
    // place randomly offsetted from the center 
    x: (config.width / 2) + Math.random() * 100 * (Math.random() < 0.5 ? -1 : 1),
    y: (config.height / 2) + Math.random() * 100 * (Math.random() < 0.5 ? -1: 1),
    ...values
  });
  // update link cache complexity O(an) where n is # of nodes and a is # of fund attributes
  for (var i = 0; i < data.nodes.length - 1; i++)
    for (const prop of fundAttributes)
    compareAndUpdateLinkCache(
      data.nodes[i],
      data.nodes[data.nodes.length - 1], // node that was just added
      prop,
      linkCache[prop]
    )
  // reset to add another fund easily
  actions.resetForm();
}

const connectBy = (e, connectByProp) => {
  data.links = linkCache[connectByProp];
  if(actionsRef)
    actionsRef.resetForm();
}

const UI = () => {
  const classes = useStyles();
  const [connectedBy, setConnectedBy] = useState('');

  // hook cannot be called at the top level
  const formik = useFormik({
    initialValues: {
      name: '',
      manager: '',
      year: '',
      type: '',
      status: true // open
    },
    validationSchema: validationSchema,
    onSubmit: onSubmitHandler
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Box p={4}>
          <Paper className={classes.paper}>
            <form onSubmit={formik.handleSubmit}>
              <Grid item xs={12}>
                <TextField
                  id='name'
                  name='name'
                  label='Fund Name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  <TextField
                    id='manager'
                    name='manager'
                    label='Fund Manager'
                    type='manager'
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
                    id='year'
                    name='year'
                    label='Launch Year'
                    type='year'
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
                    <InputLabel id='type-select-label'>Fund Type</InputLabel>
                    <Select
                      labelId='type-select-label'
                      id='type-select'
                      name='type'
                      type='type'
                      value={formik.values.type}
                      onChange={formik.handleChange}
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
                  <FormLabel>Fund Status</FormLabel>
                  <FormikProvider value={formik}>
                    <label>
                      <Field type='checkbox' name='status' />
                      {`${formik.values.status ? 'Open' : 'Closed'}`}
                    </label>
                  </FormikProvider>
                </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  <Button
                    color='primary'
                    variant='contained'
                    type='submit'
                    onSubmit={formik.handleChange}>
                    Add Fund
                  </Button>
                </Box>
              </Grid>
            </form>
          </Paper>
        </Box>
        <Box mt={4}>
          <Paper className={classes.paper}>
            <Grid item xs={12}>
              <Typography>Connect By:</Typography>
              <ToggleButtonGroup
                onChange={connectBy}
                aria-label="connect by"
                exclusive
                value={connectedBy}
              >
                <ToggleButton value="manager" aria-label="manager" 
                  onClick={() => setConnectedBy('manager')}>
                  Fund Manager
                </ToggleButton>
                <ToggleButton value="year" aria-label="year"
                  onClick={() => setConnectedBy('year')}>
                  Launch Year
                </ToggleButton>
                <ToggleButton value="type" aria-label="type"
                 onClick={() => setConnectedBy('type')}>
                  Fund Type
                </ToggleButton>
                <ToggleButton value="status" aria-label="status"
                  onClick={() => setConnectedBy('status')}>
                  Fund Status
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <Box mt={2} border={1}>
                <Graph
                  id="fund-similarity-graph"
                  data={data}
                  config={config}
                />
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Grid>    
    </div>
  );
};

function App() {
  return (
    <UI />
  );
}

export default App;
