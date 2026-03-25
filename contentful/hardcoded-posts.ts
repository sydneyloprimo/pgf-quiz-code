/**
 * Hardcoded blog posts that are always displayed
 * regardless of whether Contentful is working.
 */
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

import type { BlogPostEntry } from './types'

/* ------------------------------------------------------------------ */
/*  Helpers – use `any` typed nodes to avoid strict                    */
/*  Contentful rich-text type gymnastics; the runtime                  */
/*  shape is identical to what Contentful returns.                     */
/* ------------------------------------------------------------------ */

type N = any

function text(value: string, marks: { type: string }[] = []): N {
  return {
    nodeType: 'text',
    value,
    marks,
    data: {},
  }
}

function paragraph(...children: N[]): N {
  return {
    nodeType: BLOCKS.PARAGRAPH,
    data: {},
    content: children,
  }
}

function heading2(...children: N[]): N {
  return {
    nodeType: BLOCKS.HEADING_2,
    data: {},
    content: children,
  }
}

function heading3(...children: N[]): N {
  return {
    nodeType: BLOCKS.HEADING_3,
    data: {},
    content: children,
  }
}

function hyperlink(uri: string, label: string): N {
  return {
    nodeType: INLINES.HYPERLINK,
    data: { uri },
    content: [text(label)],
  }
}

function listItem(...children: N[]): N {
  return {
    nodeType: BLOCKS.LIST_ITEM,
    data: {},
    content: children,
  }
}

function orderedList(...items: N[]): N {
  return {
    nodeType: BLOCKS.OL_LIST,
    data: {},
    content: items,
  }
}

const bold = (v: string) => text(v, [{ type: 'bold' }])
const italic = (v: string) => text(v, [{ type: 'italic' }])

/* ------------------------------------------------------------------ */
/*  Author stubs (minimal shape used by components)                    */
/* ------------------------------------------------------------------ */

const authorCorinne = {
  sys: {
    id: 'hardcoded-author-corinne',
    type: 'Entry',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    locale: 'en-US',
    contentType: {
      sys: { id: 'author', type: 'Link', linkType: 'ContentType' },
    },
    space: {
      sys: { id: 'hardcoded', type: 'Link', linkType: 'Space' },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 1,
  },
  fields: {
    name: 'Dr Corinne Wigfall',
    title: 'BVMBVS(Hons) BVMedSci(Hons) MRCVS',
  },
  metadata: { tags: [], concepts: [] },
} as unknown as BlogPostEntry['fields']['author']

const authorShannon = {
  sys: {
    id: 'hardcoded-author-shannon',
    type: 'Entry',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    locale: 'en-US',
    contentType: {
      sys: { id: 'author', type: 'Link', linkType: 'ContentType' },
    },
    space: {
      sys: { id: 'hardcoded', type: 'Link', linkType: 'Space' },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 1,
  },
  fields: {
    name: 'Dr. Shannon Barrett',
    title: 'Veterinarian',
  },
  metadata: { tags: [], concepts: [] },
} as unknown as BlogPostEntry['fields']['author']

/* ------------------------------------------------------------------ */
/*  Blog post 1 – What AAFCO Is - and What It Isn't                   */
/* ------------------------------------------------------------------ */

const aafcoContent = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    paragraph(
      text(
        'It\u2019s very likely that if your veterinarian ' +
          'has discussed your pet\u2019s nutritional needs ' +
          'with you, they\u2019ve advised you to look for ' +
          'diets that meet the '
      ),
      hyperlink(
        'https://www.aafco.org/',
        'Association of American Feed Control ' + 'Officials (AAFCO)'
      ),
      text(
        ' standards. Maybe you\u2019ve had a look at a ' +
          'few pet foods, and you\u2019re now realizing ' +
          'that it\u2019s a complicated process to ' +
          'understand what all the writing on the back ' +
          'of a food label means in real terms for your ' +
          'pet\u2019s health. If it makes you feel better, ' +
          'many pet owners feel the same and it can be a ' +
          'challenging task even for the professionals.'
      )
    ),
    paragraph(
      text(
        'Your veterinarian should be familiar with the ' +
          'AAFCO standards, but you may have just heard ' +
          'about them. So, let\u2019s have a look at what ' +
          'AAFCO means, why it\u2019s important and what ' +
          'else you need to be aware of when '
      ),
      hyperlink(
        'https://www.aafco.org/consumers/' + 'understanding-pet-food/',
        'choosing pet foods based on their AAFCO standards'
      ),
      text('.')
    ),

    heading2(text('What does AAFCO stand for?')),

    paragraph(
      text(
        'AAFCO is short for the American Association ' +
          'of Feed Control Officials. It is a ' +
          'not-for-profit organization whose members ' +
          'belong to various governments of the 50 ' +
          'states, Canada, and the FDA.'
      )
    ),
    paragraph(
      text(
        'The AAFCO standards are a framework used in ' +
          'the US. Other parts of the world will have ' +
          'their own pet food standards, such as the '
      ),
      hyperlink(
        'https://fediaf.org/',
        'European Pet Food Industry Federation (FEDIAF)'
      ),
      text(' in Europe.')
    ),
    paragraph(
      text(
        'AAFCO\u2019s goal is to produce guidelines so ' +
          'that animal feeds \u2013 including pet diets ' +
          '\u2013 meet minimum standards to prevent ' +
          'malnutrition, based on current scientific ' +
          'research. AAFCO standards are updated each ' +
          'year. These updates may include adjustments ' +
          'to nutrient profiles such as minimum and ' +
          'maximum requirements, feeding trial ' +
          'protocols, ingredient definitions, labeling ' +
          'and claim language.'
      )
    ),

    heading2(text('AAFCO makes guidelines, not regulations')),

    paragraph(
      text(
        'It\u2019s important to note that AAFCO does ' +
          'not regulate the pet food industry in any ' +
          'way, and does not approve or grade any pet ' +
          'food that is currently on the market. So, ' +
          'how does it work? Each state will choose ' +
          'whether to adopt AAFCO guidelines as laws, ' +
          'and then it\u2019s up to the individual ' +
          'state to enforce these regulations.'
      )
    ),
    paragraph(
      text('The good news is that there '),
      italic('is'),
      text(
        ' regulation on pet food companies and ' +
          'products, and this is the job of the FDA, ' +
          'who can ensure that pet food manufacturers ' +
          'are held legally responsible for the food ' +
          'that they create, and ensure it complies ' +
          'with state laws. Most states will adopt the ' +
          'AAFCO standards as law, so this is why your ' +
          'veterinarian will commonly suggest that you ' +
          'look for a pet food that meets these ' +
          'standards.'
      )
    ),

    heading2(text('What are the AAFCO standards?')),

    paragraph(
      text('To meet the '),
      hyperlink(
        'https://www.aafco.org/consumers/' + 'understanding-pet-food/',
        'AAFCO standards'
      ),
      text(
        ', a diet must display nine things on their ' +
          'food packaging. If you are struggling to ' +
          'find any of the things mentioned below on ' +
          'packaging, it\u2019s probably not to the ' +
          'AAFCO standard.'
      )
    ),

    orderedList(
      listItem(
        paragraph(
          text('The packaging must state the '),
          bold('intended species'),
          text(', for example cat (feline) or dog (canine).')
        )
      ),
      listItem(
        paragraph(
          text('The '),
          bold('brand'),
          text(', for example \u201CTop Dog Food\u201D and '),
          bold('product name'),
          text(', e.g. Venison Meaty Loaf.')
        )
      ),
      listItem(
        paragraph(
          text('The '),
          bold('weight'),
          text(', or '),
          bold('volume'),
          text(' of the food e.g. Net Weight 25lb/11.34kg')
        )
      ),
      listItem(
        paragraph(
          text('The '),
          bold('name and address'),
          text(
            ' of the manufacturer or distributor of the ' +
              'food. This is the company who creates and ' +
              'or distributes the food across the US.'
          )
        )
      ),
      listItem(
        paragraph(
          text('The '),
          bold('nutritional adequacy claim'),
          text(
            '. This indicates if the manufacturer has ' +
              'created a diet that meets the minimum ' +
              'AAFCO standards to be considered ' +
              '\u201Ccomplete and balanced\u201D, and can ' +
              'therefore be used as the sole or main ' +
              'food source. To meet the nutritional ' +
              'adequacy claim, the statement must ' +
              'include the intended life stage. The ' +
              'life stages recognized by AAFCO include ' +
              'gestation/lactation, growth (including a ' +
              'specific subset for growth of large size ' +
              'dogs), and adult maintenance.'
          )
        )
      ),
      listItem(
        paragraph(
          bold('Feeding directions'),
          text(
            '. This will usually be a table of suggested ' +
              'portions in grams or cups based on your ' +
              'pet\u2019s weight. It\u2019s important to ' +
              'note that the weight ranges can be broad, ' +
              'and the feeding suggestions are intended ' +
              'to meet the needs of the majority, and ' +
              'this may or may not be suitable for your ' +
              'individual pets needs (check with your ' +
              'veterinarian if you aren\u2019t sure!).'
          )
        )
      ),
      listItem(
        paragraph(
          bold('Calorie content statement'),
          text(
            '. The energy content should be listed in ' +
              'the format kcal/kg or kcal per common ' +
              'unit such as a cup. A kilocalorie (kcal) ' +
              'is a measure of how much energy is in ' +
              'the food. It\u2019s important from a ' +
              'nutritional standpoint because it ' +
              'indicates how much energy food provides ' +
              'for the body to function, move, and ' +
              'maintain vital processes.'
          )
        )
      ),
      listItem(
        paragraph(
          text('The '),
          bold('ingredient list'),
          text(
            ' should be listed in descending order by ' +
              'weight. It is important to appreciate ' +
              'that the ingredients must be listed as ' +
              'per the guidelines of AAFCO, and that ' +
              'our understanding of an ingredient, ' +
              'such as chicken (most of us would think ' +
              'of purely chicken meat), by the AAFCO ' +
              'standards can include flesh, skin and ' +
              'bone of the chicken.'
          )
        )
      ),
      listItem(
        paragraph(
          text('The '),
          bold('guaranteed analysis (GA)'),
          text(
            '. This is a list of the minimum amount of ' +
              'crude protein and fat, and maximum amount ' +
              'of fiber and moisture. These four must be ' +
              'included on the label in the GA to meet ' +
              'AAFCO standards, but some companies will ' +
              'choose to list other nutrients in the GA ' +
              'as well.'
          )
        )
      )
    ),

    paragraph(
      text(
        'The more you look at pet food labels, the ' +
          'easier this process becomes, so try ' +
          'practicing on the pet food and treats you ' +
          'have at home.'
      )
    ),

    heading2(text('Beyond AAFCO: What else needs consideration?')),

    paragraph(
      text(
        'AAFCO standards are focused on the minimum ' +
          'standard of basic nutritional requirements ' +
          'that are needed to sustain health '
      ),
      hyperlink(
        'https://www.aafco.org/consumers/' + 'understanding-pet-food/',
        'at each life stage'
      ),
      text(
        '. Whilst this is a good starting point, many ' +
          'owners would prefer to go much further than ' +
          'the minimum standards to nutritionally ' +
          'support their dogs\u2019 health.'
      )
    ),

    heading3(text('Extra clinically proven ingredients')),

    paragraph(
      text(
        'Some additions to a diet \u2013 such as omega ' +
          'oils \u2013 can have added health benefits, ' +
          'such as reducing inflammation in the body. ' +
          'A pet company focused on meeting the minimum ' +
          'standards alone may choose not to add omega ' +
          'oils, whereas a premium brand may consider ' +
          'the health benefits of omega oils and ' +
          'include them in their formulations. However, ' +
          'it\u2019s also important to be cautious ' +
          'here \u2013 brands sometimes add unproven ' +
          'additional ingredients or use them in such ' +
          'small quantities they may not actually make ' +
          'a difference to the dog \u2013 they\u2019re ' +
          'typically there as a marketing tool. ' +
          'Deciding what additional inclusions in a ' +
          'diet are beneficial for health, and which ' +
          'are there for marketing, can be difficult ' +
          'for pet owners to navigate.'
      )
    ),

    heading3(text('Indicators of brand quality')),

    paragraph(
      text(
        'When choosing a pet food, you should also ' +
          'check whether they employ a nutritionist. ' +
          'A board-certified veterinary nutritionist ' +
          'or a PhD in animal nutrition are not needed ' +
          'to meet AAFCO standards. However if a ' +
          'company chooses to involve a qualified ' +
          'professional with an interest in both ' +
          'nutrition and animal health in creation of ' +
          'the food, this can be a sign of a good ' +
          'brand. You can also look for other ' +
          'indications of brand quality, such as ' +
          'interests and contributions to research ' +
          'and quality assurance processes.'
      )
    ),

    heading3(text('Pets with additional needs')),

    paragraph(
      text(
        'AAFCO recommends the minimum (or maximum, ' +
          'for some nutrients) amount of protein and ' +
          'fat to be present in a diet. For some pets, ' +
          'the AAFCO minimums may not be suitable for ' +
          'their needs. For example, fiber is not ' +
          'considered an essential nutrient, so ' +
          'there\u2019s no established minimum ' +
          'requirement. However, some senior dogs may ' +
          'be prone to constipation, so could benefit ' +
          'from a fiber- and moisture-rich diet to ' +
          'promote gastrointestinal motility.'
      )
    ),
    paragraph(
      text(
        'Extra nutritional support is also needed when ' +
          'health concerns arise. Conditions such as ' +
          'kidney disease, pancreatitis, heart disease, ' +
          'diabetes, and obesity may need specific ' +
          'nutritional support as part of their ' +
          'management. For example, in dogs who are ' +
          'prone to pancreatitis, a low-fat diet might ' +
          'be recommended. Since AAFCO only recommends ' +
          'the minimum fat content of the diet with no ' +
          'maximum, a diet can be AAFCO-compliant and ' +
          'still risk triggering a flare up of ' +
          'pancreatitis if the fat level is too high ' +
          'for a specific individual. This is a good ' +
          'example of why pets with specific health ' +
          'conditions need prescription diets (or ' +
          'diets formulated for them by a veterinary ' +
          'nutritionist) for best results.'
      )
    ),
    paragraph(
      text(
        'Dogs who have dietary intolerances or ' +
          'allergies will need careful dietary ' +
          'management. AAFCO helps by recommending the ' +
          'pet food label contains an ingredients list, ' +
          'which allows you to determine if the product ' +
          'contains what your pet is allergic to ' +
          '\u2013 whether that is beef, wheat, chicken, ' +
          'or something else \u2013 that may lead to ' +
          'allergic flare ups. However, labelling law ' +
          'doesn\u2019t require the protein sources to ' +
          'always be named \u2013 the phrases ' +
          '\u201Cmeat meal\u201D or, \u201Cmeat and ' +
          'bone meal\u201D are legally allowed and can ' +
          'contain parts of any mammal. These will not ' +
          'be suitable if your pet has a specific ' +
          'protein allergy, but may also want to be ' +
          'avoided for personal preference if you ' +
          'prefer to know what has gone into your ' +
          'pet\u2019s food. Depending on the quality ' +
          'control measures used during production, ' +
          'there\u2019s also a risk of ' +
          'cross-contamination. This means that even ' +
          'if a suspected allergen is not on the ' +
          'ingredients list, it can sometimes be ' +
          'possible for foods to come into contact ' +
          'with those ingredients.'
      )
    ),

    heading2(text('Summary')),

    paragraph(
      text(
        'Deciphering the wording on a pet food label ' +
          'can be intimidating, especially when you ' +
          'know that diet you feed your pet can have ' +
          'lifelong impacts on health. By understanding ' +
          'what the AAFCO standards are, you can select ' +
          'a diet that meets all of your pet\u2019s ' +
          'minimum nutritional needs. However, AAFCO ' +
          'isn\u2019t the whole story. A diet can meet ' +
          'AAFCO standards, and still not be suitable ' +
          'for your pet, and some diets exceed the ' +
          'AAFCO standards with the quality and range ' +
          'of ingredients used. When choosing a diet, ' +
          'there are many factors to take into account, ' +
          'and AAFCO standards are just one of these ' +
          'considerations.'
      )
    ),
    paragraph(
      text(
        'Choosing a pet food is a huge decision, as ' +
          'your pet will likely be fed this diet daily ' +
          'for many years. This puts a lot of pressure ' +
          'on pet owners to make an educated diet ' +
          'choice, and not be swayed by colorful ' +
          'packaging or marketing techniques. If you ' +
          'have any doubts, your veterinarian will be ' +
          'happy to research the diet you are ' +
          'considering and advise if it is suitable ' +
          'for your pet\u2019s needs.'
      )
    ),
  ],
}

/* ------------------------------------------------------------------ */
/*  Blog post 2 – What "Complete & Balanced" Really Means              */
/* ------------------------------------------------------------------ */

const completeBalancedContent = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    paragraph(
      text(
        'Fresh pet food has become increasingly popular ' +
          'in the pet nutrition space. As interest in ' +
          'fresh diets grows, so does confusion around ' +
          'how to evaluate whether these foods meet a ' +
          'pet\u2019s nutritional needs. With more ' +
          'options comes more confusing marketing, ' +
          'making it harder for pet parents to tell the ' +
          'difference between what looks healthy and ' +
          'what is healthy.'
      )
    ),
    paragraph(
      text(
        'One phrase that appears frequently is ' +
          'complete and balanced. This is not a ' +
          'marketing term, but a specific nutritional ' +
          'claim. Understanding what it means is ' +
          'essential when assessing whether a food is ' +
          'appropriate as a pet\u2019s primary diet.'
      )
    ),

    heading2(
      text('What \u201Ccomplete and balanced\u201D ' + 'actually means')
    ),

    paragraph(
      text(
        'Dogs and cats have requirements for several ' +
          'nutrients that they need to get from their ' +
          'food including things like amino acids, ' +
          'fatty acids, vitamins and minerals. Each ' +
          'year, the '
      ),
      hyperlink(
        'https://www.aafco.org/',
        'American Association of Feed Control ' + 'Officials (AAFCO)'
      ),
      text(
        ' publishes requirement levels for dogs and ' +
          'cats based on their life stage ' +
          '(gestation/lactation, growth, and adult ' +
          'maintenance).'
      )
    ),
    paragraph(
      text(
        'AAFCO is a non-profit organization that sets ' +
          'standards for both animal feeds and pet ' +
          'foods in the United States, including ' +
          'nutrient profiles and '
      ),
      hyperlink(
        'https://www.aafco.org/consumers/' + 'understanding-pet-food/',
        'labeling guidance'
      ),
      text(
        '. Their Pet Food Label Modernization project ' +
          'aims to make labels more transparent and ' +
          'easier for consumers to understand.'
      )
    ),
    paragraph(
      text('Per AAFCO, \u201C'),
      hyperlink(
        'https://www.aafco.org/consumers/' + 'understanding-pet-food/',
        'complete and balanced'
      ),
      text(
        '\u201D has a defined regulatory meaning. ' +
          'Complete means all required nutrients are ' +
          'present. Balanced means they are present in ' +
          'the correct amounts and proportions, so your ' +
          'pet is not getting too much of one nutrient ' +
          'while missing out on another important one.'
      )
    ),
    paragraph(
      text(
        'How can we tell if a food is \u201Ccomplete ' +
          'and balanced\u201D? This information will be ' +
          'reported on the pet food label and the key ' +
          'phrase to look for is the nutritional ' +
          'adequacy statement. This is one of the most ' +
          'important parts of the label because it ' +
          'indicates whether the food is complete and ' +
          'balanced and therefore appropriate to be ' +
          'fed as your pet\u2019s main diet. It will ' +
          'also specify which life stage it is designed ' +
          'for, such as growth, maintenance, or all ' +
          'life stages. Sometimes the nutritional ' +
          'adequacy statement can be difficult to find ' +
          'because it is not always in the same ' +
          'location on the label. You may have read ' +
          'carefully to find it, but '
      ),
      hyperlink(
        'https://www.aafco.org/consumers/' + 'understanding-pet-food/',
        'according to AAFCO'
      ),
      text(
        ', the required nutritional adequacy statement ' +
          'will be located on the back or sides of ' +
          'the package and in small print.'
      )
    ),
    paragraph(
      text(
        'This statement is the key to answering the ' +
          'real question: can this food serve as the ' +
          'main diet for my pet, and does it provide ' +
          'them with all of the nutrients they need ' +
          'for the life stage they are in?'
      )
    ),

    heading2(text('Formulated vs feeding trials')),

    paragraph(
      text(
        'How does a pet food company know that their ' +
          'product is complete and balanced? Once you ' +
          'find the nutritional adequacy statement, ' +
          'you will usually see one of two proof ' +
          'styles: formulated or feeding trials.'
      )
    ),
    paragraph(
      text(
        'Formulated to meet AAFCO nutrient profiles ' +
          'means the recipe was designed to hit ' +
          'specific nutrient targets for a given life ' +
          'stage. Companies do this by using ingredient ' +
          'nutrient data, formulation software, and ' +
          'nutrient testing. When it is done well, ' +
          'formulated diets can absolutely be complete ' +
          'and balanced.'
      )
    ),
    paragraph(
      text(
        'The second, real-life option is animal ' +
          'feeding trials conducted in accordance ' +
          'with AAFCO guidelines. This means the food ' +
          'was put through a feeding trial, where dogs ' +
          'eat that diet as their primary food for a ' +
          'set time period while defined health ' +
          'markers are monitored. It is a real-world ' +
          'check that the diet supports them during ' +
          'maintenance or growth in real animals ' +
          'eating the actual food day after day. This ' +
          'can '
      ),
      hyperlink(
        'https://www.fda.gov/animal-veterinary/' +
          'animal-health-literacy/' +
          'complete-and-balanced-pet-food',
        'help identify issues'
      ),
      text(
        ' that look fine on paper but do not play ' +
          'well in a living body, such as ' +
          'digestibility problems. This information ' +
          'is not included on the label, so we may ' +
          'not know whether a company has done a ' +
          'feeding trial in a research setting or ' +
          'with pet dogs.'
      )
    ),
    paragraph(
      text(
        'Neither method is considered superior. What ' +
          'matters most is how well the method is ' +
          'carried out. Consistent execution is ' +
          'critical, especially for fresh foods where ' +
          'ingredient and nutrient variability can be ' +
          'higher.'
      )
    ),
    paragraph(
      text('A '),
      hyperlink('/formulation', 'thoughtfully formulated food'),
      text(
        ' from a company ' +
          'that tests batches, monitors nutrient ' +
          'levels over time, and maintains strong ' +
          'quality control can be an excellent choice. ' +
          'A feeding trial is also valuable, but it ' +
          'has drawbacks. Feeding trials are typically ' +
          'conducted on a relatively small group of ' +
          'animals over a limited time, so while they ' +
          'provide helpful information, they do not ' +
          'predict every long-term outcome.'
      )
    ),
    paragraph(
      text(
        'Both phrases indicate how the company ' +
          'supports its claim of being complete and ' +
          'balanced, and they give pet owners a ' +
          'starting point for asking better questions. ' +
          'If your pet is a healthy adult, a ' +
          'well-made, formulated diet may be a great ' +
          'choice. If you have a puppy or kitten, it ' +
          'is especially important to confirm the life ' +
          'stage statement and consider brands with ' +
          'demonstrated consistency over time.'
      )
    ),

    heading2(text('Intermittent or supplemental feeding')),

    paragraph(
      text(
        'Some fresh pet foods are not intended to be ' +
          'fed as a primary diet. Products labeled ' +
          'for intermittent or supplemental feeding ' +
          'only do not meet AAFCO requirements for ' +
          'complete and balanced nutrition. These ' +
          'should not be used as the sole source of ' +
          'food, unless specifically recommended by a ' +
          'veterinarian.'
      )
    ),
    paragraph(
      text(
        'These diets are meant to support an already ' +
          'complete diet, not replace it.'
      )
    ),
    paragraph(
      text(
        'In contrast, foods labeled as complete and ' +
          'balanced are formulated to meet a ' +
          'pet\u2019s full nutritional needs and can ' +
          'be fed as the primary diet.'
      )
    ),
    paragraph(text('This distinction matters.')),
    paragraph(
      text(
        'Feeding a supplemental product as a full ' +
          'meal, even with good intentions, can lead ' +
          'to nutrient imbalances over time. The ' +
          'nutritional adequacy statement tells you ' +
          'exactly how the food should be used.'
      )
    ),

    heading2(text('What this means in practice')),

    paragraph(
      text(
        'A complete and balanced diet is built on ' +
          'formulation, not presentation. The ' +
          'nutritional adequacy statement tells you ' +
          'whether a food can be fed every day or ' +
          'only as a supplement. This matters most ' +
          'in fresh diets, where appearance and ' +
          'ingredient lists can create a false sense ' +
          'of completeness. Some foods may appear ' +
          'healthy, containing a variety of fruits, ' +
          'vegetables, and \u201Csuperfoods\u201D. ' +
          'However, it can be difficult to tell the ' +
          'exact nutrient profile of a diet just by ' +
          'looking at ingredients, which is why it is ' +
          'crucial to look for that nutritional ' +
          'adequacy statement.'
      )
    ),
    paragraph(
      text(
        'What keeps pets healthy is consistency in ' +
          'meeting established nutritional standards, ' +
          'not how the food looks in the bowl.'
      )
    ),
  ],
}

/* ------------------------------------------------------------------ */
/*  Build entry-shaped objects                                         */
/* ------------------------------------------------------------------ */

function makeBlogPostEntry(opts: {
  id: string
  title: string
  subtitle: string
  slug: string
  author: BlogPostEntry['fields']['author']
  content: N
  createdAt: string
  updatedAt: string
  references?: string[]
}): BlogPostEntry {
  return {
    sys: {
      id: opts.id,
      type: 'Entry',
      createdAt: opts.createdAt,
      updatedAt: opts.updatedAt,
      locale: 'en-US',
      contentType: {
        sys: {
          id: 'blogPost',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      space: {
        sys: {
          id: 'hardcoded',
          type: 'Link',
          linkType: 'Space',
        },
      },
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 1,
    },
    fields: {
      title: opts.title,
      subtitle: opts.subtitle,
      slug: opts.slug,
      author: opts.author,
      content: opts.content,
      ...(opts.references ? { references: opts.references } : {}),
    },
    metadata: { tags: [], concepts: [] },
  } as unknown as BlogPostEntry
}

export const HARDCODED_BLOG_SLUGS = [
  'what-aafco-is-and-what-it-isnt',
  'what-complete-and-balanced-really-means',
] as const

export const HARDCODED_BLOG_POSTS: BlogPostEntry[] = [
  makeBlogPostEntry({
    id: 'hardcoded-aafco',
    title: 'What AAFCO Is \u2013 and What It Isn\u2019t',
    subtitle:
      'Understanding what AAFCO means, why it matters, ' +
      'and what else to consider when choosing a pet food.',
    slug: 'what-aafco-is-and-what-it-isnt',
    author: authorCorinne,
    content: aafcoContent,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z',
  }),
  makeBlogPostEntry({
    id: 'hardcoded-complete-balanced',
    title:
      'What \u201CComplete & Balanced\u201D Really Means ' +
      '(Especially for Fresh Food)',
    subtitle:
      'Learn what the nutritional adequacy statement on ' +
      'pet food labels means and why it matters for ' +
      'your pet\u2019s diet.',
    slug: 'what-complete-and-balanced-really-means',
    author: authorShannon,
    content: completeBalancedContent,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z',
  }),
]
