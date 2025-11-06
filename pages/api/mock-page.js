import mockContent from '../../data/mock-page-content.json';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Add some randomization to make each game session unique
    const variations = [
      {
        ...mockContent,
        content: mockContent.content.replace(/20%/g, '22%').replace(/85%/g, '80%')
      },
      {
        ...mockContent,
        content: mockContent.content.replace(/25,000/g, '30,000').replace(/250,000/g, '300,000')
      },
      mockContent // Original content
    ];

    const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
    
    res.status(200).json(selectedVariation);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 