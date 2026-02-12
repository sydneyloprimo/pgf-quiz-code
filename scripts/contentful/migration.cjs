module.exports = function (migration) {
  // Create Category content type
  const category = migration
    .createContentType('category')
    .name('Category')
    .displayField('name')

  category.createField('name').type('Symbol').required(true).name('Name')

  category
    .createField('slug')
    .type('Symbol')
    .required(true)
    .name('Slug')
    .validations([{ unique: true }])

  // Create Author content type
  const author = migration
    .createContentType('author')
    .name('Author')
    .displayField('name')

  author.createField('name').type('Symbol').required(true).name('Name')

  author.createField('title').type('Symbol').required(true).name('Title')

  author
    .createField('profilePicture')
    .type('Link')
    .linkType('Asset')
    .name('Profile Picture')

  // Create BlogPost content type
  const blogPost = migration
    .createContentType('blogPost')
    .name('Blog Post')
    .displayField('title')

  blogPost.createField('title').type('Symbol').required(true).name('Title')

  blogPost.createField('subtitle').type('Symbol').name('Subtitle')

  blogPost
    .createField('slug')
    .type('Symbol')
    .required(true)
    .name('Slug')
    .validations([{ unique: true }])

  blogPost
    .createField('author')
    .type('Link')
    .linkType('Entry')
    .name('Author')
    .validations([{ linkContentType: ['author'] }])

  blogPost.createField('content').type('RichText').name('Content')

  blogPost
    .createField('categories')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['category'] }],
    })
    .name('Categories')
}
