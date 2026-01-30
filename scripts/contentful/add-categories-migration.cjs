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

  // Add categories field to existing BlogPost content type
  const blogPost = migration.editContentType('blogPost')

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
