require('dotenv').config()
const mongoose = require('mongoose')
const Brand = require('./models/Brand')

const BRANDS = [
  '4711', 'Afnan', 'Alaïa', 'Aramis', 'Armaf', 'Armani', 'Azzaro',
  'Babyliss', 'Baldessarini', 'Balmain', 'Bolsius', 'Boucheron', 'Bourjois',
  'Braun', 'Britney Spears', 'Burberry', 'Bvlgari',
  'Cacharel', 'Calvin Klein', 'Carolina Herrera', 'Caron', 'Cartier',
  'Cerruti', 'Scandal', 'Chloé', 'Chopard', 'Clarins', 'Clinique', 'Coach', 'Cyrus',
  'Davidoff', 'Diesel', 'Dior', 'Dolce & Gabbana', 'Dsquared2', 'Dunhill',
  'Elie Saab', 'Elizabeth Arden', 'Escada', 'Estée Lauder',
  'Fendi', 'Francesco Smalto',
  'Geoffrey Beene', 'Geparlys', 'Giorgio Beverly Hills', 'Gisada', 'Givenchy',
  'Grès', 'Gucci', 'Guerlain', 'Guess', 'Guy Laroche',
  'Hermès', 'Hugo Boss',
  'Issey Miyake',
  'Jacomo', 'Jacques Bogart', 'Jaguar', 'Jean Paul Gaultier', 'Jimmy Choo', 'Joop!',
  'Kenzo', 'Korloff', 'Kérastase',
  "L'Oréal Paris", 'La Roche-Posay', 'Lacoste', 'Lalique', 'Lancôme', 'Lanvin',
  'Lattafa', 'Laura Biagiotti', 'Leonard', 'Lolita Lempicka',
  'Maison Margiela', 'Mancera', 'Marc Jacobs', 'Mauboussin', 'Maybelline',
  'Mercedes-Benz', 'Montale', 'Montblanc', 'Moschino', 'Mugler', 'Muthhela',
  'Narciso Rodriguez', 'Nikos', 'Nina Ricci', 'Nishane',
  'Paco Rabanne', 'Paloma Picasso', 'Parfums De Marly', 'Philips',
  'Pino Silvestre', 'Police', 'Prada', 'Puig',
  'Ralph Lauren', 'Roberto Cavalli', 'Rochas', 'Roger & Gallet',
  'Shiseido', 'Sisley',
  'Tabac', 'Tartine Et Chocolat', 'Ted Lapidus', 'Tom Ford', 'Trussardi',
  'Ungaro',
  'Valentino', 'Van Cleef & Arpels', 'Versace', 'Vichy', "Victoria's Secret",
  'Viktor & Rolf',
  'Yves Saint Laurent',
  'Zadig & Voltaire',
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  let added = 0
  let skipped = 0

  for (const name of BRANDS) {
    const exists = await Brand.findOne({ name })
    if (!exists) {
      await Brand.create({ name })
      console.log(`  ✓ ${name}`)
      added++
    } else {
      skipped++
    }
  }

  console.log(`\nDone: ${added} brands added, ${skipped} already existed.`)
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
