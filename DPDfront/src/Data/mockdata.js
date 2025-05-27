const mockData = [
  {
    producer: 'Producer A',
    subproducers: [
      {
        name: 'Subproducer A1',
        products: [
          {
            name: 'Electric Scooter V1',
            image: 'https://via.placeholder.com/300',
            subproducer: 'Subproducer A1',
            currentVersion: { version: 'v3.2' },
            versions: [
              { version: 'v3.2', updatedBy: 'Subproducer A1', date: '2025-05-10' },
              { version: 'v3.1', updatedBy: 'Subproducer A1', date: '2025-04-15' },
              { version: 'v3.0', updatedBy: 'Subproducer A1', date: '2025-04-01' }
            ]
          }
        ]
      }
    ]
  },
  {
    producer: 'Producer B',
    subproducers: [
      {
        name: 'Subproducer B1',
        products: [
          {
            name: 'Battery Pack V2',
            image: 'https://via.placeholder.com/300',
            subproducer: 'Subproducer B1',
            currentVersion: { version: 'v1.5' },
            versions: [
              { version: 'v1.5', updatedBy: 'Subproducer B1', date: '2025-05-08' },
              { version: 'v1.4', updatedBy: 'Subproducer B1', date: '2025-04-20' }
            ]
          }
        ]
      }
    ]
  }
];

export default mockData;
