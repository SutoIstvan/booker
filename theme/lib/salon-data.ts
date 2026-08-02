export type Service = {
  id: string
  name: string
  description: string
  duration: string
  price: number
  image?: string
}

export const services: Service[] = [
  {
    id: 'relax',
    name: 'Relaxing Massage',
    description:
      'A gentle technique with aromatic oils to fully release tension and reach deep relaxation.',
    duration: '60 min',
    price: 79,
    image: '/images/service-relax.png',
  },
  {
    id: 'sport',
    name: 'Sports Massage',
    description:
      'Intensive muscle work to recover after training and improve overall tone.',
    duration: '75 min',
    price: 95,
  },
  {
    id: 'therapeutic',
    name: 'Therapeutic Back Massage',
    description:
      'Focused work on tension zones, posture and back pain, guided by a specialist.',
    duration: '60 min',
    price: 89,
  },
  {
    id: 'aroma',
    name: 'Aromatherapy SPA',
    description:
      'A complete ritual with essential oils, warm compresses and an atmosphere of total calm.',
    duration: '90 min',
    price: 120,
    image: '/images/service-aroma.png',
  },
  {
    id: 'stone',
    name: 'Hot Stone Massage',
    description:
      'A massage with warm volcanic stones for deep warmth and full relief from fatigue.',
    duration: '80 min',
    price: 110,
  },
  {
    id: 'face',
    name: 'Face & Head Massage',
    description:
      'A delicate technique for glowing skin, headache relief and a feeling of lightness.',
    duration: '45 min',
    price: 65,
  },
]

export const timeSlots: string[] = [
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00',
  '20:30',
]

export function formatPrice(value: number): string {
  return '$' + new Intl.NumberFormat('en-US').format(value)
}
