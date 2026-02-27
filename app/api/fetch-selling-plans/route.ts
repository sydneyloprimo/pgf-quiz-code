import { request, gql } from 'graphql-request'
import { NextResponse } from 'next/server'

import { PRODUCT_CONFIGS } from '@/constants'

export async function GET() {
  try {
    const variantIds = [
      PRODUCT_CONFIGS.turkey.variantId,
      PRODUCT_CONFIGS.lamb.variantId,
      PRODUCT_CONFIGS.pancreatic.variantId,
    ].filter(Boolean)

    if (variantIds.length === 0) {
      return NextResponse.json(
        { error: 'No variant IDs configured in environment variables' },
        { status: 500 }
      )
    }

    const query = gql`
      query getVariantSellingPlans($variantIds: [ID!]!) {
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

    const data = await request(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
      query,
      { variantIds },
      {
        'X-Shopify-Storefront-Access-Token':
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      }
    )

    const results: Record<
      string,
      {
        weekly?: string
        biweekly?: string
        all: Array<{ id: string; name: string }>
      }
    > = {}

    data.nodes.forEach((node: any) => {
      if (node?.sellingPlanAllocations?.edges) {
        const plans: {
          weekly?: string
          biweekly?: string
          all: Array<{ id: string; name: string }>
        } = { all: [] }

        node.sellingPlanAllocations.edges.forEach((edge: any) => {
          const plan = edge.node.sellingPlan
          plans.all.push({ id: plan.id, name: plan.name })

          const planName = plan.name.toLowerCase()

          // Try to identify weekly vs biweekly based on name or options
          if (planName.includes('week') || planName.includes('weekly')) {
            if (
              planName.includes('bi') ||
              planName.includes('2') ||
              planName.includes('two') ||
              planName.includes('every 2')
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

    return NextResponse.json({ data: results, raw: data })
  } catch (error: any) {
    console.error('Error fetching selling plans:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch selling plans' },
      { status: 500 }
    )
  }
}
