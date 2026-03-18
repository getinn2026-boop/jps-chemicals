// Simple manual product addition script
// This will create a few basic chemical products directly

const products = [
  {
    name: 'Acetone',
    sku: 'ACE-001',
    casNumber: '67-64-1',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 850,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Sodium Hydroxide',
    sku: 'NAOH-500G',
    casNumber: '1310-73-2',
    unit: '500g',
    currency: 'INR',
    defaultPrice: 320,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Hydrochloric Acid',
    sku: 'HCL-2L',
    casNumber: '7647-01-0',
    unit: '2L',
    currency: 'INR',
    defaultPrice: 450,
    supplierName: 'Loba Chemie'
  }
];

console.log('Manual Product Addition Script');
console.log('============================');
console.log('');
console.log('To add these chemical products manually:');
console.log('');

products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} (${product.sku})`);
  console.log(`   - CAS Number: ${product.casNumber}`);
  console.log(`   - Unit: ${product.unit}`);
  console.log(`   - Price: ₹${product.defaultPrice}`);
  console.log(`   - Supplier: ${product.supplierName}`);
  console.log('');
});

console.log('Please navigate to http://localhost:3001/products and use the "Add Product" form to add these products.');
console.log('The form is located on the right side of the products page.');
console.log('');
console.log('Alternatively, you can use the bulk import feature with a CSV file containing these products.');