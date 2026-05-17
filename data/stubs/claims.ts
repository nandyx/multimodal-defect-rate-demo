export type StubClaim = {
  id: string;
  commentId: string;
  defectType: string;
  productName: string;
  productImageUrl: string;
  productDescription: string;
  status: 'paused' | 'active';
  text: string;
  imageUrl?: string;
  scenarioType: 'real' | 'fake' | 'no-image';
};

export const stubClaims: StubClaim[] = [
  {
    id: 'claim-001',
    commentId: '5682945721',
    defectType: 'Equivocado',
    productName: 'Milanesa con guarnición',
    productImageUrl: '/stubs/reclaim_order.png',
    productDescription: 'Reclamos por órdenes incompleto y en mal estado.',
    status: 'paused',
    text: 'I ordered a chicken sandwich and they sent me chilaquiles with beans!',
    imageUrl: '/stubs/reclaim_order.png',
    scenarioType: 'real',
  },
  {
    id: 'claim-002',
    commentId: '5682945799',
    defectType: 'Mal estado',
    productName: 'Hamburguesa Doble Queso',
    productImageUrl: '/stubs/reclaim_fake.png',
    productDescription: 'Reclamos por producto en mal estado.',
    status: 'active',
    text: 'wacala que asco quiero mi dinero',
    imageUrl: '/stubs/reclaim_fake.png',
    scenarioType: 'fake',
  },
  {
    id: 'claim-004',
    commentId: '5682945850',
    defectType: 'Incompleto',
    productName: 'Hamburguesa con papas',
    productImageUrl: '/stubs/reclaim_order_2.png',
    productDescription: 'Reclamos por orden incompleta.',
    status: 'active',
    text: 'Mi orden llegó incompleta, pedí hamburguesa y me llegó solo las papas. Necesito un reembolso!',
    imageUrl: '/stubs/reclaim_order_2.png',
    scenarioType: 'real',
  },
  {
    id: 'claim-003',
    commentId: '5682945833',
    defectType: 'Faltante',
    productName: 'Papas Grandes',
    productImageUrl: '',
    productDescription: 'Reclamos por producto faltante.',
    status: 'active',
    text: 'No llegaron las papas que pedí, solo me mandaron la hamburguesa. Quiero mi reembolso por favor.',
    scenarioType: 'no-image',
  },
];

export function getClaimById(id: string): StubClaim | undefined {
  return stubClaims.find((c) => c.id === id);
}
