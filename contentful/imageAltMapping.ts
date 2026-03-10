/**
 * Maps image paths (canonical, e.g. /images/home/logo.png) to en.json translation keys
 * for image alt text. Used by syncImagesToContentful to set asset description.
 *
 * Keys use dot notation (e.g. Home.Benefits.imageAlt). Values are resolved from en.json.
 */

export const IMAGE_ALT_MAPPING: Record<string, string> = {
  // Home
  '/images/home/new-benefit-dog.jpg': 'Home.Benefits.imageAlt',
  '/images/home/clinically-approved-dog.jpg':
    'Home.ClinicallyApproved.imageAlt',
  '/images/home/golden-meals-bg.jpg': 'Home.GoldenMeals.imageAlt',
  '/images/home/hero-bg.jpg': 'Home.Hero.imageAlt',
  '/images/home/boston-announcement-bg.jpg':
    'Home.BostonAnnouncement.backgroundImageAlt',
  '/images/home/dog-standing.svg': 'Home.Features.dogStandingAlt',
  '/images/home/footer-dog.png': 'Footer.footerImageAlt',
  '/images/shop-products.png': 'Home.ShopProducts.image_alt',
  '/images/quality-control.png': 'Home.ShopProducts.quality_alt',
  '/images/returns.png': 'Home.ShopProducts.returns_alt',
  // About
  '/images/about/gallery/image1.jpg': 'About.Gallery.image1Alt',
  '/images/about/gallery/image2.jpg': 'About.Gallery.image2Alt',
  '/images/about/gallery/image3.jpg': 'About.Gallery.image3Alt',
  '/images/about/mission-1.jpg': 'About.Mission.image1Alt',
  '/images/about/mission-2.jpg': 'About.Mission.image2Alt',
  '/images/about/leadership.jpg': 'About.Leadership.imageAlt',
  '/icons/leadership-signature.svg': 'About.Leadership.signature',
  '/images/about/expert-1.png': 'About.Experts.expert1ImageAlt',
  '/images/about/expert-2.png': 'About.Experts.expert2ImageAlt',
  '/images/about/expert-3.jpg': 'About.Experts.expert3ImageAlt',
  // Auth
  '/icons/logo-black.svg': 'Auth.logoAlt',
  '/icons/cross.svg': 'Auth.closeIconAlt',
  '/images/login-logo-full.svg': 'Auth.logoAlt',
  // Footer
  '/icons/footer-logo.svg': 'Footer.logoAlt',
  // Common
  '/images/animal-welfare-certified.png':
    'Common.ProductDetailPanel.certifiedBadgeAlt',
  '/images/product-detail-main.png': 'Common.ProductDetailPanel.mainImageAlt',
  '/images/product-detail-thumbnail-2.png':
    'Common.ProductDetailPanel.thumbnailAlt',
  '/images/product-detail-thumbnail-3.png':
    'Common.ProductDetailPanel.thumbnailAlt',
  // Quiz
  '/images/body-shape-light-lean.svg':
    'Quiz.bodyShape.options.lightLean.imageAlt',
  '/images/body-shape-ideal-balanced.svg':
    'Quiz.bodyShape.options.idealBalanced.imageAlt',
  '/images/body-shape-slightly-filled.svg':
    'Quiz.bodyShape.options.slightlyFilled.imageAlt',
  '/images/body-shape-full-round.svg':
    'Quiz.bodyShape.options.fullRound.imageAlt',
  '/images/quiz-results-illustration.svg': 'Quiz.resultsHeader.imageAlt',
  // Recipes
  '/icons/recipes-decoration.svg': 'Recipes.Hero.clinicallyApprovedAlt',
  '/images/recipes/ready-to-build-plan.png': 'Recipes.CTA.ctaImageAlt',
  '/images/recipes/recipe-bowl-lamb.png': 'Recipes.Detail.lambImageAlt',
  '/images/recipes/recipe-bowl-seafood.png': 'Recipes.Detail.seafoodImageAlt',
  '/images/recipes/recipe-bowl-turkey.png': 'Recipes.Detail.turkeyImageAlt',
  '/images/recipes/cta-dog.jpg': 'Recipes.CTA.ctaImageAlt',
  // Formulation
  '/images/formulation/hero-bg.png': 'Formulation.Hero.backgroundAlt',
  '/images/formulation/precision-batch.jpg': 'Formulation.Precision.imageAlt',
  '/images/formulation/discover-plans-bg-new.jpg':
    'Formulation.DiscoverPlans.backgroundAlt',
  // Blog
  '/images/blog-featured-desktop.png':
    'BlogIndex.FeaturedBlogPost.featuredImageAlt',
  '/images/blog-featured-mobile.png':
    'BlogIndex.FeaturedBlogPost.featuredImageAlt',
  // NotFound
  '/images/404-dog-bowl.svg': 'NotFound.dogBowlAlt',
} as const
