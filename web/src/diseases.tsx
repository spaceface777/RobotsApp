import tomatoBacterialSpot from 'img/tomato-bacterial.jpeg'
import potatoEarlyBlight from 'img/potato-early-blight.jpg'
import cornGrayLeafSpot from 'img/corn-gray-leaf-spot.jpeg'
import cherryPowderyMildew from 'img/cherry-powdery-mildew.webp'
import appleBlackRot from 'img/apple-black-rot.jpeg'

export type Disease = {
    name: string,
    treatment: string,
    image: string
}

export const diseases: Disease[] = [
    {
        name: 'Tomato bacterial spot',
        treatment: `Soak seeds in 10% water solution of household bleach (5.25% sodium hypochlorite) for 45 min, and rinse thoroughly. Remove and destroy infected leaves with black spots. Water often but in small amounts over next few days. Water plants only in the morning. Use copper products or copper plus mancozeb pesticides to control bacterial spread.`,
        image: tomatoBacterialSpot
    },
    {
        name: 'Potato early blight',
        treatment: 'Prune or stake plants to improve air circulation and reduce fungal problems. Make sure to disinfect your pruning shears after each cut. Keep the soil under plants clean and free of garden debris. Add a layer of organic compost to prevent the spores from splashing back up onto vegetation. Drip irrigation and soaker hoses can be used to help keep the foliage dry. For best control, apply copper-based fungicides for 7-10 days. Remove and destroy all garden debris after harvest and practice crop rotation the following year. Burn or bag infected plant parts. Do NOT compost.',
        image: potatoEarlyBlight
    },
    {
        name: 'Corn gray leaf spot',
        treatment: 'Apply fungicides which provide a broad-spectrum for disease control, have a dual mode of action residual activity and have properties that provide vitamins necessary for plan growth such as calcium and boron. Things that may also be considered include tillage, crop rotation and planting resistant hybrids instead.',
        image: cornGrayLeafSpot
    },
    {
        name: 'Cherry powdery mildew',
        treatment: 'Use fungicides including potassium bicarbonate, neem oil, sulfur, or copper. Home remedies like baking soda and milk can also be successful treatments when applied properly. Affected portions of your plant should be removed prior to treating powdery mildew, and additional steps like improving air circulation and specific watering techniques should be applied after treatment to prevent reoccurrence of the fungus.',
        image: cherryPowderyMildew
    },
    {
        name: 'Apple black rot',
        treatment: 'Remove all dead or dying limbs (they will be dried out). Furthermore, as soon as possible start a full-rate protectant spray program early in the season with copper-based products, lime-sulfur or Daconi. This will allow the apple to recover and growth healthy throughout the rest of the season.',
        image: appleBlackRot
    }
]