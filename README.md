# ZAX Technologies & Consulting — Website

Static company website (HTML, CSS, vanilla JS — no build step), published with GitHub Pages.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Configuration

- **Enquiry email:** set `CONTACT_EMAIL` at the top of `script.js`. The contact form opens a pre-filled email draft to this address.
- **Custom domain:** add a `CNAME` file containing your domain and configure DNS per GitHub Pages docs.
