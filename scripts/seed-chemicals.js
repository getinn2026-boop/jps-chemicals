const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const chemicalProducts = [
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
    defaultPrice: 450,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Hydrochloric Acid',
    sku: 'HCL-37-1L',
    casNumber: '7647-01-0',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 320,
    supplierName: 'Loba Chemie'
  },
  {
    name: 'Sulfuric Acid',
    sku: 'H2SO4-98-500ML',
    casNumber: '7664-93-9',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 280,
    supplierName: 'Qualigens Fine Chemicals'
  },
  {
    name: 'Ethanol Absolute',
    sku: 'ETH-99-1L',
    casNumber: '64-17-5',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 1200,
    supplierName: 'Sigma-Aldrich'
  },
  {
    name: 'Methanol',
    sku: 'MET-001',
    casNumber: '67-56-1',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 650,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Isopropyl Alcohol',
    sku: 'IPA-99-500ML',
    casNumber: '67-63-0',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 380,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Ammonium Hydroxide',
    sku: 'NH4OH-25-1L',
    casNumber: '1336-21-6',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 420,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Nitric Acid',
    sku: 'HNO3-70-500ML',
    casNumber: '7697-37-2',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 520,
    supplierName: 'Loba Chemie'
  },
  {
    name: 'Chloroform',
    sku: 'CHL-001',
    casNumber: '67-66-3',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 1800,
    supplierName: 'Qualigens Fine Chemicals'
  },
  {
    name: 'Toluene',
    sku: 'TOL-001',
    casNumber: '108-88-3',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 950,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Benzene',
    sku: 'BEN-001',
    casNumber: '71-43-2',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 2200,
    supplierName: 'Sigma-Aldrich'
  },
  {
    name: 'Xylene',
    sku: 'XYL-MIX-1L',
    casNumber: '1330-20-7',
    unit: 'L',
    currency: 'INR',
    defaultPrice: 1100,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Acetic Acid Glacial',
    sku: 'ACET-GLAC-500ML',
    casNumber: '64-19-7',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 720,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Formic Acid',
    sku: 'FORM-85-500ML',
    casNumber: '64-18-6',
    unit: '500mL',
    currency: 'INR',
    defaultPrice: 650,
    supplierName: 'Loba Chemie'
  }
];

async function seedChemicals() {
  console.log('Starting to seed chemical products...');
  
  try {
    for (const product of chemicalProducts) {
      // Find or create supplier
      let supplier = await prisma.supplier.findFirst({
        where: { name: product.supplierName }
      });
      
      if (!supplier) {
        supplier = await prisma.supplier.create({
          data: {
            name: product.supplierName,
            email: `contact@${product.supplierName.toLowerCase().replace(/\s+/g, '-')}.com`,
            phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
            address: 'Industrial Area, Mumbai, Maharashtra'
          }
        });
        console.log(`Created supplier: ${supplier.name}`);
      }
      
      // Create product
      const newProduct = await prisma.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          casNumber: product.casNumber,
          unit: product.unit,
          currency: product.currency,
          defaultPrice: product.defaultPrice,
          supplierId: supplier.id
        }
      });
      
      console.log(`Created product: ${newProduct.name} (${newProduct.sku})`);
    }
    
    console.log('Successfully seeded all chemical products!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChemicals();