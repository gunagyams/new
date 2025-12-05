# Wedding Photography Website - Preview Guide

## 🎨 Preview Your Website

### Option 1: Local Preview (Recommended)

1. **Open the HTML files directly in your browser:**
   ```
   Double-click on any .html file to open it in your default browser
   ```

2. **Pages available:**
   - `index.html` - Homepage
   - `about.html` - About page
   - `stories.html` - Gallery page
   - `blog.html` - Blog page
   - `contact.html` - Contact page

### Option 2: Python Simple Server

If you have Python installed:

```bash
# Navigate to project folder
cd /path/to/project

# Start server
python3 -m http.server 8000

# Open browser to:
http://localhost:8000/index.html
```

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📸 Placeholder Images

The website currently has **gradient placeholder images** in place:
- ✅ 3 hero slideshow images (warm brown to tan gradients)
- ✅ 2 style showcase images (wedding style placeholders)
- ✅ 1 photographer image
- ✅ 6 gallery images
- ✅ 6 blog images
- ✅ Contact hero image

**Replace these with your actual wedding photos before deploying!**

## 🔍 What to Check

### Homepage (index.html)
✓ Hero slideshow rotates every 5 seconds
✓ "Start Your Story" call-to-action button
✓ Punjabi & Western style showcase cards
✓ 10 testimonials slider (auto-advances)
✓ Footer with links

### About Page (about.html)
✓ Personal story section
✓ Behind-the-camera philosophy cards
✓ Animated statistics (250+ weddings, 10+ years, etc.)
✓ CTA button

### Stories Page (stories.html)
✓ Filter buttons (All, Punjabi, Western, Destination)
✓ 6 gallery cards
✓ Click on gallery shows "Access Required" modal
✓ Locked galleries have lock icon

### Blog Page (blog.html)
✓ 6 blog post cards in grid
✓ Newsletter subscription form
✓ Post metadata (date, category)

### Contact Page (contact.html)
✓ Hero image with overlay
✓ Contact form with validation
✓ Contact information sidebar
✓ Social media links

## 📱 Responsive Testing

Test on different screen sizes:

1. **Desktop** (1200px+)
   - Open browser DevTools (F12)
   - Check layout at 1920px, 1440px, 1200px

2. **Tablet** (768px - 1024px)
   - Test at 1024px, 768px
   - Navigation should still be horizontal

3. **Mobile** (320px - 767px)
   - Test at 480px, 375px, 320px
   - Navigation becomes hamburger menu
   - Single column layouts
   - Touch-friendly buttons

## 🎯 Interactive Features to Test

### Navigation
- [ ] Hover effects on links
- [ ] Active page highlighting
- [ ] Mobile hamburger menu toggles
- [ ] Smooth scroll to sections

### Hero Slideshow
- [ ] Auto-rotates every 5 seconds
- [ ] Smooth fade transitions
- [ ] Overlay darkens images properly
- [ ] Text remains readable

### Testimonials
- [ ] Auto-advances every 8 seconds
- [ ] Previous/Next buttons work
- [ ] Smooth slide transitions

### Gallery
- [ ] Filter buttons change active state
- [ ] Galleries filter correctly
- [ ] Locked galleries show modal
- [ ] Modal close button works

### Forms
- [ ] Contact form validates required fields
- [ ] Email validation works
- [ ] Success message displays
- [ ] Newsletter form works

## 🎨 Design Elements to Notice

### Color Scheme
- **Primary:** Dark charcoal (#2c2c2c)
- **Secondary:** Warm brown (#8b7355)
- **Accent:** Tan (#c9a882)
- **Light:** Off-white (#f8f7f4)

### Typography
- **Headings:** Cormorant Garamond (elegant serif)
- **Body:** Montserrat (clean sans-serif)

### Animations
- Fade-in on page load
- Hover effects on cards and buttons
- Smooth scroll behavior
- Counter animations on stats
- Slide transitions

## 🐛 Known Limitations (Preview Only)

1. **Database Features:**
   - Contact form submissions (will work when deployed with Supabase)
   - Blog posts (shows sample data)
   - Newsletter signups (will work when deployed)

2. **Images:**
   - Currently showing placeholder gradients
   - Replace with actual wedding photos

3. **Social Media Links:**
   - Currently point to "#" (update with your URLs)

## ✅ Before Deployment Checklist

- [ ] Replace all placeholder images with real photos
- [ ] Update "Elite Photography" with your studio name
- [ ] Add your contact information
- [ ] Update social media links
- [ ] Test contact form with Supabase
- [ ] Optimize all images (200-500KB each)
- [ ] Add your personal story in about.html

## 📊 Performance Check

The website is optimized for:
- ✅ Fast loading (< 3 seconds)
- ✅ Mobile-first responsive
- ✅ SEO friendly meta tags
- ✅ Lazy loading images
- ✅ Compressed CSS/JS
- ✅ Browser caching ready

## 🎬 Next Steps

1. Review all pages in your browser
2. Test on mobile device
3. Replace placeholder images
4. Customize content
5. Deploy to Hostinger

---

**Enjoy exploring your new website!**

The design is inspired by modern wedding photography portfolios with a focus on elegance, simplicity, and showcasing your beautiful work.