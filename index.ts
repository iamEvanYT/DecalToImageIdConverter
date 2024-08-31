import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import xmlparser from 'xml-js'

const app = new Hono()

// Serve static files from the 'static' directory
app.use('/*', serveStatic({ root: './static' }))

// API route for decal conversion
app.get('/api/convert/:decalId', async (c) => {
  const decalId = c.req.param('decalId')
  
  try {
    const response = await fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${decalId}`)
    const xmlData = await response.text()
    
    const xml = xmlparser.xml2json(xmlData, {
      compact: true,
      spaces: 4
    });
    const parsedXML = JSON.parse(xml);
    const resultURL = parsedXML.roblox.Item.Properties.Content.url._text;
    const imageId = resultURL.split("=")[1];
    
    return c.json({ imageId })
  } catch (error) {
    return c.json({ error: 'Failed to convert Decal ID' }, 500)
  }
})

export default {
  port: 3000,
  fetch: app.fetch
}