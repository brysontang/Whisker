function emailHtml({ url, host }) {
  const escapedHost = host.replace(/\./g, '&#8203;.');

  return `
    <body style="font-family: sans-serif; background: #fdf6e3; color: #3c3836; margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-height: 100vh;">
        <tr>
          <td align="center" valign="middle">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #f5e6d3; border: 4px solid #d6b88d; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
              <tr>
                <td style="padding: 40px;">
                  <h1 style="font-size: 2.25rem; font-weight: 800; text-align: center; margin-bottom: 20px; font-family: serif; color: #3c3836;">🍽️ Whisker Recipes</h1>
                  <h2 style="font-size: 1.5rem; font-weight: 600; text-align: center; color: #504945; margin-bottom: 20px; font-family: 'Courier New', monospace;">Sign in to ${escapedHost}</h2>
                  <p style="text-align: center; color: #665c54; margin-bottom: 30px; font-size: 1rem; line-height: 1.5; font-family: 'Courier New', monospace;">Discover and share delicious recipes from grandma's kitchen.</p>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #d6b88d; color: #3c3836; text-decoration: none; border-radius: 0.375rem; font-weight: 600; font-size: 1rem; transition: all 0.3s ease; font-family: 'Courier New', monospace;">
                          <span style="display: flex; align-items: center; justify-content: center;">
                            Sign in to your recipe box
                          </span>
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="text-align: center; color: #665c54; margin-top: 30px; font-size: 0.875rem; font-family: 'Courier New', monospace;">If you didn't request this email, you can safely ignore it.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;
}

function text({ url, host }) {
  return `Sign in to ${host}\n\nClick the link below to sign in:\n\n${url}\n\n`;
}

export { emailHtml, text };
