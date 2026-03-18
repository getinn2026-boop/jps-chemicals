import { prisma } from "../src/server/db";

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
  },
  {
    name: 'Methanol',
    sku: 'MET-500ML',
    casNumber: '67-56-1',
    unit: '500ml',
    currency: 'INR',
    defaultPrice: 280,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Ethanol',
    sku: 'ETH-1L',
    casNumber: '64-17-5',
    unit: '1L',
    currency: 'INR',
    defaultPrice: 380,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Sulfuric Acid',
    sku: 'H2SO4-1L',
    casNumber: '7664-93-9',
    unit: '1L',
    currency: 'INR',
    defaultPrice: 520,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Nitric Acid',
    sku: 'HNO3-500ML',
    casNumber: '7697-37-2',
    unit: '500ml',
    currency: 'INR',
    defaultPrice: 420,
    supplierName: 'Loba Chemie'
  },
  {
    name: 'Ammonia Solution',
    sku: 'NH4OH-2L',
    casNumber: '1336-21-6',
    unit: '2L',
    currency: 'INR',
    defaultPrice: 180,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Chloroform',
    sku: 'CHCl3-500ML',
    casNumber: '67-66-3',
    unit: '500ml',
    currency: 'INR',
    defaultPrice: 650,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Toluene',
    sku: 'TOL-1L',
    casNumber: '108-88-3',
    unit: '1L',
    currency: 'INR',
    defaultPrice: 720,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Benzene',
    sku: 'BEN-500ML',
    casNumber: '71-43-2',
    unit: '500ml',
    currency: 'INR',
    defaultPrice: 890,
    supplierName: 'Loba Chemie'
  },
  {
    name: 'Xylene',
    sku: 'XYL-1L',
    casNumber: '1330-20-7',
    unit: '1L',
    currency: 'INR',
    defaultPrice: 780,
    supplierName: 'Sisco Research Laboratories'
  },
  {
    name: 'Isopropanol',
    sku: 'IPA-2L',
    casNumber: '67-63-0',
    unit: '2L',
    currency: 'INR',
    defaultPrice: 340,
    supplierName: 'Merck Life Sciences'
  },
  {
    name: 'Acetic Acid',
    sku: 'AA-1L',
    casNumber: '64-19-7',
    unit: '1L',
    currency: 'INR',
    defaultPrice: 380,
    supplierName: 'Thermo Fisher Scientific'
  },
  {
    name: 'Potassium Hydroxide',
    sku: 'KOH-500G',
    casNumber: '1310-58-3',
    unit: '500g',
    currency: 'INR',
    defaultPrice: 420,
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