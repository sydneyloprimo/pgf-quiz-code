require('dotenv').config({ path: '.env.local' })
const contentful = require('contentful-management')

// Configure these values
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MANAGEMENT_TOKEN =
  process.env.CONTENTFUL_MANAGEMENT_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('Error: Missing required environment variables')
  console.error(
    'Please set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN'
  )
  process.exit(1)
}

const ENVIRONMENT_ID = process.argv.includes('--master') ? 'master' : 'staging'

// Category data
const categories = [
  { name: 'Nutrition', slug: 'nutrition' },
  { name: 'Digestive Health', slug: 'digestive-health' },
  { name: 'Small Breed', slug: 'small-breed' },
  { name: 'Fresh Food', slug: 'fresh-food' },
  { name: 'Clinical Guide', slug: 'clinical-guide' },
  { name: 'Diet Transition', slug: 'diet-transition' },
]

// Author data
const authors = [
  {
    name: 'Dr. Corinne Wigfall',
    title: 'BVMBVS(Hons) BVMedSci(Hons) MRCVS',
    imageUrl: 'https://i.pravatar.cc/300?img=47',
  },
  {
    name: 'Dr. Shannon Barrett',
    title: 'DVM',
    imageUrl: 'https://i.pravatar.cc/300?img=12',
  },
]

// Blog post data with category slugs
const blogPosts = [
  {
    title: 'Stool Consistency in Small Breed Dogs: Normal and Not',
    subtitle:
      'Observable markers of digestive health, when variation warrants attention, and how meal composition affects GI transit time.',
    slug: 'stool-consistency-small-breed-dogs',
    categoryIds: ['digestive-health', 'small-breed', 'clinical-guide'],
    content: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-2',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Clinical Takeaway',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'unordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Why it matters: Stool consistency reflects digestive efficiency, GI transit time, and nutrient absorption—all particularly variable in small-breed dogs due to proportional differences in intestinal length and metabolic rate.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'What to watch at home: Observe stool form (formed vs. loose), frequency relative to meals, and color. Consistency should remain stable day-to-day when diet and routine are unchanged.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Stool quality is one of the most accessible indicators of digestive health, yet what constitutes "normal" varies considerably among individual dogs. In small breeds, this variation can be more pronounced due to differences in gut anatomy, transit time, and the proportion of dietary intake relative to body surface area.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'blockquote',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Definition: GI Transit Time',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value:
                    'The duration from ingestion to defecation. In small-breed dogs, transit time typically ranges from 8–12 hours, though individual variation exists.',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        {
          nodeType: 'heading-3',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Factors Influencing Stool Quality',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Multiple dietary and physiological factors converge to determine stool characteristics. Understanding these variables helps distinguish normal variation from clinically significant changes.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'ordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Fiber content: Both soluble and insoluble fiber affect stool bulk and water retention. Small breeds may show more pronounced responses to fiber modifications.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Protein digestibility: Higher-quality protein sources typically result in smaller, more formed stools with less odor.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Fat percentage: Excessive dietary fat can lead to soft or greasy stools, while inadequate fat may result in dry, crumbly output.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Hydration status: Dehydration manifests in harder, drier stools, independent of dietary composition.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'The interplay between these factors becomes particularly evident when transitioning between diets. Fresh food diets, with their higher moisture content and bioavailable nutrients, often produce smaller stool volume—a positive indicator of improved digestibility.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'blockquote',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Clinical Note: The Bristol Stool Scale Adapted',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value:
                    'While originally developed for humans, a similar 7-point scale applies to canine stool consistency: Types 3-4 (formed, slightly soft but maintains shape) represent ideal consistency for most dogs.',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        {
          nodeType: 'heading-3',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'When to Seek Veterinary Guidance',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Not all variations in stool quality require intervention, but certain patterns warrant professional evaluation. Persistent changes lasting more than 48 hours, presence of blood or mucus, concurrent symptoms like vomiting or lethargy, or acute onset of watery diarrhea all merit veterinary consultation.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'For small breed dogs specifically, rapid deterioration can occur due to their limited glycogen reserves and higher surface area to body weight ratio. What appears as a minor digestive upset in larger breeds may progress more quickly in dogs under 25 pounds.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
  {
    title: 'The Benefits of Fresh Food Diets for Small Dogs',
    subtitle:
      'Understanding how fresh, whole-food ingredients support digestive health and overall wellness in small breed dogs.',
    slug: 'benefits-fresh-food-small-dogs',
    categoryIds: ['fresh-food', 'nutrition', 'small-breed'],
    content: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-2',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Clinical Takeaway',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'unordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Fresh food diets provide higher bioavailability of nutrients compared to heavily processed alternatives.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Small breed dogs often show improved coat quality and energy levels within 4-6 weeks of transitioning.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Fresh food diets represent a paradigm shift in canine nutrition, moving away from heavily processed kibble toward minimally processed, whole-food ingredients. Research indicates that fresh diets may offer superior digestibility and nutrient bioavailability compared to traditional dry foods.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
  {
    title: 'Pumpkin as a Digestive Aid: Science and Practice',
    subtitle:
      'Examining the nutritional profile and digestive benefits of pumpkin in canine diets.',
    slug: 'pumpkin-digestive-aid-dogs',
    categoryIds: ['digestive-health', 'nutrition'],
    content: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Pumpkin has gained recognition as a valuable functional ingredient in canine nutrition, particularly for its role in supporting digestive health. Rich in soluble fiber and containing prebiotic properties, pumpkin can help regulate bowel movements in both directions—firming loose stools while also preventing constipation.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'blockquote',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Clinical Note: Fiber Content',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value:
                    'Pumpkin contains approximately 3g of fiber per cup, with an optimal ratio of soluble to insoluble fiber that supports digestive motility and microbiome health.',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        {
          nodeType: 'heading-2',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Nutritional Benefits',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Beyond fiber, pumpkin provides beta-carotene, potassium, and essential vitamins that support immune function and cellular health. The low caloric density makes it an excellent ingredient for weight management while maintaining satiety.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
  {
    title: 'Protein Quality in Canine Nutrition: What Really Matters',
    subtitle:
      'Understanding protein bioavailability, amino acid profiles, and their impact on small breed health.',
    slug: 'protein-quality-canine-nutrition',
    categoryIds: ['nutrition', 'small-breed', 'clinical-guide'],
    content: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-2',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Clinical Takeaway',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'unordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Protein quality matters more than quantity—complete amino acid profiles support muscle maintenance and metabolic function.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value:
                        'Fresh protein sources typically offer higher digestibility coefficients than rendered meals.',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Not all protein is created equal. The biological value of protein—determined by its amino acid profile and digestibility—varies significantly across sources. Fresh meats generally provide superior amino acid availability compared to heavily processed protein meals.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
  {
    title: 'Transitioning to Fresh Food: A Clinical Approach',
    subtitle:
      'Evidence-based strategies for successfully switching small breed dogs to fresh food diets.',
    slug: 'transitioning-fresh-food-dogs',
    categoryIds: ['fresh-food', 'diet-transition', 'clinical-guide'],
    content: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Dietary transitions require careful planning to minimize digestive upset while allowing the gut microbiome to adapt. A gradual transition over 7-10 days typically yields the best outcomes, though individual dogs may require longer adjustment periods.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'heading-2',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'The Transition Protocol',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'ordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Days 1-3: 25% new food, 75% old food',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Days 4-6: 50% new food, 50% old food',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Days 7-9: 75% new food, 25% old food',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Day 10+: 100% new food',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: 'blockquote',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Clinical Tip',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value:
                    'Monitor stool quality daily during transition. Temporary softening is normal, but persistent diarrhea warrants slowing the transition pace.',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      ],
    },
  },
]

async function uploadImage(space, environment, imageUrl, fileName) {
  try {
    console.log(`  Fetching image from ${imageUrl}...`)
    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()

    console.log(`  Uploading ${fileName}...`)
    const upload = await environment.createUpload({
      file: buffer,
    })

    console.log(`  Creating asset ${fileName}...`)
    const asset = await environment.createAsset({
      fields: {
        title: {
          'en-US': fileName,
        },
        file: {
          'en-US': {
            contentType: 'image/jpeg',
            fileName: fileName,
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: upload.sys.id,
              },
            },
          },
        },
      },
    })

    console.log(`  Processing asset...`)
    const processedAsset = await asset.processForAllLocales()
    console.log(`  Publishing asset...`)
    return await processedAsset.publish()
  } catch (error) {
    console.error(`  Error uploading image: ${error.message}`)
    throw error
  }
}

async function createCategory(environment, categoryData) {
  console.log(`Creating category: ${categoryData.name}`)

  const category = await environment.createEntry('category', {
    fields: {
      name: {
        'en-US': categoryData.name,
      },
      slug: {
        'en-US': categoryData.slug,
      },
    },
  })

  console.log(`Publishing category: ${categoryData.name}`)
  return await category.publish()
}

async function createAuthor(environment, authorData, profilePictureAsset) {
  console.log(`\nCreating author: ${authorData.name}`)

  const author = await environment.createEntry('author', {
    fields: {
      name: {
        'en-US': authorData.name,
      },
      title: {
        'en-US': authorData.title,
      },
      profilePicture: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: profilePictureAsset.sys.id,
          },
        },
      },
    },
  })

  console.log(`Publishing author: ${authorData.name}`)
  return await author.publish()
}

async function createBlogPost(environment, postData, authorEntry, categoryMap) {
  console.log(`\nCreating blog post: ${postData.title}`)

  const categoryLinks =
    postData.categoryIds?.map((slug) => ({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: categoryMap[slug].sys.id,
      },
    })) || []

  const blogPost = await environment.createEntry('blogPost', {
    fields: {
      title: {
        'en-US': postData.title,
      },
      subtitle: {
        'en-US': postData.subtitle,
      },
      slug: {
        'en-US': postData.slug,
      },
      author: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: authorEntry.sys.id,
          },
        },
      },
      content: {
        'en-US': postData.content,
      },
      categories: {
        'en-US': categoryLinks,
      },
    },
  })

  console.log(`Publishing blog post: ${postData.title}`)
  return await blogPost.publish()
}

async function seed() {
  console.log('Starting Contentful seed process...\n')
  console.log(`Space ID: ${SPACE_ID}`)

  try {
    const client = contentful.createClient({
      accessToken: MANAGEMENT_TOKEN,
    })

    console.log('Getting space...')
    const space = await client.getSpace(SPACE_ID)

    console.log(`Getting environment [${ENVIRONMENT_ID}]...`)
    const environment = await space.getEnvironment(ENVIRONMENT_ID)

    // Create categories
    console.log('\n=== Creating Categories ===')
    const categoryMap = {}

    for (let i = 0; i < categories.length; i++) {
      const categoryData = categories[i]
      console.log(
        `[${i + 1}/${categories.length}] Creating ${categoryData.name}`
      )
      const category = await createCategory(environment, categoryData)
      categoryMap[categoryData.slug] = category
      console.log(`✓ Category created: ${categoryData.name}`)
    }

    // Create authors with profile pictures
    console.log('\n\n=== Creating Authors ===')
    const createdAuthors = []

    for (let i = 0; i < authors.length; i++) {
      const authorData = authors[i]
      console.log(
        `\n[${i + 1}/${authors.length}] Processing ${authorData.name}`
      )

      const profilePicture = await uploadImage(
        space,
        environment,
        authorData.imageUrl,
        `${authorData.name.replace(/\s+/g, '-').toLowerCase()}.jpg`
      )

      const author = await createAuthor(environment, authorData, profilePicture)
      createdAuthors.push(author)
      console.log(`✓ Author created: ${authorData.name}`)
    }

    // Create blog posts with random authors
    console.log('\n\n=== Creating Blog Posts ===')

    for (let i = 0; i < blogPosts.length; i++) {
      const postData = blogPosts[i]
      const randomAuthor =
        createdAuthors[Math.floor(Math.random() * createdAuthors.length)]

      console.log(
        `\n[${i + 1}/${blogPosts.length}] Creating post by ${randomAuthor.fields.name['en-US']}`
      )
      await createBlogPost(environment, postData, randomAuthor, categoryMap)
      console.log(`✓ Blog post created: ${postData.title}`)
    }

    console.log('\n\n✅ Seed process completed successfully!')
    console.log(
      `\n📝 Created ${categories.length} categories, ${createdAuthors.length} authors, and ${blogPosts.length} blog posts`
    )
    console.log('\nYou can now view the blog posts at:')
    blogPosts.forEach((post) => {
      console.log(`  - http://localhost:3000/blog/${post.slug}`)
    })
  } catch (error) {
    console.error('\n❌ Error during seed process:', error)
    process.exit(1)
  }
}

seed()
