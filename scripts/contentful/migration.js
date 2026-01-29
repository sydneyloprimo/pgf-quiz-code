/* eslint-disable no-undef */
module.exports = function (migration) {
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
}
