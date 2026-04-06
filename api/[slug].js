export default function handler(req, res) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.redirect(302, '/');
  }

  const clean = slug.trim().replace(/[^a-zA-Z0-9_-]/g, '');

  if (!clean) {
    return res.redirect(302, '/');
  }

  return res.redirect(301, `https://monkeytype.com/profile/${clean}`);
}
