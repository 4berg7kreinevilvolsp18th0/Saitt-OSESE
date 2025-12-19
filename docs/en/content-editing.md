# Content Editing Guide

Simple guide for editing news, guides, and other content on the site.

## Logging In

1. Go to `/admin/login` on your site
2. Enter your email and password
3. You'll see the admin dashboard

## Creating New Content

1. Click **"Контент"** in the sidebar
2. Click **"+ Создать материал"**
3. Fill out the form:

### Content Type

Pick one:
- **Новость** - News and announcements
- **Гайд** - How-to guides and instructions  
- **FAQ** - Frequently asked questions

### Status

- **Черновик** - Saved but not visible on site
- **Опубликовано** - Visible to everyone
- **Архив** - Hidden but kept in system

### Title

Write a clear, descriptive title. Example: "How to Apply for Scholarship"

The **Slug** (URL) is auto-generated from the title, but you can change it.

### Content

Write your content here. You can use Markdown for formatting.

## Markdown Basics

Markdown is a simple way to format text. Here's what you need:

### Headers

```
# Big Header
## Medium Header  
### Small Header
```

### Bold and Italic

```
**bold text**
*italic text*
```

### Lists

Bullet list:
```
- Item one
- Item two
- Item three
```

Numbered list:
```
1. First step
2. Second step
3. Third step
```

### Links

```
[Link text](https://example.com)
```

### Example

```
# Important Announcement

This is **very important** news for all students.

## What You Need to Do

1. Read this carefully
2. Follow the steps
3. Contact us if needed

More info [here](https://example.com).
```

## Editing Existing Content

1. Go to **Контент**
2. Find the item you want to edit
3. Click **"Редактировать"**
4. Make your changes
5. Click **"Сохранить"**

Changes appear immediately if the content is published.

## Publishing and Unpublishing

**To publish:**
- Edit the content
- Change status to **"Опубликовано"**
- Save

**To unpublish:**
- Change status to **"Черновик"** or **"Архив"**
- Save

## Tips

1. **Always preview before publishing** - Check for typos and formatting
2. **Use drafts** - Save unfinished work as drafts
3. **Clear titles** - Make titles descriptive but not too long
4. **Check after publishing** - Open the published page to make sure it looks right

## Common Questions

**Q: How do I delete content?**
A: Change status to "Архив". It disappears from the site but stays in the database.

**Q: Can I edit published content?**
A: Yes, just edit and save. Changes appear immediately.

**Q: What if I forget my password?**
A: Contact the system administrator.

**Q: How do I add images?**
A: Upload images to an image hosting service (like Imgur) and use the link in Markdown:
```
![Image description](https://image-url.com/image.jpg)
```

## Need Help?

- Check the [troubleshooting guide](troubleshooting.md)
- Contact the site administrator
- Make sure you have the right permissions (board, lead, or staff role)

