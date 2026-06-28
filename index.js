const express = require('express');
const app = express();
const ProvincesRouter = require('./router/provinces')
const DistrictRouter = require('./router/districts')
const StationsRouter = require('./router/stations')
const VehicleRouter = require('./router/vehicles')

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    session : 'NB6007CEMS2'
  });
});


app.use('/provinces',ProvincesRouter)
app.use('/districts',DistrictRouter)
app.use('/stations',StationsRouter)
app.use('/vehicles',VehicleRouter)





// Start the server
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});