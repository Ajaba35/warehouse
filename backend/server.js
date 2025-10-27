import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import catRoutes from './routes/categories.js';
import prodRoutes from './routes/products.js';
import csRoutes from './routes/customers.js';
import splRoutes from './routes/suppliers.js';
import saleRoutes from './routes/sales.js';
import pchRoutes from './routes/purchases.js';
import stRoutes from './routes/settings.js';


const app = express();


app.use(cors());
app.use(express.json());



app.use('/api/users', userRoutes);
app.use('/api/categories', catRoutes);
app.use('/api/products', prodRoutes);
app.use('/api/customers', csRoutes);
app.use('/api/suppliers', splRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/purchases', pchRoutes);
app.use('/api/settings', stRoutes);


const PORT = 5015;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});