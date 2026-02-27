import { config } from 'dotenv'
import { GraphQLClient, gql } from 'graphql-request'

import { PRODUCT_CONFIGS } from '@/constants'

config({ path: '.env.local' })

const API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`

const client = new GraphQLClient(API_URL, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': `${process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN}`,
  },
})

const query = gql`
  query getProductVariants($variantIds: [ID!]!) {
    nodes(ids: $variantIds) {
      ... on ProductVariant {
        id
        title
        product {
          title
        }
        sellingPlanAllocations(first: 10) {
          edges {
            node {
              sellingPlan {
                id
                name
                options {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

async function fetchSellingPlans() {
  const variantIds = [
    PRODUCT_CONFIGS.turkey.variantId,
    PRODUCT_CONFIGS.lamb.variantId,
    PRODUCT_CONFIGS.pancreatic.variantId,
  ].filter(Boolean)

  try {
    const data = await client.request(query, { variantIds })
    console.log(JSON.stringify(data, null, 2))

    const results: Record<string, { weekly?: string; biweekly?: string }> = {}

    data.nodes.forEach((node: any) => {
      if (node?.sellingPlanAllocations?.edges) {
        const plans: { weekly?: string; biweekly?: string } = {}

        node.sellingPlanAllocations.edges.forEach((edge: any) => {
          const plan = edge.node.sellingPlan
          const planName = plan.name.toLowerCase()

          // Try to identify weekly vs biweekly based on name or options
          if (planName.includes('week') || planName.includes('weekly')) {
            if (
              planName.includes('bi') ||
              planName.includes('2') ||
              planName.includes('two')
            ) {
              plans.biweekly = plan.id
            } else {
              plans.weekly = plan.id
            }
          }
        })

        // Extract variant ID number for key
        const variantIdNum = node.id.split('/').pop()
        results[variantIdNum] = plans
      }
    })

    console.log('\n=== Selling Plan IDs ===')
    console.log(JSON.stringify(results, null, 2))

    return results
  } catch (error) {
    console.error('Error fetching selling plans:', error)
    throw error
  }
}

fetchSellingPlans()
